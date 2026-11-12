import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { playerPosition } from "@/engine/runtime/frameState";

import type { DirectionalLight } from "three";

const SUN_OFFSET: [number, number, number] = [5, 10, 6]; // 플레이어 기준 해 위치 (치비 뷰어와 동일)
const SHADOW_HALF = 10; // 그림자 범위 절반
const SHADOW_MAP = 2048;

/** 플레이어를 따라다니는 해 — 어디로 가도 그림자가 보이게 */
export function SunLight() {
  const lightRef = useRef<DirectionalLight>(null);

  useFrame(() => {
    const light = lightRef.current;
    if (!light) return;
    const p = playerPosition.current;
    light.position.set(p.x + SUN_OFFSET[0], SUN_OFFSET[1], p.z + SUN_OFFSET[2]);
    light.target.position.copy(p);
    light.target.updateMatrixWorld();
  });

  return (
    <directionalLight
      ref={lightRef}
      intensity={2.2}
      castShadow
      shadow-mapSize={[SHADOW_MAP, SHADOW_MAP]}
      shadow-camera-left={-SHADOW_HALF}
      shadow-camera-right={SHADOW_HALF}
      shadow-camera-top={SHADOW_HALF}
      shadow-camera-bottom={-SHADOW_HALF}
    />
  );
}
