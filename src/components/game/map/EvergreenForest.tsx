import { Sky } from "@react-three/drei";

import { EvergreenFloor } from "@/components/game/floor/EvergreenFloor";
import { Monsters } from "@/components/game/monster/Monsters";
import { Portal } from "@/components/game/portal/Portal";
import { PORTAL_FORWARD_POS, PORTAL_BACK_POS, FOREST_SPAWNS } from "@/constants/map/world";

const FORWARD_SPAWN: [number, number, number] = [-10, 1, -3];
const BACK_SPAWN: [number, number, number] = [10, 1, 3];

export function EvergreenForest() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Sky sunPosition={[60, 15, 80]} />
      <EvergreenFloor />
      <Monsters spawns={FOREST_SPAWNS} />
      <Portal
        position={PORTAL_BACK_POS}
        destinationMapId="evergreenMeadow"
        destinationSpawnPos={BACK_SPAWN}
      />
      <Portal
        position={PORTAL_FORWARD_POS}
        destinationMapId="evergreenSwamp"
        destinationSpawnPos={FORWARD_SPAWN}
      />
    </>
  );
}
