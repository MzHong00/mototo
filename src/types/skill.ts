import type * as THREE from "three";

import type { SkillFXType } from "./combat";

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
}

export interface SkillHandler {
  lockMs: number;
  triggersAttack?: boolean;
  execute: (ctx: SkillContext) => void;
}
