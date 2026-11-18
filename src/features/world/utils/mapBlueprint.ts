import { hash2 } from "@/utils/noise";
import { RAMP_UP } from "@/features/world/utils/terrain";
import {
  DECOR_JITTER,
  DECOR_PROP_CLEARANCE,
  FOREST_DENSITY,
  RAMP_LENGTH,
  ROCK_DENSITY,
  SPARSE_TREE_DENSITY,
  TREE_JITTER,
  TREE_PATH_CLEARANCE,
} from "@/features/world/constants/mapGen";

import type { BlueprintArea, Dir, MapBlueprint } from "@/features/world/types/world";
import type { MapFlora, WeightedType } from "@/features/world/types/mood";
import type { ObjectPlacement, TileMapData } from "@/features/world/types/terrain";

type Grid = string[][];

/** 영역 안 칸 좌표 목록 */
function areaTiles(area: BlueprintArea): [number, number][] {
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

const SIDES: Dir[] = ["n", "e", "s", "w"];

/**
 * 설계도 → 칸 지도.
 * 순서: 바탕(온통 0층 풀밭) → 칠하기(층·바닥) → 길(층 경계마다 경사로 자동) → 표시 → 물체(고정 + 나무·바위 + 바닥 장식)
 * 나무 종류·장식은 맵 테마 식생(flora)에서 고른다
 */
export function rasterizeBlueprint(bp: MapBlueprint, flora: MapFlora): TileMapData {
  const { width, depth, seed } = bp;
  const fill = (c: string): Grid => Array.from({ length: depth }, () => Array(width).fill(c));
  const heights = fill("0");
  const kinds = fill("g");
  const marks = fill(".");
  const inside = (x: number, z: number) => x >= 0 && z >= 0 && x < width && z < depth;
  const edgeDist: Record<Dir, (x: number, z: number) => number> = {
    n: (_, z) => z,
    s: (_, z) => depth - 1 - z,
    w: (x) => x,
    e: (x) => width - 1 - x,
  }; // 각 가장자리까지 칸 수

  // 1) 칠하기 — 층은 땅에만 (바닥을 함께 정하면 물도 땅으로)
  bp.paints.forEach((paint) =>
    areaTiles(paint.area).forEach(([x, z]) => {
      if (!inside(x, z)) return;
      if (paint.kind) kinds[z][x] = paint.kind;
      if (paint.level !== undefined && kinds[z][x] !== "w") heights[z][x] = String(paint.level);
    }),
  );

  // 2) 길 — 폭만큼 흙길(물 위면 둑길). 이어서 한 층 차이 경계마다 아래층 쪽에 경사로
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

  // 3) 표시 글자
  bp.marks.forEach(({ area, mark }) =>
    areaTiles(area).forEach(([x, z]) => {
      if (inside(x, z)) marks[z][x] = mark;
    }),
  );

  // 4) 물체 — 고정 물체 + 평평한 풀밭에 나무·바위 (길·표시 근처는 비움)
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
  const occupied = new Set<string>(); // 나무·바위가 선 칸 (장식 겹침 방지)
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
      const isForest = bp.forests.some((f) => isInArea(f, x, z));
      const density = isForest ? FOREST_DENSITY : SPARSE_TREE_DENSITY;
      const jx = (hash2(x * 3.1, z + seed) - 0.5) * TREE_JITTER;
      const jz = (hash2(z * 2.7, x - seed) - 0.5) * TREE_JITTER;
      const rot = hash2(x + 0.3, z + 0.7) * Math.PI * 2;
      if (roll < density) {
        const type = pickWeighted(flora.trees, hash2(x * 5.3 + seed, z * 1.9));
        objects.push({ type, x: x + 0.5 + jx, z: z + 0.5 + jz, rot });
        occupied.add(`${x},${z}`);
      } else if (roll > 1 - ROCK_DENSITY) {
        objects.push({ type: "rock", x: x + 0.5, z: z + 0.5, rot });
        occupied.add(`${x},${z}`);
      }
    }),
  );

  // 5) 바닥 장식 — 빈 풀·모래 칸에 테마 장식을 확률로 (출구·도착점·고정 물체 옆은 비움)
  kinds.forEach((row, z) =>
    row.forEach((kind, x) => {
      if ((kind !== "g" && kind !== "s") || marks[z][x] !== "." || occupied.has(`${x},${z}`))
        return;
      if (
        bp.props.some(
          (p) =>
            Math.abs(p.at[0] - x) <= DECOR_PROP_CLEARANCE &&
            Math.abs(p.at[1] - z) <= DECOR_PROP_CLEARANCE,
        )
      )
        return;
      const roll = hash2(x * 1.7 + seed * 13, z * 2.3 - seed);
      const rules = flora.decor.filter((d) => (d.on ?? "g") === kind);
      let acc = 0; // 누적 확률 — 규칙들을 0~1 구간에 이어 붙임
      const hit = rules.find((d) => {
        acc += d.density;
        return roll < acc;
      });
      if (!hit) return;
      objects.push({
        type: hit.type,
        x: x + 0.5 + (hash2(x * 4.1, z * 0.7 + seed) - 0.5) * DECOR_JITTER,
        z: z + 0.5 + (hash2(z * 3.3, x * 0.9 - seed) - 0.5) * DECOR_JITTER,
        rot: hash2(x + 0.9, z + 0.1) * Math.PI * 2,
      });
    }),
  );

  return {
    id: bp.id,
    heights: heights.map((r) => r.join("")),
    kinds: kinds.map((r) => r.join("")),
    marks: marks.map((r) => r.join("")),
    objects,
    // 지도 밖 땅 높이 = 그쪽 가장자리 칸 중 가장 낮은 층
    outskirts: SIDES.map((side) => {
      const edge = kinds.flatMap((row, z) =>
        row.flatMap((k, x) =>
          edgeDist[side](x, z) === 0 && k !== "w" ? [Number(heights[z][x])] : [],
        ),
      );
      return { side, level: edge.length ? Math.min(...edge) : 0 };
    }),
  };
}

/** 무게 비율대로 종류 하나 고르기 (roll 0~1) */
function pickWeighted(list: WeightedType[], roll: number) {
  const total = list.reduce((sum, w) => sum + w.weight, 0);
  let acc = 0; // 누적 무게
  return (
    list.find((w) => {
      acc += w.weight / total;
      return roll < acc;
    }) ?? list[list.length - 1]
  ).type;
}
