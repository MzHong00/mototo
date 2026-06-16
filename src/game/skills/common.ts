import { dashTrigger } from "@/stores/worldRefs";
import { HEAL_PCT } from "@/constants/character/growth";

import type { SkillHandler } from "@/types/skill";

export const commonSkills: Record<string, SkillHandler> = {
  shield: {
    lockMs: 600,
    execute: ({ activateShield }) => activateShield(),
  },
  heal: {
    lockMs: 800,
    execute: ({ healHp, maxHp, skillLevel }) => healHp(Math.floor(maxHp * HEAL_PCT(skillLevel))),
  },
  dash: {
    lockMs: 220,
    execute: () => {
      dashTrigger.pending = true;
    },
  },
};
