import type {
  DamageType,
  TargetType,
  SkillType,
  SkillFXType,
  SkillHitPattern,
} from "@/types/combat";

export const DAMAGE_TYPE = {
  PHYSICAL: "physical",
  MAGIC: "magic",
} as const satisfies Record<string, DamageType>;

export const DAMAGE_TYPE_LABEL: Record<DamageType, string> = {
  [DAMAGE_TYPE.PHYSICAL]: "물리",
  [DAMAGE_TYPE.MAGIC]: "마법",
};

export const TARGET_TYPE = {
  SINGLE: "single",
  AOE: "aoe",
} as const satisfies Record<string, TargetType>;

export const TARGET_TYPE_LABEL: Record<TargetType, string> = {
  [TARGET_TYPE.SINGLE]: "단일",
  [TARGET_TYPE.AOE]: "광역",
};

export const SKILL_TYPE = {
  ATTACK: "attack",
  BUFF: "buff",
  HEAL: "heal",
} as const satisfies Record<string, SkillType>;

export const SKILL_TYPE_LABEL: Record<SkillType, string> = {
  [SKILL_TYPE.ATTACK]: "공격",
  [SKILL_TYPE.BUFF]: "버프",
  [SKILL_TYPE.HEAL]: "회복",
};

export const SKILL_FX_TYPE = {
  SLASH: "slash",
  BLAST: "blast",
  ARROW: "arrow",
  ARROW_BLAST: "arrow_blast",
  FIREBALL: "fireball",
  METEOR: "meteor",
  SHURIKEN: "shuriken",
  SHURIKEN_BLAST: "shuriken_blast",
} as const satisfies Record<string, SkillFXType>;

export const SKILL_HIT_PATTERN = {
  SLASH: "slash",
  BLAST: "blast",
} as const satisfies Record<string, SkillHitPattern>;

export const SLASH_RANGE = 2.8;
export const BLAST_RANGE = 4.5;
export const PROJECTILE_HIT_RADIUS = 0.85;

export const PROJECTILE_PARAMS: Partial<
  Record<SkillFXType, { maxDist: number; durationMs: number }>
> = {
  arrow: { maxDist: 10, durationMs: 450 },
  fireball: { maxDist: 9, durationMs: 550 },
  shuriken: { maxDist: 11, durationMs: 500 },
};

export const BLAST_PROJECTILE_PARAMS: Partial<
  Record<SkillFXType, { blastDist: number; travelMs: number; blastRadius: number }>
> = {
  arrow_blast: { blastDist: 7, travelMs: 385, blastRadius: 2.5 },
  shuriken_blast: { blastDist: 8, travelMs: 375, blastRadius: 2.5 },
};
