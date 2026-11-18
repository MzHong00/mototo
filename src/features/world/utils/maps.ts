import { rasterizeBlueprint } from "@/features/world/utils/mapBlueprint";
import { MAP_SPECS, START_TARGET } from "@/features/world/constants/maps/registry";
import { LEVEL_HEIGHT, TILE_SIZE } from "@/features/world/constants/terrain";
import { SPAWN_DROP } from "@/features/world/constants/movement";

import type { MapDef, TravelTarget } from "@/features/world/types/world";
import type { TileMapData } from "@/features/world/types/terrain";

const cache = new Map<string, MapDef>(); // 한 번 만든 맵은 다시 쓰기 (설계도 → 칸 변환 생략)

/** 맵 id → 맵 (설계도에서 칸 지도 생성. 없는 id면 시작 맵) */
export function getMapDef(mapId: string): MapDef {
  const cached = cache.get(mapId);
  if (cached) return cached;
  const spec = MAP_SPECS[mapId] ?? MAP_SPECS[START_TARGET.map];
  const def: MapDef = {
    id: spec.id,
    name: spec.name,
    exits: spec.exits,
    tiles: {
      ...rasterizeBlueprint(spec.blueprint, spec.theme.flora),
      colors: spec.theme.colors,
    },
    mood: spec.theme.mood,
  };
  cache.set(mapId, def);
  return def;
}

/** 지도 크기 */
export const mapSize = (tiles: TileMapData) => ({
  width: tiles.kinds[0].length,
  depth: tiles.kinds.length,
});

/** 칸 좌표(소수 가능) → 월드 좌표 */
export function tileToWorld(tiles: TileMapData, x: number, z: number) {
  const { width, depth } = mapSize(tiles);
  return { x: (x - width / 2) * TILE_SIZE, z: (z - depth / 2) * TILE_SIZE };
}

/** 월드 좌표 → 칸 좌표 */
export function worldToTile(tiles: TileMapData, x: number, z: number) {
  const { width, depth } = mapSize(tiles);
  return { x: Math.floor(x / TILE_SIZE + width / 2), z: Math.floor(z / TILE_SIZE + depth / 2) };
}

/** 표시 글자 칸들의 가운데 (칸 좌표, 소수) — 없으면 null */
export function markCenter(tiles: TileMapData, mark: string) {
  const cells = tiles.marks.flatMap((row, z) =>
    [...row].flatMap((m, x) => (m === mark ? [[x + 0.5, z + 0.5]] : [])),
  );
  if (cells.length === 0) return null;
  return {
    x: cells.reduce((sum, c) => sum + c[0], 0) / cells.length,
    z: cells.reduce((sum, c) => sum + c[1], 0) / cells.length,
  };
}

/** 칸 좌표(소수 가능) → 그 칸 바닥 높이가 담긴 월드 좌표 */
export function tileToWorldOnGround(tiles: TileMapData, x: number, z: number) {
  const level = Number(tiles.heights[Math.floor(z)]?.[Math.floor(x)] ?? 0);
  return { ...tileToWorld(tiles, x, z), y: level * LEVEL_HEIGHT };
}

/** 이동 목적지 → 월드 도착 위치 (바닥 조금 위에서 떨어뜨림) */
export function spawnPoint(target: TravelTarget): [number, number, number] {
  const { tiles } = getMapDef(target.map);
  const cell = markCenter(tiles, target.entry) ?? markCenter(tiles, "@") ?? { x: 0.5, z: 0.5 };
  const p = tileToWorldOnGround(tiles, cell.x, cell.z);
  return [p.x, p.y + SPAWN_DROP, p.z];
}
