import { useState, useCallback } from "react";
import type { ComponentType } from "react";
import { useGameStore } from "@/stores/gameStore";
import { SlimeMonster } from "@/components/game/monster/SlimeMonster";
import { GoblinMonster } from "@/components/game/monster/GoblinMonster";
import { OrcMonster } from "@/components/game/monster/OrcMonster";
import { ZONE1_SPAWNS, ZONE2_SPAWNS, DROP_TABLE, GOLD_TABLE } from "@/constants/world";
import { RESPAWN_MS } from "@/constants/monster";
import type { MonsterType, MonsterConfig } from "@/types/monster";
import type { Item } from "@/types/item";

let uidCounter = 0;

type MonsterEntityProps = Omit<MonsterConfig, "type"> & {
  onDeath: (id: number, exp: number) => void;
};

const MONSTER_COMPONENTS: Record<MonsterType, ComponentType<MonsterEntityProps>> = {
  slime: SlimeMonster,
  goblin: GoblinMonster,
  orc: OrcMonster,
};

function rollDrops(type: MonsterType): Item[] {
  return DROP_TABLE[type]
    .filter((entry) => Math.random() < entry.chance)
    .map((entry) => ({ ...entry.item, uid: `${entry.item.id}_${uidCounter++}` }));
}

function rollGold(type: MonsterType, zone: number): number {
  const [min, max] = GOLD_TABLE[type];
  const base = min + Math.floor(Math.random() * (max - min + 1));
  return zone === 2 ? base * 2 : base;
}

interface MonstersProps {
  zone: number;
}

export function Monsters({ zone }: MonstersProps) {
  const gainExp = useGameStore((s) => s.gainExp);
  const addItem = useGameStore((s) => s.addItem);
  const addGold = useGameStore((s) => s.addGold);
  const [dead, setDead] = useState<Set<number>>(new Set());

  const spawns = zone === 2 ? ZONE2_SPAWNS : ZONE1_SPAWNS;

  const handleDeath = useCallback(
    (id: number, exp: number) => {
      const cfg = spawns.find((m) => m.id === id);
      gainExp(zone === 2 ? exp * 2 : exp);
      if (cfg) {
        addGold(rollGold(cfg.type, zone));
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
    [gainExp, addItem, addGold, zone, spawns],
  );

  return (
    <>
      {spawns.map((cfg) => {
        if (dead.has(cfg.id)) return null;
        const MonsterComponent = MONSTER_COMPONENTS[cfg.type];
        return (
          <MonsterComponent
            key={`${cfg.id}-${zone}`}
            id={cfg.id}
            position={cfg.position}
            onDeath={handleDeath}
          />
        );
      })}
    </>
  );
}
