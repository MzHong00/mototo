import { Sky } from "@react-three/drei";

import { Map } from "@/components/game/map/Map";
import { Portal } from "@/components/game/map/Portal";
import { LucasNPC } from "@/components/game/npc/LucasNPC";
import { PORTAL_FORWARD_POS } from "@/constants/world";
import type { MapId } from "@/types/map";

const FORWARD_SPAWN: [number, number, number] = [-10, 1, -3];

interface EvergreenVillageProps {
  onPortalEnter: (dest: MapId, spawnPos?: [number, number, number]) => void;
}

export function EvergreenVillage({ onPortalEnter }: EvergreenVillageProps) {
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
      <Map mapId="evergreenVillage" />
      <LucasNPC />
      <Portal
        position={PORTAL_FORWARD_POS}
        label="에버그린 초원 →"
        portalType="field"
        spawnPos={FORWARD_SPAWN}
        onEnter={(sp) => onPortalEnter("evergreenMeadow", sp)}
      />
    </>
  );
}
