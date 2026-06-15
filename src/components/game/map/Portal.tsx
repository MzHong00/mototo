import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";

import { playerPositionRef } from "@/stores/worldRefs";
import { KEYS } from "@/utils/keyState";
import { getControlsState } from "@/stores/controlsStore";
import { PORTAL_ENTER_RANGE } from "@/constants/map/world";

const PORTAL_COOLDOWN_MS = 3000;

export type PortalType = "town" | "field" | "boss";

const PORTAL_PRESETS: Record<PortalType, { primary: string; secondary: string }> = {
  town: { primary: "#5BA3FF", secondary: "#FF9900" },
  field: { primary: "#FF9900", secondary: "#5BA3FF" },
  boss: { primary: "#CC2222", secondary: "#FF6600" },
};

interface PortalProps {
  position: [number, number, number];
  label: string;
  portalType?: PortalType;
  primaryColor?: string;
  secondaryColor?: string;
  spawnPos?: [number, number, number];
  onEnter: (spawnPos?: [number, number, number]) => void;
}

export function Portal({
  position,
  label,
  portalType,
  primaryColor,
  secondaryColor,
  spawnPos,
  onEnter,
}: PortalProps) {
  const preset = portalType ? PORTAL_PRESETS[portalType] : null;
  const resolvedPrimary = primaryColor ?? preset?.primary ?? "#5BA3FF";
  const resolvedSecondary = secondaryColor ?? preset?.secondary ?? "#FF9900";
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const triggered = useRef(false);
  const posVec = useRef(new THREE.Vector3(...position));
  const prevInteract = useRef(false);
  const [isNear, setIsNear] = useState(false);

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
    const near = dist < PORTAL_ENTER_RANGE * 2;
    setIsNear(near);

    // 상호작용 키 엣지 감지
    const interactNow = KEYS.has(getControlsState().bindings.interact);
    const justPressed = interactNow && !prevInteract.current;
    prevInteract.current = interactNow;

    if (near && justPressed && !triggered.current) {
      triggered.current = true;
      onEnter(spawnPos);
      setTimeout(() => {
        triggered.current = false;
      }, PORTAL_COOLDOWN_MS);
    }
  });

  return (
    <group position={position}>
      <mesh ref={outerRef}>
        <torusGeometry args={[1.4, 0.18, 8, 32]} />
        <meshBasicMaterial color={isNear ? "#FFD700" : resolvedPrimary} />
      </mesh>
      <mesh ref={innerRef}>
        <torusGeometry args={[1.0, 0.08, 6, 24]} />
        <meshBasicMaterial color={resolvedSecondary} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.95, 32]} />
        <meshBasicMaterial
          color={resolvedSecondary}
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial
          color={isNear ? "#FFD700" : resolvedPrimary}
          transparent
          opacity={0.15}
        />
      </mesh>
      <Billboard position={[0, 2.4, 0]}>
        <Text
          fontSize={0.26}
          color={isNear ? "#FFD700" : "#FFFFFF"}
          outlineWidth={0.04}
          outlineColor="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {isNear ? `${label}\n[Space] 입장` : label}
        </Text>
      </Billboard>
    </group>
  );
}
