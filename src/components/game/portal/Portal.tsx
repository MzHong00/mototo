import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { playerPosition } from "@/game/worldState";
import { KEYS } from "@/utils/keyState";
import { getControlsState } from "@/stores/controlsStore";
import { useGameStore } from "@/stores/gameStore";
import { PORTAL_ENTER_RANGE } from "@/constants/map/world";

import type { MapId } from "@/types/map";

const PORTAL_COOLDOWN_MS = 3000; // 입장 후 재입장 방지 시간

interface PortalProps {
  position: [number, number, number];
  destinationMapId: MapId; // 입장 시 이동할 목적지 맵
  destinationSpawnPos?: [number, number, number]; // 목적지 도착 좌표(미지정 시 맵 기본값)
}

export function Portal({ position, destinationMapId, destinationSpawnPos }: PortalProps) {
  const triggered = useRef(false); // 쿨다운 중복 입장 방지 플래그
  const posVec = useRef(new THREE.Vector3(...position));
  const prevInteract = useRef(false); // 상호작용 키 엣지 감지용 이전 상태
  const enterPortal = useGameStore((s) => s.enterPortal);

  useFrame(() => {
    const dist = playerPosition.current.distanceTo(posVec.current);
    const isNear = dist < PORTAL_ENTER_RANGE * 2; // 플레이어 근접 여부

    // 상호작용 키 엣지 감지
    const interactNow = KEYS.has(getControlsState().bindings.interact);
    const justPressed = interactNow && !prevInteract.current;
    prevInteract.current = interactNow;

    if (isNear && justPressed && !triggered.current) {
      triggered.current = true;
      enterPortal(destinationMapId, destinationSpawnPos);
      setTimeout(() => {
        triggered.current = false;
      }, PORTAL_COOLDOWN_MS);
    }
  });

  return (
    <group position={position}>
      <mesh>
        <torusGeometry args={[1.4, 0.18, 8, 32]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}
