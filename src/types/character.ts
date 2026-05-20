import type { Item } from "@/types/item";
import type { SkillType, DamageType, TargetType } from "@/types/combat";

export type { JobClass } from "@/types/job";
import type { JobClass } from "@/types/job";

export interface CharacterStats {
  name: string;
  jobClass: JobClass | null;
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

export interface SkillState {
  id: string;
  key?: string;
  label: string;
  skillType: SkillType;
  cooldown: number;
  lastUsed: number;
  level: number;
  requiredLevel?: number;
  damageType?: DamageType;
  targetType?: TargetType;
  selectedNodes?: Record<number, string>; // { tier: nodeId }
}
