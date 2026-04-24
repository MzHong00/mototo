import type { MonsterConfig, MonsterType } from "@/types/monster";
import type { Item } from "@/types/item";

// ── 몬스터 스폰 ───────────────────────────────────────────────
export const ZONE1_SPAWNS: MonsterConfig[] = [
  { id: 1, type: "green", position: [-4, 0.35, -3] },
  { id: 2, type: "green", position: [3, 0.35, -5] },
  { id: 3, type: "green", position: [-2, 0.35, 4] },
  { id: 4, type: "blue", position: [6, 0.45, -2] },
  { id: 5, type: "blue", position: [-7, 0.45, 1] },
  { id: 6, type: "blue", position: [2, 0.45, 6] },
  { id: 7, type: "red", position: [8, 0.55, -7] },
  { id: 8, type: "red", position: [-8, 0.55, -5] },
];

export const ZONE2_SPAWNS: MonsterConfig[] = [
  { id: 11, type: "blue", position: [-5, 0.45, -4] },
  { id: 12, type: "blue", position: [4, 0.45, -6] },
  { id: 13, type: "blue", position: [-3, 0.45, 5] },
  { id: 14, type: "blue", position: [7, 0.45, 3] },
  { id: 15, type: "red", position: [5, 0.55, -3] },
  { id: 16, type: "red", position: [-6, 0.55, 2] },
  { id: 17, type: "red", position: [0, 0.55, -8] },
  { id: 18, type: "red", position: [-9, 0.55, -6] },
];

// ── 드롭 테이블 ───────────────────────────────────────────────
export const DROP_TABLE: Record<MonsterType, { chance: number; items: Omit<Item, "uid">[] }> = {
  green: {
    chance: 0.35,
    items: [
      { id: "old_ring", name: "낡은 반지", type: "ring", icon: "💍", atk: 0, def: 0, hpBonus: 15 },
      { id: "leather", name: "가죽 갑옷", type: "armor", icon: "🛡️", atk: 0, def: 2, hpBonus: 0 },
    ],
  },
  blue: {
    chance: 0.5,
    items: [
      { id: "dagger", name: "단검", type: "weapon", icon: "🗡️", atk: 8, def: 0, hpBonus: 0 },
      { id: "chain", name: "사슬 갑옷", type: "armor", icon: "🛡️", atk: 0, def: 5, hpBonus: 0 },
    ],
  },
  red: {
    chance: 0.7,
    items: [
      {
        id: "steel_sword",
        name: "강철 검",
        type: "weapon",
        icon: "⚔️",
        atk: 15,
        def: 0,
        hpBonus: 0,
      },
      { id: "plate", name: "판금 갑옷", type: "armor", icon: "🛡️", atk: 0, def: 9, hpBonus: 0 },
      { id: "ruby_ring", name: "루비 반지", type: "ring", icon: "💍", atk: 0, def: 0, hpBonus: 35 },
    ],
  },
};

export const GOLD_TABLE: Record<MonsterType, [number, number]> = {
  green: [3, 8],
  blue: [10, 20],
  red: [25, 50],
};

// ── 맵 오브젝트 ───────────────────────────────────────────────
export const TREE_POSITIONS: [number, number][] = [
  [-4, -3],
  [4, -5],
  [-6, 2],
  [5, 3],
  [-2, 5],
  [7, -1],
  [-8, -6],
];

export const MAP_WALLS: { pos: [number, number, number]; size: [number, number, number] }[] = [
  { pos: [0, 2, -20], size: [40, 4, 0.5] },
  { pos: [0, 2, 20], size: [40, 4, 0.5] },
  { pos: [-20, 2, 0], size: [0.5, 4, 40] },
  { pos: [20, 2, 0], size: [0.5, 4, 40] },
];

// ── 포탈 ──────────────────────────────────────────────────────
export const PORTAL_ZONE1_POS: [number, number, number] = [13, 0, 5];
export const PORTAL_ZONE2_POS: [number, number, number] = [-13, 0, -5];
export const PORTAL_ENTER_RANGE = 1.8;

// ── NPC ───────────────────────────────────────────────────────
export const NPC_POS: [number, number, number] = [-11, 0, 1];
export const NPC_INTERACT_RANGE = 2.5;
