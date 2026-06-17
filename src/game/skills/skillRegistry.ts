import { CLASS_SKILL_CONFIG } from "@/constants/skill/skillConfig";
import { CLASS } from "@/constants/character/class";
import { SLASH_DMG_MULT, BLAST_DMG_MULT } from "@/constants/character/growth";

import { SKILL_HIT_PATTERN } from "@/constants/skill/combat";
import { fireSlash, fireBlast } from "./combat";

import type { Class } from "@/types/class";
import type { SkillConfig, SkillContext, SkillHandler } from "@/types/skill";

function buildExecute(cfg: SkillConfig): (ctx: SkillContext) => void {
  if (cfg.hitPattern === SKILL_HIT_PATTERN.SLASH) {
    return ({ ppos, facing, pos, dir, atk, skillLevel, addFX }) => {
      if (cfg.fx) addFX(cfg.fx, pos, dir);
      const dmg = Math.floor(atk * SLASH_DMG_MULT(skillLevel) + Math.random() * 6);
      fireSlash(ppos, facing, cfg.fx, dmg, cfg.hitDelay ?? 0);
    };
  }
  if (cfg.hitPattern === SKILL_HIT_PATTERN.BLAST) {
    return ({ ppos, facing, pos, dir, atk, skillLevel, addFX }) => {
      if (cfg.fx) addFX(cfg.fx, pos, dir);
      const dmg = Math.floor(atk * BLAST_DMG_MULT(skillLevel) + Math.random() * 12);
      if (cfg.fx) fireBlast(ppos, facing, cfg.fx, dmg);
    };
  }
  return () => {};
}

function buildClassRegistry(cls: Class): Record<string, SkillHandler> {
  return Object.fromEntries(
    Object.entries(CLASS_SKILL_CONFIG[cls]).map(([id, cfg]) => [
      id,
      { lockMs: cfg.lockMs, triggersAttack: cfg.triggersAttack, execute: buildExecute(cfg) },
    ]),
  );
}

export const SKILL_REGISTRY: Record<Class, Record<string, SkillHandler>> = Object.fromEntries(
  Object.values(CLASS).map((cls) => [cls, buildClassRegistry(cls)]),
) as Record<Class, Record<string, SkillHandler>>;
