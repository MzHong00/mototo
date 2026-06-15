import type { Item } from "@/types/item";
import type { Class } from "@/types/class";
import type { SkillState } from "@/types/skill";

export interface CharacterStats {
  name: string;
  cls: Class | null;
  level: number;
  hp: number;
  maxHp: number;
  exp: number;
  expToNext: number;
  baseAtk: number;
  baseDef: number;
  allSkills?: SkillState[];
}

export interface EquipSlots {
  weapon: Item | null;
  armor: Item | null;
  ring: Item | null;
}
