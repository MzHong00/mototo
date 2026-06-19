import { Sky } from "@react-three/drei";

import { EvergreenFloor } from "@/components/game/floor/EvergreenFloor";
import { Monsters } from "@/components/game/monster/Monsters";
import { Portal } from "@/components/game/portal/Portal";
import { PORTAL_BACK_POS, RUINS_SPAWNS } from "@/constants/map/world";
import { BOSS_TYPE, BOSSES } from "@/constants/monster/boss";

const BACK_SPAWN: [number, number, number] = [10, 1, 3];

export function EvergreenRuins() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[8, 15, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Sky sunPosition={[20, 8, 40]} turbidity={15} rayleigh={3} />
      <EvergreenFloor />
      <Monsters spawns={RUINS_SPAWNS} />

      <Portal
        position={
          BOSSES.mototo.evergreen[BOSS_TYPE.KING_BEAR].entryPosition as [number, number, number]
        }
        destinationMapId="kingBearChamber"
      />

      <Portal
        position={PORTAL_BACK_POS}
        destinationMapId="evergreenSwamp"
        destinationSpawnPos={BACK_SPAWN}
      />
    </>
  );
}
