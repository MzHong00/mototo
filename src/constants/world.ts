import type { MonsterConfig, MonsterType } from "@/types/monster";
import type { Item } from "@/types/item";
import { MONSTER_TYPE } from "@/constants/monster";
import { ITEMS } from "@/constants/items";
import { ITEM_TYPE } from "@/constants/item";

// ── 몬스터 스폰 ───────────────────────────────────────────────
export const ZONE1_SPAWNS: MonsterConfig[] = [
  { id: 1, type: MONSTER_TYPE.SLIME, position: [-4, 0.35, -3] },
  { id: 2, type: MONSTER_TYPE.SLIME, position: [3, 0.35, -5] },
  { id: 3, type: MONSTER_TYPE.SLIME, position: [-2, 0.35, 4] },
  { id: 4, type: MONSTER_TYPE.GOBLIN, position: [6, 0.45, -2] },
  { id: 5, type: MONSTER_TYPE.GOBLIN, position: [-7, 0.45, 1] },
  { id: 6, type: MONSTER_TYPE.GOBLIN, position: [2, 0.45, 6] },
  { id: 7, type: MONSTER_TYPE.ORC, position: [8, 0.55, -7] },
  { id: 8, type: MONSTER_TYPE.ORC, position: [-8, 0.55, -5] },
];

export const ZONE2_SPAWNS: MonsterConfig[] = [
  { id: 11, type: MONSTER_TYPE.GOBLIN, position: [-5, 0.45, -4] },
  { id: 12, type: MONSTER_TYPE.GOBLIN, position: [4, 0.45, -6] },
  { id: 13, type: MONSTER_TYPE.GOBLIN, position: [-3, 0.45, 5] },
  { id: 14, type: MONSTER_TYPE.GOBLIN, position: [7, 0.45, 3] },
  { id: 15, type: MONSTER_TYPE.ORC, position: [5, 0.55, -3] },
  { id: 16, type: MONSTER_TYPE.ORC, position: [-6, 0.55, 2] },
  { id: 17, type: MONSTER_TYPE.ORC, position: [0, 0.55, -8] },
  { id: 18, type: MONSTER_TYPE.ORC, position: [-9, 0.55, -6] },
];

// ── 드롭 테이블 ───────────────────────────────────────────────
export interface DropEntry {
  chance: number;
  item: Omit<Item, "uid">;
}

export const DROP_TABLE: Record<MonsterType, DropEntry[]> = {
  [MONSTER_TYPE.SLIME]: [
    { chance: 0.2, item: ITEMS[ITEM_TYPE.RING].old_ring },
    { chance: 0.15, item: ITEMS[ITEM_TYPE.ARMOR].leather },
  ],
  [MONSTER_TYPE.GOBLIN]: [
    { chance: 0.25, item: ITEMS[ITEM_TYPE.WEAPON].dagger },
    { chance: 0.2, item: ITEMS[ITEM_TYPE.ARMOR].chain },
  ],
  [MONSTER_TYPE.ORC]: [
    { chance: 0.3, item: ITEMS[ITEM_TYPE.WEAPON].steel_sword },
    { chance: 0.25, item: ITEMS[ITEM_TYPE.ARMOR].plate },
    { chance: 0.1, item: ITEMS[ITEM_TYPE.RING].ruby_ring },
  ],
};

export const GOLD_TABLE: Record<MonsterType, [number, number]> = {
  [MONSTER_TYPE.SLIME]: [3, 8],
  [MONSTER_TYPE.GOBLIN]: [10, 20],
  [MONSTER_TYPE.ORC]: [25, 50],
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
