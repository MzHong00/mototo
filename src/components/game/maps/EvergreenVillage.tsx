import { Sky } from "@react-three/drei";

import { Map } from "@/components/game/map/Map";
import { Portal } from "@/components/game/map/Portal";
import { LucasNPC } from "@/components/game/npc/LucasNPC";
import { EVERGREEN_VILLAGE_OBJECTS } from "@/constants/map/evergreenVillage";
import type { MapId } from "@/types/map";

interface EvergreenVillageProps {
  onPortalEnter: (dest: MapId, spawnPos?: [number, number, number]) => void;
}

export function EvergreenVillage({ onPortalEnter }: EvergreenVillageProps) {
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
      <Map mapId="evergreenVillage" objects={EVERGREEN_VILLAGE_OBJECTS} />
      <LucasNPC pos={npcs[0].pos} />
      {portals.map((portal) => (
        <Portal
          key={portal.dest}
          position={portal.pos}
          label={portal.label}
          portalType={portal.type}
          spawnPos={portal.spawnPos}
          onEnter={(sp) => onPortalEnter(portal.dest, sp)}
        />
      ))}
    </>
  );
}
