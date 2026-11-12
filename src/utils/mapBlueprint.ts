import { hash2, valueNoise } from "@/utils/noise";
import { RAMP_UP } from "@/utils/terrain";
import {
  BEACH_BAND,
  COAST_NOISE,
  COAST_NOISE_SCALE,
  FOREST_DENSITY,
  RAMP_LENGTH,
  ROCK_DENSITY,
  SPARSE_TREE_DENSITY,
  TREE_JITTER,
  TREE_PATH_CLEARANCE,
} from "@/constants/game/mapGen";

import type { BlueprintArea, MapBlueprint } from "@/types/world";
import type { ObjectPlacement, TileMapData } from "@/types/terrain";

type Grid = string[][];

/** 영역 안 칸 좌표 목록 */
export function areaTiles(area: BlueprintArea): [number, number][] {
  if ("rect" in area) {
    const [x0, z0, w, h] = area.rect;
    return Array.from({ length: w * h }, (_, i) => [x0 + (i % w), z0 + Math.floor(i / w)]);
  }
  const [cx, cz, r] = area.circle;
  const size = Math.ceil(r) * 2 + 1;
  return Array.from({ length: size * size }, (_, i): [number, number] => [
    Math.floor(cx - Math.ceil(r)) + (i % size),
    Math.floor(cz - Math.ceil(r)) + Math.floor(i / size),
  ]).filter(([x, z]) => Math.hypot(x + 0.5 - cx, z + 0.5 - cz) <= r);
}

const isInArea = (area: BlueprintArea, x: number, z: number) =>
  "rect" in area
    ? x >= area.rect[0] &&
      x < area.rect[0] + area.rect[2] &&
      z >= area.rect[1] &&
      z < area.rect[1] + area.rect[3]
    : Math.hypot(x + 0.5 - area.circle[0], z + 0.5 - area.circle[1]) <= area.circle[2];

/** 꺾은선의 가운데 칸들 (구간마다 가로 또는 세로) — [x, z, 진행 dx, 진행 dz] */
function pathCenterline(points: [number, number][]) {
  const cells: [number, number, number, number][] = [];
  points.slice(1).forEach(([bx, bz], i) => {
    const [ax, az] = points[i];
    const dx = Math.sign(bx - ax);
    const dz = Math.sign(bz - az);
    const steps = Math.max(Math.abs(bx - ax), Math.abs(bz - az));
    Array.from({ length: steps + 1 }, (_, k) => cells.push([ax + dx * k, az + dz * k, dx, dz]));
  });
  return cells;
}

/** 경사로 글자 — (dx, dz) 쪽으로 올라감 */
const rampKind = (dx: number, dz: number) =>
  Object.keys(RAMP_UP).find((k) => RAMP_UP[k][0] === dx && RAMP_UP[k][1] === dz) ?? "p";

/**
 * 설계도 → 칸 지도.
 * 순서: 섬 모양(노이즈 해안선) → 칠하기(층·바닥) → 길(층 경계마다 경사로 자동) → 표시 → 물체(고정 + 나무·바위)
 */
