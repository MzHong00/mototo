import type { SkillFXType } from "@/types/combat";
import { SKILL_FX_TYPE } from "@/constants/combat";

export const FX_DURATION: Record<SkillFXType, number> = {
  [SKILL_FX_TYPE.SLASH]: 480,
  [SKILL_FX_TYPE.BLAST]: 600,
  [SKILL_FX_TYPE.ARROW]: 450,
  [SKILL_FX_TYPE.ARROW_BLAST]: 700,
  [SKILL_FX_TYPE.FIREBALL]: 550,
  [SKILL_FX_TYPE.METEOR]: 900,
  [SKILL_FX_TYPE.SHURIKEN]: 500,
  [SKILL_FX_TYPE.SHURIKEN_BLAST]: 750,
};

export const SKILL_COLOR: Record<string, string> = {
  slash: "var(--accent)",
  shield: "var(--accent2)",
  heal: "var(--exp)",
  blast: "var(--danger)",
  dash: "#9B59B6",
};

export const SKILL_ICON: Record<string, string> = {
  slash: "⚔️",
  shield: "🛡️",
  heal: "✨",
  blast: "💥",
  dash: "⚡",
};

export const SKILL_DESCRIPTIONS: Record<string, string> = {
  slash: "전방 적에게 물리 데미지",
  shield: "일정 시간 피해 무효화",
  heal: "HP 30% 즉시 회복",
  blast: "광역 강력한 공격",
  dash: "진행 방향으로 빠르게 돌진",
};

// 1~9, Q W E R, A S D F 순서
export const SKILL_KEY_GROUPS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  ["Q", "W", "E", "R"],
  ["A", "S", "D", "F"],
] as const;

export const ALL_HOTKEYS = SKILL_KEY_GROUPS.flat();

export const SKILL_CODES = [
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
  "Digit5",
  "Digit6",
  "Digit7",
  "Digit8",
  "Digit9",
  "KeyQ",
  "KeyW",
  "KeyE",
  "KeyR",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyF",
] as const;
