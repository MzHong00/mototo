import { Sky } from "@react-three/drei";

import { EvergreenFloor } from "@/components/game/floor/EvergreenFloor";
import { Portal } from "@/components/game/portal/Portal";
import { LucasNPC } from "@/components/game/npc/LucasNPC";
import { EVERGREEN_VILLAGE_OBJECTS } from "@/constants/map/evergreenVillage";

export function EvergreenVillage() {
  const { portals, npcs } = EVERGREEN_VILLAGE_OBJECTS;

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Sky sunPosition={[100, 30, 100]} />
      <EvergreenFloor objects={EVERGREEN_VILLAGE_OBJECTS} />
      <LucasNPC pos={npcs[0].pos} />
      {portals.map((portal) => (
        <Portal
          key={portal.dest}
          position={portal.pos}
          destinationMapId={portal.dest}
          destinationSpawnPos={portal.spawnPos}
        />
      ))}
    </>
  );
}
