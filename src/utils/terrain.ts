import { Color, Vector3 } from "three";

import {
  BLOCKER_HEIGHT,
  LEVEL_HEIGHT,
  TERRAIN_COLORS,
  TILE_SHADE,
  TILE_SIZE,
  WATER_DEPTH,
} from "@/constants/game/terrain";

import type { TerrainBuffers, TileMapData } from "@/types/terrain";

type Corners = [number, number, number, number]; // 칸 네 모서리 높이: (x0,z0) (x1,z0) (x1,z1) (x0,z1)

const RAMP_UP: Record<string, [number, number]> = {
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
  push(quad: Vector3[], facing: Vector3, color?: Color) {
    this.a.subVectors(quad[1], quad[0]);
    this.b.subVectors(quad[2], quad[0]);
    this.n.crossVectors(this.a, this.b).normalize();
    if (this.n.dot(facing) < 0) {
      quad = [quad[0], quad[3], quad[2], quad[1]];
      this.n.negate();
    }
    const base = this.positions.length / 3;
    quad.forEach((p) => {
      this.positions.push(p.x, p.y, p.z);
      this.normals.push(this.n.x, this.n.y, this.n.z);
      if (color) this.colors.push(color.r, color.g, color.b);
    });
    this.indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
}

/** 칸 글자 지도 → 지형 메시·충돌체 버퍼. 지도 전체가 메시 1개라 그리기 호출 1번 */
export function buildTerrain(map: TileMapData): TerrainBuffers {
  const depth = map.kinds.length;
  const width = map.kinds[0].length;
  const kindAt = (x: number, z: number) => map.kinds[z]?.[x] ?? "w"; // 지도 밖은 물
  const levelAt = (x: number, z: number) => Number(map.heights[z]?.[x] ?? 0);
  const ox = -(width * TILE_SIZE) / 2; // 지도 가운데를 월드 원점에
  const oz = -(depth * TILE_SIZE) / 2;

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

  const surface = new QuadBuffer();
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
      const mine = cornersAt(x, z);

      // 윗면 — 칸마다 살짝 다른 밝기로 바둑판 느낌
      const shade =
        1 + (((x + z) & 1) * 2 - 1) * TILE_SHADE + (((x * 7 + z * 13) % 5) - 2) * TILE_SHADE * 0.4;
      color
        .set(RAMP_UP[kind] ? TERRAIN_COLORS.ramp : TERRAIN_COLORS[kind as "g" | "p" | "s" | "w"])
        .multiplyScalar(shade);
      const top = mine.map((y, i) => corner(x, z, i, y));
      surface.push(top, up, color);
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
          color.set(kind === "s" ? TERRAIN_COLORS.bank : TERRAIN_COLORS.cliff);
          surface.push(wall, facing, color);
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
    positions: new Float32Array(surface.positions),
    normals: new Float32Array(surface.normals),
    colors: new Float32Array(surface.colors),
    indices: new Uint32Array(surface.indices),
    colliderPositions: new Float32Array(collider.positions),
    colliderIndices: new Uint32Array(collider.indices),
  };
}