export function rasterizeBlueprint(bp: MapBlueprint): TileMapData {
  const { width, depth, seed } = bp;
  const fill = (c: string): Grid => Array.from({ length: depth }, () => Array(width).fill(c));
  const heights = fill("0");
  const kinds = fill("w");
  const marks = fill(".");
  const inside = (x: number, z: number) => x >= 0 && z >= 0 && x < width && z < depth;

  // 1) 섬 모양 — 타원 거리 + 노이즈. 해안 띠는 모래
  const rx = (width / 2) * bp.coast;
  const rz = (depth / 2) * bp.coast;
  kinds.forEach((row, z) =>
    row.forEach((_, x) => {
      const d =
        Math.hypot((x + 0.5 - width / 2) / rx, (z + 0.5 - depth / 2) / rz) +
        (valueNoise(x / COAST_NOISE_SCALE + seed, z / COAST_NOISE_SCALE) - 0.5) * COAST_NOISE;
      if (d < 1) row[x] = d > 1 - BEACH_BAND ? "s" : "g";
    }),
  );

  // 2) 칠하기 — 층은 땅에만 (바닥을 함께 정하면 물도 땅으로)
  bp.paints.forEach((paint) =>
    areaTiles(paint.area).forEach(([x, z]) => {
      if (!inside(x, z)) return;
      if (paint.kind) kinds[z][x] = paint.kind;
      if (paint.level !== undefined && kinds[z][x] !== "w") heights[z][x] = String(paint.level);
    }),
  );

  // 3) 길 — 폭만큼 흙길(물 위면 둑길). 이어서 한 층 차이 경계마다 아래층 쪽에 경사로
  const lines = bp.paths.map((path) => ({ path, cells: pathCenterline(path.points) }));
  const crossCells = (x: number, z: number, dx: number, dz: number, width: number) =>
    Array.from({ length: width }, (_, i): [number, number] => {
      const o = i - Math.floor((width - 1) / 2); // 짝수 폭도 정수 칸
      return [x + (dz !== 0 ? o : 0), z + (dx !== 0 ? o : 0)];
    });
  lines.forEach(({ path, cells }) =>
    cells.forEach(([x, z, dx, dz]) =>
      crossCells(x, z, dx, dz, path.width).forEach(([cx, cz]) => {
        if (!inside(cx, cz)) return;
        if (kinds[cz][cx] === "w") heights[cz][cx] = "0";
        kinds[cz][cx] = "p";
      }),
    ),
  );
  lines.forEach(({ path, cells }) =>
    cells.forEach(([bx, bz, dx, dz], i) => {
      const [ax, az] = [bx - dx, bz - dz];
      const prev = cells[i - 1];
      if (!prev || prev[0] !== ax || prev[1] !== az || !inside(bx, bz)) return; // 구간이 꺾이는 칸은 건너뜀
      const diff = Number(heights[bz][bx]) - Number(heights[az][ax]);
      if (Math.abs(diff) !== 1) return;
      // 오르막이면 경계 앞(a 쪽)으로, 내리막이면 경계 뒤(b 쪽)로 경사로를 깐다
      const [sx, sz, step] = diff > 0 ? [ax, az, -1] : [bx, bz, 1];
      const kind = diff > 0 ? rampKind(dx, dz) : rampKind(-dx, -dz);
      // 아래층과 같은 높이의 길 칸에만 깐다 (꺾인 곳·다른 경계를 넘어 풀밭·물이 경사로가 되지 않게)
      const lower = heights[sz][sx];
      Array.from({ length: RAMP_LENGTH }, (_, k) =>
        crossCells(sx + dx * step * k, sz + dz * step * k, dx, dz, path.width).forEach(
          ([cx, cz]) => {
            if (inside(cx, cz) && kinds[cz][cx] === "p" && heights[cz][cx] === lower)
              kinds[cz][cx] = kind;
          },
        ),
      );
    }),
  );

  // 4) 표시 글자
  bp.marks.forEach(({ area, mark }) =>
    areaTiles(area).forEach(([x, z]) => {
      if (inside(x, z)) marks[z][x] = mark;
    }),
  );

  // 5) 물체 — 고정 물체 + 평평한 풀밭에 나무·바위 (길·표시 근처는 비움)
  const objects: ObjectPlacement[] = bp.props.map((p) => ({
    type: p.type,
    x: p.at[0] + 0.5,
    z: p.at[1] + 0.5,
    rot: p.rot ?? 0,
  }));
  const c = TREE_PATH_CLEARANCE;
  const near = Array.from({ length: (2 * c + 1) ** 2 }, (_, i) => [
    (i % (2 * c + 1)) - c,
    Math.floor(i / (2 * c + 1)) - c,
  ]);
  const propNear = (x: number, z: number) =>
    bp.props.some((p) => Math.abs(p.at[0] - x) <= c + 1 && Math.abs(p.at[1] - z) <= c + 1);
  kinds.forEach((row, z) =>
    row.forEach((kind, x) => {
      if (kind !== "g") return;
      const level = heights[z][x];
      const isOpen = near.every(([dx, dz]) => {
        const k = kinds[z + dz]?.[x + dx];
        return (
          (k === "g" || k === "s") &&
          heights[z + dz][x + dx] === level &&
          marks[z + dz][x + dx] === "."
        );
      });
      if (!isOpen || propNear(x, z)) return;
      const roll = hash2(x + seed * 31, z - seed * 17);
      const density = bp.forests.some((f) => isInArea(f, x, z))
        ? FOREST_DENSITY
        : SPARSE_TREE_DENSITY;
      const jx = (hash2(x * 3.1, z + seed) - 0.5) * TREE_JITTER;
      const jz = (hash2(z * 2.7, x - seed) - 0.5) * TREE_JITTER;
      const rot = hash2(x + 0.3, z + 0.7) * Math.PI * 2;
      if (roll < density)
        objects.push({ type: bp.treeType ?? "tree", x: x + 0.5 + jx, z: z + 0.5 + jz, rot });
      else if (roll > 1 - ROCK_DENSITY) objects.push({ type: "rock", x: x + 0.5, z: z + 0.5, rot });
    }),
  );

  return {
    id: bp.id,
    heights: heights.map((r) => r.join("")),
    kinds: kinds.map((r) => r.join("")),
    marks: marks.map((r) => r.join("")),
    objects,
    colors: bp.colors,
  };
}
