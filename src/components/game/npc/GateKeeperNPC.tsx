import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { playerPositionRef, bossGateProximity } from "@/stores/worldRefs";
import { BOSS_TYPE, BOSS_STATS } from "@/constants/boss";

const { entryPosition: BOSS_ENTRY_POSITION, entryRadius: BOSS_ENTRY_RADIUS } =
  BOSS_STATS[BOSS_TYPE.RED_GUARDIAN];
const GATE_VEC = new THREE.Vector3(...BOSS_ENTRY_POSITION);

export function GateKeeperNPC() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    bossGateProximity.isNear =
      playerPositionRef.current.distanceTo(GATE_VEC) < BOSS_ENTRY_RADIUS * 2;

    if (outerRef.current) outerRef.current.rotation.y = t * 0.8;
    if (innerRef.current) innerRef.current.rotation.y = -t * 1.2;
  });

  return (
    <group position={BOSS_ENTRY_POSITION}>
      <mesh ref={outerRef}>
        <torusGeometry args={[1.6, 0.2, 8, 32]} />
        <meshBasicMaterial color="#CC2222" />
      </mesh>
      <mesh ref={innerRef}>
        <torusGeometry args={[1.1, 0.1, 6, 24]} />
        <meshBasicMaterial color="#FF6600" />
      </mesh>
      <mesh>
        <circleGeometry args={[1.05, 32]} />
        <meshBasicMaterial color="#440000" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <circleGeometry args={[2.2, 32]} />
        <meshBasicMaterial color="#CC2222" transparent opacity={0.12} />
      </mesh>
      <Billboard position={[0, 2.8, 0]}>
        <Text
          fontSize={0.28}
          color="#FF4444"
          outlineWidth={0.05}
          outlineColor="#000000"
          anchorX="center"
          anchorY="middle"
        >
          ⚔ 붉은 수호자의 방
        </Text>
      </Billboard>
    </group>
  );
}
