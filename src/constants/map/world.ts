import type { MonsterConfig, MonsterType } from "@/types/monster";
import type { DropEntry } from "@/types/item";
import { MONSTER_TYPE } from "@/constants/monster/monster";
import { ITEMS } from "@/constants/item/items";
import { ITEM_TYPE } from "@/constants/item/item";

// ── 몬스터 스폰 ───────────────────────────────────────────────
export const MEADOW_SPAWNS: MonsterConfig[] = [
  { id: 1, type: MONSTER_TYPE.CHICKEN, position: [-4, 0.35, -3] },
  { id: 2, type: MONSTER_TYPE.CHICKEN, position: [3, 0.35, -5] },
  { id: 3, type: MONSTER_TYPE.CHICKEN, position: [-2, 0.35, 4] },
  { id: 4, type: MONSTER_TYPE.CHICKEN, position: [6, 0.35, -2] },
  { id: 5, type: MONSTER_TYPE.ROOSTER, position: [-7, 0.35, 1] },
  { id: 6, type: MONSTER_TYPE.ROOSTER, position: [2, 0.35, 6] },
  { id: 7, type: MONSTER_TYPE.ROOSTER, position: [8, 0.35, -7] },
];

export const FOREST_SPAWNS: MonsterConfig[] = [
  { id: 21, type: MONSTER_TYPE.SHEEP, position: [-4, 0.45, -3] },
  { id: 22, type: MONSTER_TYPE.SHEEP, position: [3, 0.45, -5] },
  { id: 23, type: MONSTER_TYPE.SHEEP, position: [-2, 0.45, 4] },
  { id: 24, type: MONSTER_TYPE.SHEEP, position: [5, 0.45, 2] },
  { id: 25, type: MONSTER_TYPE.RAM, position: [-6, 0.45, 1] },
  { id: 26, type: MONSTER_TYPE.RAM, position: [2, 0.45, 6] },
  { id: 27, type: MONSTER_TYPE.RAM, position: [8, 0.45, -6] },
];

export const SWAMP_SPAWNS: MonsterConfig[] = [
  { id: 31, type: MONSTER_TYPE.DEER, position: [-4, 0.45, -3] },
  { id: 32, type: MONSTER_TYPE.DEER, position: [4, 0.45, -5] },
  { id: 33, type: MONSTER_TYPE.DEER, position: [-2, 0.45, 5] },
  { id: 34, type: MONSTER_TYPE.DEER, position: [6, 0.45, 2] },
  { id: 35, type: MONSTER_TYPE.ELK, position: [-7, 0.45, 1] },
  { id: 36, type: MONSTER_TYPE.ELK, position: [3, 0.45, 7] },
  { id: 37, type: MONSTER_TYPE.ELK, position: [8, 0.45, -7] },
];

export const RUINS_SPAWNS: MonsterConfig[] = [
  { id: 41, type: MONSTER_TYPE.PIG, position: [-4, 0.45, -3] },
  { id: 42, type: MONSTER_TYPE.PIG, position: [3, 0.45, -5] },
  { id: 43, type: MONSTER_TYPE.PIG, position: [-2, 0.45, 4] },
  { id: 44, type: MONSTER_TYPE.PIG, position: [5, 0.45, 2] },
  { id: 45, type: MONSTER_TYPE.WILD_BOAR, position: [-7, 0.45, 1] },
  { id: 46, type: MONSTER_TYPE.WILD_BOAR, position: [2, 0.45, 7] },
  { id: 47, type: MONSTER_TYPE.WILD_BOAR, position: [8, 0.45, -6] },
];

// ── 드롭 테이블 ───────────────────────────────────────────────
export const DROP_TABLE: Record<MonsterType, DropEntry[]> = {
  [MONSTER_TYPE.CHICKEN]: [{ chance: 0.25, item: ITEMS[ITEM_TYPE.RING].old_ring }],
  [MONSTER_TYPE.ROOSTER]: [
    { chance: 0.28, item: ITEMS[ITEM_TYPE.RING].old_ring },
    { chance: 0.2, item: ITEMS[ITEM_TYPE.ARMOR].leather },
  ],
  [MONSTER_TYPE.SHEEP]: [{ chance: 0.22, item: ITEMS[ITEM_TYPE.ARMOR].leather }],
  [MONSTER_TYPE.RAM]: [
    { chance: 0.18, item: ITEMS[ITEM_TYPE.WEAPON].dagger },
    { chance: 0.22, item: ITEMS[ITEM_TYPE.ARMOR].leather },
  ],
  [MONSTER_TYPE.DEER]: [
    { chance: 0.2, item: ITEMS[ITEM_TYPE.WEAPON].dagger },
    { chance: 0.15, item: ITEMS[ITEM_TYPE.ARMOR].chain },
  ],
  [MONSTER_TYPE.ELK]: [
    { chance: 0.28, item: ITEMS[ITEM_TYPE.WEAPON].dagger },
    { chance: 0.22, item: ITEMS[ITEM_TYPE.ARMOR].chain },
  ],
  [MONSTER_TYPE.PIG]: [
    { chance: 0.18, item: ITEMS[ITEM_TYPE.ARMOR].chain },
    { chance: 0.12, item: ITEMS[ITEM_TYPE.WEAPON].steel_sword },
  ],
  [MONSTER_TYPE.WILD_BOAR]: [
    { chance: 0.25, item: ITEMS[ITEM_TYPE.WEAPON].steel_sword },
    { chance: 0.18, item: ITEMS[ITEM_TYPE.ARMOR].plate },
    { chance: 0.08, item: ITEMS[ITEM_TYPE.RING].ruby_ring },
  ],
};

export const GOLD_TABLE: Record<MonsterType, [number, number]> = {
  [MONSTER_TYPE.CHICKEN]: [2, 6],
  [MONSTER_TYPE.ROOSTER]: [5, 12],
  [MONSTER_TYPE.SHEEP]: [8, 16],
  [MONSTER_TYPE.RAM]: [14, 25],
  [MONSTER_TYPE.DEER]: [18, 32],
  [MONSTER_TYPE.ELK]: [28, 45],
  [MONSTER_TYPE.PIG]: [22, 38],
  [MONSTER_TYPE.WILD_BOAR]: [35, 60],
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
export const PORTAL_FORWARD_POS: [number, number, number] = [13, 0, 5];
export const PORTAL_BACK_POS: [number, number, number] = [-13, 0, -5];
export const PORTAL_ENTER_RANGE = 1.8;

// ── NPC ───────────────────────────────────────────────────────
export const NPC_POS: [number, number, number] = [-11, 0, 1];
export const NPC_INTERACT_RANGE = 2.5;
