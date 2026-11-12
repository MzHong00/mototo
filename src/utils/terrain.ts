import { Color, Vector3 } from "three";

import { valueNoise } from "@/utils/noise";
import {
  BLOCKER_HEIGHT,
  CHUNK_SIZE,
  LEVEL_HEIGHT,
  SEA_SKIP_DISTANCE,
  TERRAIN_COLORS,
  SHADE_AMOUNT,
  SHADE_SCALE,
  TILE_SIZE,
  WATER_DEPTH,
} from "@/constants/game/terrain";

import type { TerrainBuffers, TileKind, TileMapData } from "@/types/terrain";

type Corners = [number, number, number, number]; // 칸 네 모서리 높이: (x0,z0) (x1,z0) (x1,z1) (x0,z1)

export const RAMP_UP: Record<string, [number, number]> = {
  "^": [0, -1],
  v: [0, 1],
  "<": [-1, 0],
  ">": [1, 0],
}; // 경사로가 올라가는 방향
const EDGES: { dx: number; dz: number; mine: [number, number]; theirs: [number, number] }[] = [
  { dx: 0, dz: -1, mine: [0, 1], theirs: [3, 2] }, // 북
  { dx: 1, dz: 0, mine: [1, 2], theirs: [0, 3] }, // 동
  { dx: 0, dz: 1, mine: [2, 3], theirs: [1, 0] }, // 남
  { dx: -1, dz: 0, mine: [3, 0], theirs: [2, 1] }, // 서
];
const CORNER_OFFSET: [number, number][] = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];
const EPS = 1e-4;

/** 메시 하나에 사각형을 계속 붙이는 버퍼 (면마다 꼭짓점 4개 → 평평한 면 음영) */
class QuadBuffer {
  positions: number[] = [];
  normals: number[] = [];
  colors: number[] = [];
  indices: number[] = [];
  private a = new Vector3();
  private b = new Vector3();
  private n = new Vector3();

