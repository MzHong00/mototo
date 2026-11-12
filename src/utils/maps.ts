import { rasterizeBlueprint } from "@/utils/mapBlueprint";
import { buildRoomMap } from "@/utils/dungeonRoom";
import { DUNGEONS } from "@/constants/maps/dungeons";
import { MAP_SPECS, ROOM_ID_SEPARATOR, START_TARGET } from "@/constants/maps/registry";
import { LEVEL_HEIGHT, TILE_SIZE } from "@/constants/game/terrain";
import { SPAWN_DROP } from "@/constants/game/movement";

import type { DungeonDef, MapDef, TravelTarget } from "@/types/world";
import type { TileMapData } from "@/types/terrain";

const cache = new Map<string, MapDef>(); // 한 번 만든 맵은 다시 쓰기 (설계도 → 칸 변환 생략)

/** 전투맵 방 맵 id면 그 전투맵 */
export const dungeonOf = (mapId: string): DungeonDef | undefined =>
  DUNGEONS.find((d) => mapId.startsWith(`${d.id}${ROOM_ID_SEPARATOR}`));

/** 맵 id → 맵 (첫 섬·본 맵은 설계도에서, 전투맵 방은 방 생성기에서) */
export function getMapDef(mapId: string): MapDef {
  const cached = cache.get(mapId);
  if (cached) return cached;
  const dungeon = dungeonOf(mapId);
  const spec = MAP_SPECS[mapId] ?? MAP_SPECS[START_TARGET.map];
  const def: MapDef = dungeon
    ? buildRoomMap(dungeon, mapId.slice(dungeon.id.length + ROOM_ID_SEPARATOR.length))
    : {
        id: spec.id,
        name: spec.name,
        kind: spec.kind,
        exits: spec.exits,
        dungeonId: spec.dungeonId,
        tiles: rasterizeBlueprint(spec.blueprint),
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

/** 이동 목적지 → 월드 도착 위치 (바닥 조금 위에서 떨어뜨림) */
export function spawnPoint(target: TravelTarget): [number, number, number] {
  const { tiles } = getMapDef(target.map);
  const cell = markCenter(tiles, target.entry) ?? markCenter(tiles, "@") ?? { x: 0.5, z: 0.5 };
  const level = Number(tiles.heights[Math.floor(cell.z)]?.[Math.floor(cell.x)] ?? 0);
  const { width, depth } = mapSize(tiles);
  return [
    (cell.x - width / 2) * TILE_SIZE,
    level * LEVEL_HEIGHT + SPAWN_DROP,
    (cell.z - depth / 2) * TILE_SIZE,
  ];
}
