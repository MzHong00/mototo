import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Stats } from "@react-three/drei";

import { FollowCamera } from "@/features/world/components/FollowCamera";
import { PlayerCharacter } from "@/features/world/components/PlayerCharacter";
import { MapAtmosphere } from "@/features/world/components/MapAtmosphere";
import { CurrentMap } from "@/features/world/components/CurrentMap";
import { useWorldStore } from "@/features/world/stores/worldStore";
import { getMapDef } from "@/features/world/utils/maps";

import { FRAME_PRIORITY } from "@/features/world/constants/frame";
import { GRAVITY } from "@/features/world/constants/movement";

import type { ChibiState } from "@/lib/chibi/character";

import s from "./GameCanvas.module.scss";

const IS_PERF = new URLSearchParams(window.location.search).has("perf"); // ?perf → FPS 표시

interface GameCanvasProps {
  appearance: ChibiState;
}

/** 게임 3D 월드 */
export function GameCanvas({ appearance }: GameCanvasProps) {
  const mapId = useWorldStore((st) => st.location.map);
  const map = useMemo(() => getMapDef(mapId), [mapId]);

  return (
    <Canvas className={s.canvas} shadows flat camera={{ fov: 45 }}>
      {/* 맵마다 하늘·빛·안개·입자가 다름 */}
      <MapAtmosphere key={map.id} mood={map.mood} />
      <FollowCamera />
      <Suspense fallback={null}>
        {/* 물리를 렌더 프레임과 1:1로 맞춰 카메라·캐릭터·배경이 같은 위치를 보게 한다 (고주사율 화면 끊김 방지) */}
        <Physics gravity={GRAVITY} timeStep="vary" updatePriority={FRAME_PRIORITY.PHYSICS}>
          {/* 맵이 바뀌면 지형·물체·충돌체를 통째로 새로 만든다 */}
          <CurrentMap key={map.id} map={map} />
          <PlayerCharacter appearance={appearance} />
        </Physics>
      </Suspense>
      {IS_PERF && <Stats />}
    </Canvas>
  );
}
