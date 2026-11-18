import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { playerPosition } from "@/lib/runtime/frameState";

import type { DirectionalLight } from "three";
import type { MapMood } from "@/features/world/types/mood";

const SHADOW_HALF = 10; // 그림자 범위 절반
const SHADOW_MAP = 2048;

interface SunLightProps {
  sun: MapMood["sun"];
}

/** 플레이어를 따라다니는 해(밤 맵은 달) — 어디로 가도 그림자가 보이게. 색·세기·각도는 맵 분위기에서 */
export function SunLight({ sun }: SunLightProps) {
  const lightRef = useRef<DirectionalLight>(null);

  useFrame(() => {
    const light = lightRef.current;
    if (!light) return;
    const p = playerPosition.current;
    light.position.set(p.x + sun.offset[0], p.y + sun.offset[1], p.z + sun.offset[2]);
    light.target.position.copy(p);
    light.target.updateMatrixWorld();
  });

  return (
    <directionalLight
      ref={lightRef}
      color={sun.color}
      intensity={sun.intensity}
      castShadow
      shadow-mapSize={[SHADOW_MAP, SHADOW_MAP]}
      shadow-camera-left={-SHADOW_HALF}
      shadow-camera-right={SHADOW_HALF}
      shadow-camera-top={SHADOW_HALF}
      shadow-camera-bottom={-SHADOW_HALF}
    />
  );
}
