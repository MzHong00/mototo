import { useEffect, useMemo } from "react";
import { BufferAttribute, BufferGeometry } from "three";

import { buildTerrain } from "@/utils/terrain";

import type { TileMapData } from "@/types/terrain";

/** 칸 지도 → 지형 메시(1개)와 충돌체 데이터. 지도가 바뀔 때만 다시 만들고, 이전 것은 GPU에서 해제 */
export function useTerrainGeometry(map: TileMapData) {
  const terrain = useMemo(() => {
    const buffers = buildTerrain(map);
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(buffers.positions, 3));
    geometry.setAttribute("normal", new BufferAttribute(buffers.normals, 3));
    geometry.setAttribute("color", new BufferAttribute(buffers.colors, 3));
    geometry.setIndex(new BufferAttribute(buffers.indices, 1));
    geometry.computeBoundingSphere();
    return {
      geometry,
      colliderPositions: buffers.colliderPositions,
      colliderIndices: buffers.colliderIndices,
    };
  }, [map]);

  // 언마운트·지도 교체 시 GPU 메모리 해제
  useEffect(() => () => terrain.geometry.dispose(), [terrain]);

  return terrain;
}
