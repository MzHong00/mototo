import { useState, useCallback } from "react";

import { useGameStore } from "@/stores/gameStore";
import { ChickenMonster } from "@/components/game/monster/normal/ChickenMonster";
import { RoosterMonster } from "@/components/game/monster/normal/RoosterMonster";
import { SheepMonster } from "@/components/game/monster/normal/SheepMonster";
import { RamMonster } from "@/components/game/monster/normal/RamMonster";
import { DeerMonster } from "@/components/game/monster/normal/DeerMonster";
import { ElkMonster } from "@/components/game/monster/normal/ElkMonster";
import { PigMonster } from "@/components/game/monster/normal/PigMonster";
import { WildBoarMonster } from "@/components/game/monster/normal/WildBoarMonster";
import { DROP_TABLE, GOLD_TABLE } from "@/constants/world";
import { RESPAWN_MS } from "@/constants/monster";

import type { ComponentType } from "react";
import type { MonsterType, MonsterConfig } from "@/types/monster";
import type { Item } from "@/types/item";

let uidCounter = 0;

type MonsterEntityProps = Omit<MonsterConfig, "type"> & {
  onDeath: (id: number, exp: number) => void;
};

const MONSTER_COMPONENTS: Record<MonsterType, ComponentType<MonsterEntityProps>> = {
  chicken: ChickenMonster,
  rooster: RoosterMonster,
  sheep: SheepMonster,
  ram: RamMonster,
  deer: DeerMonster,
  elk: ElkMonster,
  pig: PigMonster,
  wildBoar: WildBoarMonster,
};

function rollDrops(type: MonsterType): Item[] {
  return DROP_TABLE[type]
    .filter((entry) => Math.random() < entry.chance)
    .map((entry) => ({ ...entry.item, uid: `${entry.item.id}_${uidCounter++}` }));
}

function rollGold(type: MonsterType): number {
  const [min, max] = GOLD_TABLE[type];
  return min + Math.floor(Math.random() * (max - min + 1));
}

interface MonstersProps {
  spawns: MonsterConfig[];
}

export function Monsters({ spawns }: MonstersProps) {
  const gainExp = useGameStore((s) => s.gainExp);
  const addItem = useGameStore((s) => s.addItem);
  const addGold = useGameStore((s) => s.addGold);
  const [dead, setDead] = useState<Set<number>>(new Set());

  const handleDeath = useCallback(
    (id: number, exp: number) => {
      const cfg = spawns.find((m) => m.id === id);
      gainExp(exp);
      if (cfg) {
        addGold(rollGold(cfg.type));
        rollDrops(cfg.type).forEach(addItem);
      }
      setDead((prev) => new Set(prev).add(id));
      setTimeout(() => {
        setDead((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, RESPAWN_MS);
    },
    [gainExp, addItem, addGold, spawns],
  );

  return (
    <>
      {spawns.map((cfg) => {
        if (dead.has(cfg.id)) return null;
        const MonsterComponent = MONSTER_COMPONENTS[cfg.type];
        return (
          <MonsterComponent
            key={cfg.id}
            id={cfg.id}
            position={cfg.position}
            onDeath={handleDeath}
          />
        );
      })}
    </>
  );
}
