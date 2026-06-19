import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

import { EVERGREEN_FLOOR_TEXTURE_PATH, TREE_COLORS } from "@/constants/map/maps";
import type { MapObjects } from "@/types/map";

interface EvergreenFloorProps {
  objects?: MapObjects;
}

export function EvergreenFloor({ objects }: EvergreenFloorProps) {
  const [width, depth] = objects?.size ?? [40, 40];
  const trees = objects?.trees ?? [];
  const walls = objects?.walls ?? [];

  const baseTexture = useTexture(EVERGREEN_FLOOR_TEXTURE_PATH);

  // 바닥 크기에 맞춰 반복되도록 설정한 텍스처 (hook 반환값 변경 방지 위해 clone)
  const floorTexture = useMemo(() => {
    const texture = baseTexture.clone();
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(width / 2, depth / 2);
    texture.needsUpdate = true;
    return texture;
  }, [baseTexture, width, depth]);

  return (
    <>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial map={floorTexture} />
        </mesh>
      </RigidBody>

      {trees.map(({ pos: [x, z], variant }, i) => {
        const { trunk, mid, top } = TREE_COLORS[variant];
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.75, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.2, 1.5, 6]} />
              <meshStandardMaterial color={trunk} />
            </mesh>
            <mesh position={[0, 2, 0]} castShadow>
              <coneGeometry args={[0.8, 1.6, 6]} />
              <meshStandardMaterial color={mid} />
            </mesh>
            <mesh position={[0, 2.8, 0]} castShadow>
              <coneGeometry args={[0.55, 1.2, 6]} />
              <meshStandardMaterial color={top} />
            </mesh>
          </group>
        );
      })}

      {walls.map(({ pos, size }, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid">
          <mesh position={pos} visible={false}>
            <boxGeometry args={size} />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
