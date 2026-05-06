import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { playerPositionRef, npcProximity } from "@/stores/worldRefs";

const LUCAS_POS: [number, number, number] = [0, 0, -8];
const INTERACT_RANGE = 2.5;
const LUCAS_VEC = new THREE.Vector3(...LUCAS_POS);

export function LucasNPC() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    npcProximity.isNear = playerPositionRef.current.distanceTo(LUCAS_VEC) < INTERACT_RANGE;
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.25;
  });

  return (
    <group ref={groupRef} position={LUCAS_POS}>
      {/* 몸 */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.55, 1.1, 0.45]} />
        <meshStandardMaterial color="#5577BB" />
      </mesh>
      {/* 머리 */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color="#FFCC88" />
      </mesh>
      {/* 모자 */}
      <mesh position={[0, 1.72, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 0.22, 8]} />
        <meshStandardMaterial color="#334488" />
      </mesh>
      <mesh position={[0, 1.83, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.28, 8]} />
        <meshStandardMaterial color="#334488" />
      </mesh>
      {/* 배낭 */}
      <mesh position={[0, 0.85, -0.28]}>
        <boxGeometry args={[0.4, 0.5, 0.2]} />
        <meshStandardMaterial color="#8B5E3C" />
      </mesh>
      <Billboard position={[0, 2.3, 0]}>
        <Text
          fontSize={0.22}
          color="#FFD700"
          outlineWidth={0.04}
          outlineColor="#000"
          anchorX="center"
          anchorY="middle"
        >
          Lucas 상인
        </Text>
      </Billboard>
    </group>
  );
}
