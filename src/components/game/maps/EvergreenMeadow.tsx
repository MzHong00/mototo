import { Sky } from "@react-three/drei";

import { Map } from "@/components/game/map/Map";
import { Monsters } from "@/components/game/monster/Monsters";
import { Portal } from "@/components/game/map/Portal";

import { PORTAL_FORWARD_POS, PORTAL_BACK_POS, MEADOW_SPAWNS } from "@/constants/map/world";

import type { MapId } from "@/types/map";

const FORWARD_SPAWN: [number, number, number] = [-10, 1, -3];
const BACK_SPAWN: [number, number, number] = [10, 1, 3];

interface EvergreenMeadowProps {
  onPortalEnter: (dest: MapId, spawnPos?: [number, number, number]) => void;
}

export function EvergreenMeadow({ onPortalEnter }: EvergreenMeadowProps) {
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
      <Map mapId="evergreenMeadow" />
      <Monsters spawns={MEADOW_SPAWNS} />
      <Portal
        position={PORTAL_BACK_POS}
        label="← 에버그린 마을"
        portalType="town"
        spawnPos={BACK_SPAWN}
        onEnter={(sp) => onPortalEnter("evergreenVillage", sp)}
      />
      <Portal
        position={PORTAL_FORWARD_POS}
        label="에버그린 숲 →"
        portalType="field"
        spawnPos={FORWARD_SPAWN}
        onEnter={(sp) => onPortalEnter("evergreenForest", sp)}
      />
    </>
  );
}
