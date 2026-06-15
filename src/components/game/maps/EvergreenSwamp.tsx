import { Sky } from "@react-three/drei";

import { Map } from "@/components/game/map/Map";
import { Monsters } from "@/components/game/monster/Monsters";
import { Portal } from "@/components/game/map/Portal";
import { PORTAL_FORWARD_POS, PORTAL_BACK_POS, SWAMP_SPAWNS } from "@/constants/map/world";

import type { MapId } from "@/types/map";

const FORWARD_SPAWN: [number, number, number] = [-10, 1, -3];
const BACK_SPAWN: [number, number, number] = [10, 1, 3];

interface EvergreenSwampProps {
  onPortalEnter: (dest: MapId, spawnPos?: [number, number, number]) => void;
}

export function EvergreenSwamp({ onPortalEnter }: EvergreenSwampProps) {
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
      <Map mapId="evergreenSwamp" />
      <Monsters spawns={SWAMP_SPAWNS} />
      <Portal
        position={PORTAL_BACK_POS}
        label="← 에버그린 숲"
        portalType="town"
        spawnPos={BACK_SPAWN}
        onEnter={(sp) => onPortalEnter("evergreenForest", sp)}
      />
      <Portal
        position={PORTAL_FORWARD_POS}
        label="에버그린 유적 →"
        portalType="field"
        spawnPos={FORWARD_SPAWN}
        onEnter={(sp) => onPortalEnter("evergreenRuins", sp)}
      />
    </>
  );
}