  /** 사각형 추가 — 법선이 facing 쪽을 보도록 감는 방향 자동 보정 */
  push(quad: Vector3[], facing: Vector3, colorAt?: (p: Vector3) => Color) {
    // 대각선끼리 외적 — 한 변이 0인 사각형(경사로 옆 삼각 벽)에서도 법선이 망가지지 않음
    this.a.subVectors(quad[2], quad[0]);
    this.b.subVectors(quad[3], quad[1]);
    this.n.crossVectors(this.a, this.b).normalize();
    if (this.n.dot(facing) < 0) {
      quad = [quad[0], quad[3], quad[2], quad[1]];
      this.n.negate();
    }
    const base = this.positions.length / 3;
    quad.forEach((p) => {
      this.positions.push(p.x, p.y, p.z);
      this.normals.push(this.n.x, this.n.y, this.n.z);
      const color = colorAt?.(p);
      if (color) this.colors.push(color.r, color.g, color.b);
    });
    this.indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
}

/** 위치별 밝기 배율 — 큰 얼룩 + 작은 얼룩. 모서리 위치로 계산해 이웃 칸과 이어져 칸 경계가 안 보임 */
const groundShade = (x: number, z: number) =>
  1 +
  ((valueNoise(x / SHADE_SCALE, z / SHADE_SCALE) - 0.5) * 2 +
    (valueNoise(x / (SHADE_SCALE / 3), z / (SHADE_SCALE / 3)) - 0.5)) *
    SHADE_AMOUNT;

/** 지도 읽기 도우미 — 칸 종류·층·네 모서리 높이 (지형 빌드와 맵 검사가 함께 씀) */
export function tileReader(map: TileMapData) {
  const kindAt = (x: number, z: number) => map.kinds[z]?.[x] ?? "w"; // 지도 밖은 물
  const levelAt = (x: number, z: number) => Number(map.heights[z]?.[x] ?? 0);

  /** 같은 방향 경사로가 몇 칸 이어지는지 (dir 쪽으로) */
  const rampRun = (x: number, z: number, kind: string, dx: number, dz: number) => {
    let count = 0;
    while (kindAt(x + dx * (count + 1), z + dz * (count + 1)) === kind) count++;
    return count;
  };

  /** 칸 네 모서리 높이 — 경사로는 이어진 칸 수만큼 나눠 한 층을 오름 */
  const cornersAt = (x: number, z: number): Corners => {
    const kind = kindAt(x, z);
    const level = levelAt(x, z);
    if (kind === "w") return Array(4).fill(level * LEVEL_HEIGHT - WATER_DEPTH) as Corners;
    const up = RAMP_UP[kind];
    if (!up) return Array(4).fill(level * LEVEL_HEIGHT) as Corners;
    const below = rampRun(x, z, kind, -up[0], -up[1]);
    const total = below + 1 + rampRun(x, z, kind, up[0], up[1]);
    return CORNER_OFFSET.map(([cx, cz]) => {
      const progress = up[0] ? (up[0] > 0 ? cx : 1 - cx) : up[1] > 0 ? cz : 1 - cz;
      return (level + (below + progress) / total) * LEVEL_HEIGHT;
    }) as Corners;
  };

  return { kindAt, levelAt, cornersAt };
}

/** 땅에서 멀리 떨어진 물 칸 표시 — 수면 판이 덮으니 바닥을 그리지 않는다 */
function farSeaMask(map: TileMapData, width: number, depth: number) {
  const isLand = (x: number, z: number) =>
    map.kinds[z]?.[x] !== undefined && map.kinds[z][x] !== "w";
  const r = SEA_SKIP_DISTANCE;
  const offsets = Array.from({ length: (2 * r + 1) ** 2 }, (_, i) => [
    (i % (2 * r + 1)) - r,
    Math.floor(i / (2 * r + 1)) - r,
  ]);
  return Array.from({ length: depth }, (_, z) =>
    Array.from({ length: width }, (_, x) => !offsets.some(([dx, dz]) => isLand(x + dx, z + dz))),
  );
}

/** 칸 글자 지도 → 지형 메시 조각들·충돌체 버퍼. 조각(32칸)마다 메시 1개라 화면 밖 조각은 그리지 않는다 */
export function buildTerrain(map: TileMapData): TerrainBuffers {
  const depth = map.kinds.length;
  const width = map.kinds[0].length;
  const { kindAt, cornersAt } = tileReader(map);
  const palette: Record<string, string> = { ...TERRAIN_COLORS, ...map.colors };
  const isFarSea = farSeaMask(map, width, depth);
  const ox = -(width * TILE_SIZE) / 2; // 지도 가운데를 월드 원점에
  const oz = -(depth * TILE_SIZE) / 2;
  const chunkCols = Math.ceil(width / CHUNK_SIZE);
  const chunks = Array.from(
    { length: chunkCols * Math.ceil(depth / CHUNK_SIZE) },
    () => new QuadBuffer(),
  );
  const collider = new QuadBuffer();
  const color = new Color();
  const up = new Vector3(0, 1, 0);
  const facing = new Vector3();
  const corner = (x: number, z: number, i: number, y: number) =>
    new Vector3(
      ox + (x + CORNER_OFFSET[i][0]) * TILE_SIZE,
      y,
      oz + (z + CORNER_OFFSET[i][1]) * TILE_SIZE,
    );

  map.kinds.forEach((row, z) => {
    [...row].forEach((kind, x) => {
      const isWater = kind === "w";
      if (isWater && isFarSea[z][x]) return;
      const surface = chunks[Math.floor(z / CHUNK_SIZE) * chunkCols + Math.floor(x / CHUNK_SIZE)];
      const mine = cornersAt(x, z);

      // 윗면 — 자연스러운 얼룩 (꼭짓점마다 위치 기반 밝기)
      const topHex = RAMP_UP[kind] ? palette.ramp : palette[kind as TileKind];
      const top = mine.map((y, i) => corner(x, z, i, y));
      surface.push(top, up, (p) => color.set(topHex).multiplyScalar(groundShade(p.x, p.z)));
      if (!isWater) collider.push(top, up);

      // 옆면 — 이웃보다 높은 쪽 가장자리마다 절벽 벽
      EDGES.forEach((edge) => {
        const nx = x + edge.dx;
        const nz = z + edge.dz;
        const theirs = cornersAt(nx, nz);
        const [m1, m2] = edge.mine;
        const [t1, t2] = edge.theirs;
        facing.set(edge.dx, 0, edge.dz);
        if (mine[m1] - theirs[t1] > EPS || mine[m2] - theirs[t2] > EPS) {
          const wall = [
            corner(x, z, m1, mine[m1]),
            corner(x, z, m2, mine[m2]),
            corner(x, z, m2, Math.min(mine[m2], theirs[t2])),
            corner(x, z, m1, Math.min(mine[m1], theirs[t1])),
          ];
          const wallHex = kind === "s" ? palette.bank : palette.cliff;
          surface.push(wall, facing, () => color.set(wallHex));
          collider.push(wall, facing);
        }
        // 물가 투명벽 — 땅에서 물(또는 지도 밖)로 못 나가게
        if (!isWater && kindAt(nx, nz) === "w") {
          collider.push(
            [
              corner(x, z, m1, mine[m1] + BLOCKER_HEIGHT),
              corner(x, z, m2, mine[m2] + BLOCKER_HEIGHT),
              corner(x, z, m2, mine[m2]),
              corner(x, z, m1, mine[m1]),
            ],
            facing.negate(),
          );
        }
      });
    });
  });

  return {
    chunks: chunks
      .filter((c) => c.indices.length > 0)
      .map((c) => ({
        positions: new Float32Array(c.positions),
        normals: new Float32Array(c.normals),
        colors: new Float32Array(c.colors),
        indices: new Uint32Array(c.indices),
      })),
    colliderPositions: new Float32Array(collider.positions),
    colliderIndices: new Uint32Array(collider.indices),
  };
}
