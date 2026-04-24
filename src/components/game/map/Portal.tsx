import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { playerPositionRef } from "@/stores/worldRefs";
import { PORTAL_ZONE1_POS, PORTAL_ZONE2_POS, PORTAL_ENTER_RANGE } from "@/constants/world";

const PORTAL_COOLDOWN_MS = 3000;

interface PortalProps {
  zone: number;
  onEnter: () => void;
}

export function Portal({ zone, onEnter }: PortalProps) {
  const pos        = zone === 1 ? PORTAL_ZONE1_POS : PORTAL_ZONE2_POS;
  const label      = zone === 1 ? "다음 구역 →" : "← 이전 구역";
  const outerColor = zone === 1 ? "#FF9900" : "#5BA3FF";

  const outerRef   = useRef<THREE.Mesh>(null);
  const innerRef   = useRef<THREE.Mesh>(null);
  const triggered  = useRef(false);
  const posVec     = useRef(new THREE.Vector3(...pos));
  const [glow, setGlow] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (outerRef.current) {
      outerRef.current.rotation.y = t * 1.2;
      outerRef.current.rotation.z = t * 0.5;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.8;
      innerRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }

    const dist = playerPositionRef.current.distanceTo(posVec.current);
    setGlow(dist < PORTAL_ENTER_RANGE * 2);

    if (dist < PORTAL_ENTER_RANGE && !triggered.current) {
      triggered.current = true;
      onEnter();
      setTimeout(() => { triggered.current = false; }, PORTAL_COOLDOWN_MS);
    }
  });

  return (
    <group position={pos}>
      <mesh ref={outerRef}>
        <torusGeometry args={[1.4, 0.18, 8, 32]} />
        <meshBasicMaterial color={glow ? "#FFD700" : outerColor} />
      </mesh>
      <mesh ref={innerRef}>
        <torusGeometry args={[1.0, 0.08, 6, 24]} />
        <meshBasicMaterial color={zone === 1 ? "#5BA3FF" : "#FF9900"} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.95, 32]} />
        <meshBasicMaterial color={zone === 1 ? "#2255AA" : "#AA5500"} transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial color={glow ? "#FFD700" : outerColor} transparent opacity={0.15} />
      </mesh>
      <Billboard position={[0, 2.4, 0]}>
        <Text fontSize={0.26} color={glow ? "#FFD700" : "#FFFFFF"} outlineWidth={0.04} outlineColor="#000000" anchorX="center" anchorY="middle">
          {label}
        </Text>
      </Billboard>
    </group>
  );
}
