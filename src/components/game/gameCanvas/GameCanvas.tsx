import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

import { Character } from "@/components/game/character/Character";
import { FollowCamera } from "@/components/game/camera/FollowCamera";
import { SkillEffects } from "@/components/game/effects/SkillEffects";
import { EvergreenVillage } from "@/components/game/map/EvergreenVillage";
import { EvergreenMeadow } from "@/components/game/map/EvergreenMeadow";
import { EvergreenForest } from "@/components/game/map/EvergreenForest";
import { EvergreenSwamp } from "@/components/game/map/EvergreenSwamp";
import { EvergreenRuins } from "@/components/game/map/EvergreenRuins";
import { TwilightWasteland } from "@/components/game/map/TwilightWasteland";
import { KingBearChamber } from "@/components/game/map/KingBearChamber";
import { MAP_ID } from "@/constants/map/maps";

import type { MapId } from "@/types/map";

interface GameCanvasProps {
  mapId: MapId;
}

export function GameCanvas({ mapId }: GameCanvasProps) {
  return (
    <Canvas shadows camera={{ fov: 60 }} style={{ width: "100%", height: "100%" }}>
      <FollowCamera />
      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]}>
          <Character />
          {mapId === MAP_ID.EVERGREEN_VILLAGE && <EvergreenVillage />}
          {mapId === MAP_ID.EVERGREEN_MEADOW && <EvergreenMeadow />}
          {mapId === MAP_ID.EVERGREEN_FOREST && <EvergreenForest />}
          {mapId === MAP_ID.EVERGREEN_SWAMP && <EvergreenSwamp />}
          {mapId === MAP_ID.EVERGREEN_RUINS && <EvergreenRuins />}
          {mapId === MAP_ID.KING_BEAR_CHAMBER && <KingBearChamber />}
          {mapId === MAP_ID.TWILIGHT_WASTELAND && <TwilightWasteland />}
        </Physics>
        <SkillEffects />
      </Suspense>
    </Canvas>
  );
}
