import { useMemo } from "react";

import { hash2 } from "@/utils/noise";
import { mapSize } from "@/utils/maps";
import { LEVEL_HEIGHT, TILE_SIZE } from "@/constants/game/terrain";
import { MAP_OBJECTS, OBJECT_SCALE_VARIATION } from "@/constants/game/mapObjects";

import type { TileMapData } from "@/types/terrain";

export interface ObjectInstance {
  x: number; // 월드 좌표
  y: number;
  z: number;
  rot: number; // y축 회전 (라디안)
  scale: number;
}

/** 맵 물체 배치 → 종류별 월드 위치 목록 (바닥 층 높이에 올림, 나무·바위는 크기를 조금씩 다르게) */
export function useObjectInstances(tiles: TileMapData) {
  return useMemo(() => {
    const { width, depth } = mapSize(tiles);
    const groups = new Map<string, ObjectInstance[]>();
    tiles.objects.forEach((o) => {
      const model = MAP_OBJECTS[o.type];
      if (!model) return;
      const level = Number(tiles.heights[Math.floor(o.z)]?.[Math.floor(o.x)] ?? 0);
      const scale = model.isVaried ? 1 + (hash2(o.x, o.z) - 0.5) * OBJECT_SCALE_VARIATION : 1;
      const list = groups.get(o.type) ?? [];
      list.push({
        x: (o.x - width / 2) * TILE_SIZE,
        y: level * LEVEL_HEIGHT,
        z: (o.z - depth / 2) * TILE_SIZE,
        rot: o.rot,
        scale,
      });
      groups.set(o.type, list);
    });
    return [...groups.entries()];
  }, [tiles]);
}
