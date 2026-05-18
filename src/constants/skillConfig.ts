import type { JobClass } from "@/types/job";

import type { SkillConfig } from "@/types/skill";

export const CLASS_SKILL_CONFIG: Record<JobClass, Record<string, SkillConfig>> = {
  warrior: {
    slash: { lockMs: 500, triggersAttack: true, hitDelay: 250 }, // fx 없음 — GLB 슬래시 모션으로 대체
    blast: { lockMs: 1500, triggersAttack: true, fx: "blast" },
  },
  archer: {
    slash: { lockMs: 500, triggersAttack: true, fx: "arrow", hitDelay: 0 },
    blast: { lockMs: 500, triggersAttack: true, fx: "arrow_blast" },
  },
  mage: {
    slash: { lockMs: 500, triggersAttack: true, fx: "fireball", hitDelay: 0 },
    blast: { lockMs: 500, triggersAttack: true, fx: "meteor" },
  },
  rogue: {
    slash: { lockMs: 500, triggersAttack: true, fx: "shuriken", hitDelay: 0 },
    blast: { lockMs: 500, triggersAttack: true, fx: "shuriken_blast" },
  },
};
