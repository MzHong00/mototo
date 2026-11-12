import { useEffect, useMemo } from "react";
import { BufferAttribute, BufferGeometry } from "three";

import { buildTerrain } from "@/utils/terrain";

import type { TileMapData } from "@/types/terrain";

/** 칸 지도 → 지형 메시 조각들과 충돌체 데이터. 지도가 바뀔 때만 다시 만들고, 이전 것은 GPU에서 해제 */
export function useTerrainGeometry(map: TileMapData) {
  const terrain = useMemo(() => {
    const buffers = buildTerrain(map);
    const geometries = buffers.chunks.map((chunk) => {
      const geometry = new BufferGeometry();
      geometry.setAttribute("position", new BufferAttribute(chunk.positions, 3));
      geometry.setAttribute("normal", new BufferAttribute(chunk.normals, 3));
      geometry.setAttribute("color", new BufferAttribute(chunk.colors, 3));
      geometry.setIndex(new BufferAttribute(chunk.indices, 1));
      geometry.computeBoundingSphere(); // 화면 밖 조각 그리기 생략(프러스텀 컬링)에 필요
      return geometry;
    });
    return {
      geometries,
      colliderPositions: buffers.colliderPositions,
      colliderIndices: buffers.colliderIndices,
    };
  }, [map]);

  // 언마운트·지도 교체 시 GPU 메모리 해제
  useEffect(() => () => terrain.geometries.forEach((g) => g.dispose()), [terrain]);

  return terrain;
}
