import { useMemo } from "react";

import { hash2 } from "@/utils/noise";
import { tileToWorldOnGround } from "@/features/world/utils/maps";
import { MAP_OBJECTS, OBJECT_SCALE_VARIATION } from "@/features/world/constants/mapObjects";

import type { TileMapData } from "@/features/world/types/terrain";

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
    const groups = new Map<string, ObjectInstance[]>();
    tiles.objects.forEach((o) => {
      const model = MAP_OBJECTS[o.type];
      if (!model) return;
      const scale = model.isVaried ? 1 + (hash2(o.x, o.z) - 0.5) * OBJECT_SCALE_VARIATION : 1;
      const list = groups.get(o.type) ?? [];
      list.push({ ...tileToWorldOnGround(tiles, o.x, o.z), rot: o.rot, scale });
      groups.set(o.type, list);
    });
    return [...groups.entries()];
  }, [tiles]);
}
