import type { Item } from "@/types/item";

export type JobClass = "warrior" | "archer" | "mage" | "rogue";

export interface CharacterStats {
  name: string;
  jobClass: JobClass | null;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  exp: number;
  expToNext: number;
  baseAtk: number;
  baseDef: number;
}

export interface EquipSlots {
  weapon: Item | null;
  armor: Item | null;
  ring: Item | null;
}

export interface SkillState {
  id: string;
  key: string;
  label: string;
  mpCost: number;
  cooldown: number;
  lastUsed: number;
}
