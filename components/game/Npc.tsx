"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { playerPositionRef, npcProximity } from "@/stores/worldRefs";

const NPC_POS: [number, number, number] = [-11, 0, 1];
const NPC_VEC = new THREE.Vector3(...NPC_POS);
const INTERACT_RANGE = 2.5;

export function NpcMesh() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const dist = playerPositionRef.current.distanceTo(NPC_VEC);
    npcProximity.isNear = dist < INTERACT_RANGE;

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={NPC_POS}>
      {/* 몸통 */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.55, 1.1, 0.45]} />
        <meshStandardMaterial color="#CC8844" />
      </mesh>
      {/* 머리 */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color="#FFCC88" />
      </mesh>
      {/* 모자 */}
      <mesh position={[0, 1.75, 0]}>
        <coneGeometry args={[0.32, 0.5, 8]} />
        <meshStandardMaterial color="#AA4422" />
      </mesh>
      {/* 간판 */}
      <mesh position={[0.8, 1.2, 0]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.6, 0.4, 0.05]} />
        <meshStandardMaterial color="#FFEECC" />
      </mesh>

      {/* 상호작용 프롬프트 */}
      <Billboard position={[0, 2.3, 0]}>
        <Text fontSize={0.22} color="#FFD700" outlineWidth={0.04} outlineColor="#000" anchorX="center" anchorY="middle">
          상인
        </Text>
      </Billboard>
    </group>
  );
}
