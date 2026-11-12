import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

import { FollowCamera } from "@/components/game/world/FollowCamera";
import { PlayerCharacter } from "@/components/game/world/PlayerCharacter";
import { SunLight } from "@/components/game/world/SunLight";
import { TestGround } from "@/components/game/world/TestGround";

import type { ChibiState } from "@/engine/chibi/character";

import s from "./GameCanvas.module.scss";

// 치비 뷰어와 같은 하늘·조명
const SKY_COLOR = "#cfe6f5";
const HEMI_GROUND = "#8899aa";
const FOG_NEAR = 18;
const FOG_FAR = 45;

interface GameCanvasProps {
  appearance: ChibiState;
}

/** 게임 3D 월드 */
export function GameCanvas({ appearance }: GameCanvasProps) {
  return (
    <Canvas className={s.canvas} shadows flat camera={{ fov: 45 }}>
      <color attach="background" args={[SKY_COLOR]} />
      <fog attach="fog" args={[SKY_COLOR, FOG_NEAR, FOG_FAR]} />
      <hemisphereLight args={["#ffffff", HEMI_GROUND, 1.6]} />
      <SunLight />
      <FollowCamera />
      <Suspense fallback={null}>
        <Physics>
          <TestGround />
          <PlayerCharacter appearance={appearance} />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
