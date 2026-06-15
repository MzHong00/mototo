import type * as THREE from "three";

import type { SkillFXType, SkillType, DamageType, TargetType } from "@/types/combat";

export type SkillUpgradeCategory = "damage_slash" | "damage_blast" | "cooldown" | "heal";

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
  selectedNodes?: Record<number, string>;
}

export interface SkillContext {
  ppos: THREE.Vector3;
  facing: THREE.Vector3;
  pos: [number, number, number];
  dir: [number, number, number];
  atk: number;
  skillLevel: number;
  maxHp: number;
  addFX: (type: SkillFXType, pos: [number, number, number], dir?: [number, number, number]) => void;
  healHp: (amount: number) => void;
  activateShield: () => void;
}

export interface SkillConfig {
  lockMs: number;
  triggersAttack?: boolean;
  fx?: SkillFXType;
  hitDelay?: number;
  pattern?: Extract<SkillFXType, "slash" | "blast">;
}

export interface SkillHandler {
  lockMs: number;
  triggersAttack?: boolean;
  execute: (ctx: SkillContext) => void;
}
