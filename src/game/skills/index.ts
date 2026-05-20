import { CLASS_SKILL_CONFIG } from "@/constants/skillConfig";
import { SLASH_DMG_MULT, BLAST_DMG_MULT } from "@/constants/growth";

import { fireSlash, fireBlast } from "./combat";
import { commonSkills } from "./common";

import type { JobClass } from "@/types/job";
import type { SkillConfig, SkillContext, SkillHandler } from "@/types/skill";

// ── 기본 실행 로직 — config에서 자동 빌드 ─────────────────────────
// slash / blast 패턴은 config(fx, hitDelay)만으로 실행 가능
// 새 공통 스킬 패턴이 생기면 여기에 케이스 추가
function buildDefaultExecute(id: string, cfg: SkillConfig): (ctx: SkillContext) => void {
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
const CUSTOM_SKILLS: Partial<Record<JobClass, Record<string, SkillHandler>>> = {
  // warrior: {
  //   groundSmash: {
  //     lockMs: 1200,
  //     triggersAttack: true,
  //     execute: (ctx) => { /* 범위 지진 공격 */ },
  //   },
  // },
};

// ── 레지스트리 빌드 ──────────────────────────────────────────────
function buildClassRegistry(cls: JobClass): Record<string, SkillHandler> {
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

export const SKILL_REGISTRY: Record<JobClass, Record<string, SkillHandler>> = {
  warrior: buildClassRegistry("warrior"),
  archer: buildClassRegistry("archer"),
  mage: buildClassRegistry("mage"),
  rogue: buildClassRegistry("rogue"),
};

export { commonSkills };
