import { Sky } from "@react-three/drei";

import { Map } from "@/components/game/map/Map";
import { Monsters } from "@/components/game/monster/Monsters";
import { Portal } from "@/components/game/map/Portal";
import { PORTAL_BACK_POS, RUINS_SPAWNS } from "@/constants/world";
import { BOSS_TYPE, BOSS_STATS } from "@/constants/boss";
import { useGameStore } from "@/stores/gameStore";

import type { MapId } from "@/types/map";

const BACK_SPAWN: [number, number, number] = [10, 1, 3];
const BOSS_ENTRY_SPAWN: [number, number, number] = [0, 0, 0];

interface EvergreenRuinsProps {
  onPortalEnter: (dest: MapId, spawnPos?: [number, number, number]) => void;
}

export function EvergreenRuins({ onPortalEnter }: EvergreenRuinsProps) {
  const setBossEntryId = useGameStore((s) => s.setBossEntryId);

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
      <Map mapId="evergreenRuins" />
      <Monsters spawns={RUINS_SPAWNS} />

      <Portal
        position={BOSS_STATS[BOSS_TYPE.KING_BEAR].entryPosition as [number, number, number]}
        label={`⚔ ${BOSS_STATS[BOSS_TYPE.KING_BEAR].name}의 방`}
        portalType="boss"
        spawnPos={BOSS_ENTRY_SPAWN}
        onEnter={() => setBossEntryId(BOSS_TYPE.KING_BEAR)}
      />

      <Portal
        position={PORTAL_BACK_POS}
        label="← 에버그린 늪지"
        portalType="town"
        spawnPos={BACK_SPAWN}
        onEnter={(sp) => onPortalEnter("evergreenSwamp", sp)}
      />
    </>
  );
}
