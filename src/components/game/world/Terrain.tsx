import { RigidBody, TrimeshCollider } from "@react-three/rapier";

import { useTerrainGeometry } from "@/hooks/useTerrainGeometry";
import {
  TERRAIN_COLORS,
  TRIMESH_FLAGS,
  WATER_OPACITY,
  WATER_PLANE_SIZE,
  WATER_SURFACE_Y,
} from "@/constants/game/terrain";

import type { TrimeshArgs } from "@react-three/rapier";
import type { TileMapData } from "@/types/terrain";

interface TerrainProps {
  map: TileMapData;
}

/** 칸 지형 — 땅 메시 1개 + 수면 1장 + 충돌체 1개 */
export function Terrain({ map }: TerrainProps) {
  const { geometry, colliderPositions, colliderIndices } = useTerrainGeometry(map);

  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        {/* 3번째 인자(flags)는 rapier로 그대로 전달되지만 라이브러리 타입에 빠져 있어 단언 */}
        <TrimeshCollider
          args={[colliderPositions, colliderIndices, TRIMESH_FLAGS] as unknown as TrimeshArgs}
        />
      </RigidBody>
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshLambertMaterial vertexColors />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={WATER_SURFACE_Y}>
        <planeGeometry args={[WATER_PLANE_SIZE, WATER_PLANE_SIZE]} />
        <meshLambertMaterial color={TERRAIN_COLORS.water} transparent opacity={WATER_OPACITY} />
      </mesh>
    </>
  );
}
