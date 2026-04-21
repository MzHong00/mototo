"use client";

import { useState, useCallback } from "react";
import { Monster, type MonsterConfig } from "./Monster";
import { useGameStore, type Item } from "@/stores/gameStore";

const ZONE1_SPAWNS: MonsterConfig[] = [
  { id: 1,  type: "green", position: [-4,  0.35, -3] },
  { id: 2,  type: "green", position: [3,   0.35, -5] },
  { id: 3,  type: "green", position: [-2,  0.35,  4] },
  { id: 4,  type: "blue",  position: [6,   0.45, -2] },
  { id: 5,  type: "blue",  position: [-7,  0.45,  1] },
  { id: 6,  type: "blue",  position: [2,   0.45,  6] },
  { id: 7,  type: "red",   position: [8,   0.55, -7] },
  { id: 8,  type: "red",   position: [-8,  0.55, -5] },
];

const ZONE2_SPAWNS: MonsterConfig[] = [
  { id: 11, type: "blue",  position: [-5,  0.45, -4] },
  { id: 12, type: "blue",  position: [4,   0.45, -6] },
  { id: 13, type: "blue",  position: [-3,  0.45,  5] },
  { id: 14, type: "blue",  position: [7,   0.45,  3] },
  { id: 15, type: "red",   position: [5,   0.55, -3] },
  { id: 16, type: "red",   position: [-6,  0.55,  2] },
  { id: 17, type: "red",   position: [0,   0.55, -8] },
  { id: 18, type: "red",   position: [-9,  0.55, -6] },
];

const RESPAWN_MS = 8_000;

const DROP_TABLE: Record<MonsterConfig["type"], { chance: number; items: Omit<Item, "uid">[] }> = {
  green: {
    chance: 0.35,
    items: [
      { id: "old_ring",  name: "낡은 반지",  type: "ring",   icon: "💍", atk: 0, def: 0, hpBonus: 15 },
      { id: "leather",   name: "가죽 갑옷",  type: "armor",  icon: "🛡️", atk: 0, def: 2, hpBonus: 0  },
    ],
  },
  blue: {
    chance: 0.50,
    items: [
      { id: "dagger",  name: "단검",      type: "weapon", icon: "🗡️", atk: 8,  def: 0, hpBonus: 0 },
      { id: "chain",   name: "사슬 갑옷", type: "armor",  icon: "🛡️", atk: 0,  def: 5, hpBonus: 0 },
    ],
  },
  red: {
    chance: 0.70,
    items: [
      { id: "steel_sword", name: "강철 검",   type: "weapon", icon: "⚔️", atk: 15, def: 0,  hpBonus: 0  },
      { id: "plate",       name: "판금 갑옷", type: "armor",  icon: "🛡️", atk: 0,  def: 9,  hpBonus: 0  },
      { id: "ruby_ring",   name: "루비 반지", type: "ring",   icon: "💍", atk: 0,  def: 0,  hpBonus: 35 },
    ],
  },
};

const GOLD_TABLE: Record<MonsterConfig["type"], [number, number]> = {
  green: [3,  8],
  blue:  [10, 20],
  red:   [25, 50],
};

let uidCounter = 0;
function rollDrop(type: MonsterConfig["type"]): Item | null {
  const table = DROP_TABLE[type];
  if (Math.random() > table.chance) return null;
  const base = table.items[Math.floor(Math.random() * table.items.length)];
  return { ...base, uid: `${base.id}_${uidCounter++}` };
}

function rollGold(type: MonsterConfig["type"], zone: number): number {
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
    [gainExp, addItem, addGold, zone, spawns]
  );

  return (
    <>
      {spawns.map((cfg) =>
        dead.has(cfg.id) ? null : (
          <Monster key={`${cfg.id}-${zone}`} {...cfg} onDeath={handleDeath} />
        )
      )}
    </>
  );
}
