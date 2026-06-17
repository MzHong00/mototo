import { SKILL_FX_TYPE, SKILL_HIT_PATTERN } from "@/constants/skill/combat";

import type { Class } from "@/types/class";
import type { SkillConfig } from "@/types/skill";

export const CLASS_SKILL_CONFIG: Record<Class, Record<string, SkillConfig>> = {
  warrior: {
    slash: {
      lockMs: 500,
      triggersAttack: true,
      hitDelay: 250,
      hitPattern: SKILL_HIT_PATTERN.SLASH,
    },
    charge: {
      lockMs: 800,
      triggersAttack: true,
      hitDelay: 300,
      hitPattern: SKILL_HIT_PATTERN.SLASH,
    },
    taunt: { lockMs: 1000, triggersAttack: false },
    cataclysm: {
      lockMs: 1800,
      triggersAttack: true,
      fx: SKILL_FX_TYPE.BLAST,
      hitPattern: SKILL_HIT_PATTERN.BLAST,
    },
  },
  archer: {
    arrow_shot: {
      lockMs: 350,
      triggersAttack: true,
      fx: SKILL_FX_TYPE.ARROW,
      hitPattern: SKILL_HIT_PATTERN.SLASH,
    },
    piercing_arrow: {
      lockMs: 800,
      triggersAttack: true,
      fx: SKILL_FX_TYPE.ARROW,
      hitPattern: SKILL_HIT_PATTERN.SLASH,
    },
    backstep: { lockMs: 500, triggersAttack: false },
    explosive_arrow: {
      lockMs: 500,
      triggersAttack: true,
      fx: SKILL_FX_TYPE.ARROW_BLAST,
      hitPattern: SKILL_HIT_PATTERN.BLAST,
    },
  },
  mage: {
    fireball: {
      lockMs: 500,
      triggersAttack: true,
      fx: SKILL_FX_TYPE.FIREBALL,
      hitPattern: SKILL_HIT_PATTERN.SLASH,
    },
    ice_spike: {
      lockMs: 700,
      triggersAttack: true,
      fx: SKILL_FX_TYPE.ARROW,
      hitPattern: SKILL_HIT_PATTERN.SLASH,
    },
    blink: { lockMs: 300, triggersAttack: false },
    black_hole: {
      lockMs: 500,
      triggersAttack: true,
      fx: SKILL_FX_TYPE.BLAST,
      hitPattern: SKILL_HIT_PATTERN.BLAST,
    },
  },
  rogue: {
    dagger_slash: {
      lockMs: 300,
      triggersAttack: true,
      hitDelay: 150,
      hitPattern: SKILL_HIT_PATTERN.SLASH,
    },
    shadow_slash: {
      lockMs: 400,
      triggersAttack: true,
      hitDelay: 100,
      hitPattern: SKILL_HIT_PATTERN.SLASH,
    },
    smoke_bomb: { lockMs: 500, triggersAttack: false },
    death_dance: {
      lockMs: 500,
      triggersAttack: true,
      fx: SKILL_FX_TYPE.SHURIKEN_BLAST,
      hitPattern: SKILL_HIT_PATTERN.BLAST,
    },
  },
};
