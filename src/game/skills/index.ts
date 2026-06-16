import { CLASS_SKILL_CONFIG } from "@/constants/skill/skillConfig";
import { CLASS } from "@/constants/character/class";
import { SLASH_DMG_MULT, BLAST_DMG_MULT } from "@/constants/character/growth";

import { fireSlash, fireBlast } from "./combat";

import type { Class } from "@/types/class";
import type { SkillConfig, SkillContext, SkillHandler } from "@/types/skill";

// ── 기본 실행 로직 — config에서 자동 빌드 ─────────────────────────
// slash / blast 패턴은 config(fx, hitDelay)만으로 실행 가능
// 새 패턴이 생기면 여기에 케이스 추가
function buildDefaultExecute(_id: string, cfg: SkillConfig): (ctx: SkillContext) => void {
  if (cfg.pattern === "slash") {
    return ({ ppos, facing, pos, dir, atk, skillLevel, addFX }) => {
      if (cfg.fx) addFX(cfg.fx, pos, dir);
      const dmg = Math.floor(atk * SLASH_DMG_MULT(skillLevel) + Math.random() * 6);
      fireSlash(ppos, facing, cfg.fx, dmg, cfg.hitDelay ?? 0);
    };
  }
  if (cfg.pattern === "blast") {
    return ({ ppos, facing, pos, dir, atk, skillLevel, addFX }) => {
      if (cfg.fx) addFX(cfg.fx, pos, dir);
      const dmg = Math.floor(atk * BLAST_DMG_MULT(skillLevel) + Math.random() * 12);
      if (cfg.fx) fireBlast(ppos, facing, cfg.fx, dmg);
    };
  }
  return () => {};
}

// ── 커스텀 스킬 — config 패턴에 안 맞는 고유 메커니즘 ─────────────
// 새 고유 스킬 추가 시 해당 직업 아래에 SkillHandler를 정의
// 같은 id가 config에 있으면 커스텀이 override함
const CUSTOM_SKILLS: Partial<Record<Class, Record<string, SkillHandler>>> = {
  // warrior: {
  //   groundSmash: {
  //     lockMs: 1200,
  //     triggersAttack: true,
  //     execute: (ctx) => { /* 범위 지진 공격 */ },
  //   },
  // },
};

// ── 레지스트리 빌드 ──────────────────────────────────────────────
function buildClassRegistry(cls: Class): Record<string, SkillHandler> {
  const registry: Record<string, SkillHandler> = {};

  for (const [id, cfg] of Object.entries(CLASS_SKILL_CONFIG[cls])) {
    registry[id] = {
      lockMs: cfg.lockMs,
      triggersAttack: cfg.triggersAttack,
      execute: buildDefaultExecute(id, cfg),
    };
  }

  Object.assign(registry, CUSTOM_SKILLS[cls]);
  return registry;
}

export const SKILL_REGISTRY: Record<Class, Record<string, SkillHandler>> = {
  [CLASS.WARRIOR]: buildClassRegistry(CLASS.WARRIOR),
  [CLASS.ARCHER]: buildClassRegistry(CLASS.ARCHER),
  [CLASS.MAGE]: buildClassRegistry(CLASS.MAGE),
  [CLASS.ROGUE]: buildClassRegistry(CLASS.ROGUE),
};
