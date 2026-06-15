import { Sky } from "@react-three/drei";

import { Map } from "@/components/game/map/Map";
import { Monsters } from "@/components/game/monster/Monsters";
import { Portal } from "@/components/game/map/Portal";
import { PORTAL_FORWARD_POS, PORTAL_BACK_POS, FOREST_SPAWNS } from "@/constants/map/world";

import type { MapId } from "@/types/map";

const FORWARD_SPAWN: [number, number, number] = [-10, 1, -3];
const BACK_SPAWN: [number, number, number] = [10, 1, 3];

interface EvergreenForestProps {
  onPortalEnter: (dest: MapId, spawnPos?: [number, number, number]) => void;
}

export function EvergreenForest({ onPortalEnter }: EvergreenForestProps) {
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
      <Map mapId="evergreenForest" />
      <Monsters spawns={FOREST_SPAWNS} />
      <Portal
        position={PORTAL_BACK_POS}
        label="← 에버그린 초원"
        portalType="town"
        spawnPos={BACK_SPAWN}
        onEnter={(sp) => onPortalEnter("evergreenMeadow", sp)}
      />
      <Portal
        position={PORTAL_FORWARD_POS}
        label="에버그린 늪지 →"
        portalType="field"
        spawnPos={FORWARD_SPAWN}
        onEnter={(sp) => onPortalEnter("evergreenSwamp", sp)}
      />
    </>
  );
}
