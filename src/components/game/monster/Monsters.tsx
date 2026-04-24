import { useState, useCallback } from "react";
import { useGameStore } from "@/stores/gameStore";
import { Monster } from "@/components/game/monster/Monster";
import { ZONE1_SPAWNS, ZONE2_SPAWNS, DROP_TABLE, GOLD_TABLE } from "@/constants/world";
import { RESPAWN_MS } from "@/constants/monster";
import type { MonsterType } from "@/types/monster";
import type { Item } from "@/types/item";

let uidCounter = 0;

function rollDrop(type: MonsterType): Item | null {
  const table = DROP_TABLE[type];
  if (Math.random() > table.chance) return null;
  const base = table.items[Math.floor(Math.random() * table.items.length)];
  return { ...base, uid: `${base.id}_${uidCounter++}` };
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
        const drop = rollDrop(cfg.type);
        if (drop) addItem(drop);
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
      {spawns.map((cfg) =>
        dead.has(cfg.id) ? null : (
          <Monster key={`${cfg.id}-${zone}`} {...cfg} onDeath={handleDeath} />
        ),
      )}
    </>
  );
}
