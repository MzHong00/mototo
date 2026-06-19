import { Sky } from "@react-three/drei";

import { EvergreenFloor } from "@/components/game/floor/EvergreenFloor";
import { Monsters } from "@/components/game/monster/Monsters";
import { Portal } from "@/components/game/portal/Portal";
import { PORTAL_FORWARD_POS, PORTAL_BACK_POS, SWAMP_SPAWNS } from "@/constants/map/world";

const FORWARD_SPAWN: [number, number, number] = [-10, 1, -3];
const BACK_SPAWN: [number, number, number] = [10, 1, 3];

export function EvergreenSwamp() {
  return (
    <>
      <ambientLight intensity={0.38} />
      <directionalLight
        position={[5, 18, 8]}
        intensity={0.85}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Sky sunPosition={[40, 10, 60]} turbidity={12} rayleigh={2} />
      <EvergreenFloor />
      <Monsters spawns={SWAMP_SPAWNS} />
      <Portal
        position={PORTAL_BACK_POS}
        destinationMapId="evergreenForest"
        destinationSpawnPos={BACK_SPAWN}
      />
      <Portal
        position={PORTAL_FORWARD_POS}
        destinationMapId="evergreenRuins"
        destinationSpawnPos={FORWARD_SPAWN}
      />
    </>
  );
}
