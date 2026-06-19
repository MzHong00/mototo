import { Sky } from "@react-three/drei";

import { EvergreenFloor } from "@/components/game/floor/EvergreenFloor";
import { Monsters } from "@/components/game/monster/Monsters";
import { Portal } from "@/components/game/portal/Portal";

import { PORTAL_FORWARD_POS, PORTAL_BACK_POS, MEADOW_SPAWNS } from "@/constants/map/world";

const FORWARD_SPAWN: [number, number, number] = [-10, 1, -3];
const BACK_SPAWN: [number, number, number] = [10, 1, 3];

export function EvergreenMeadow() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Sky sunPosition={[100, 20, 100]} />
      <EvergreenFloor />
      <Monsters spawns={MEADOW_SPAWNS} />
      <Portal
        position={PORTAL_BACK_POS}
        destinationMapId="evergreenVillage"
        destinationSpawnPos={BACK_SPAWN}
      />
      <Portal
        position={PORTAL_FORWARD_POS}
        destinationMapId="evergreenForest"
        destinationSpawnPos={FORWARD_SPAWN}
      />
    </>
  );
}
