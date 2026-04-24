import type { SkillFXType } from "@/types/combat";

export const FX_DURATION: Record<SkillFXType, number> = {
  slash:          400,
  blast:          600,
  arrow:          450,
  arrow_blast:    700,
  fireball:       550,
  meteor:         900,
  shuriken:       500,
  shuriken_blast: 750,
};

export const SKILL_COLOR: Record<string, string> = {
  slash:  "var(--accent)",
  shield: "var(--accent2)",
  heal:   "var(--exp)",
  blast:  "var(--danger)",
};

// 1~9, Q W E R, A S D F 순서
export const SKILL_KEY_GROUPS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  ["Q", "W", "E", "R"],
  ["A", "S", "D", "F"],
] as const;

export const ALL_HOTKEYS = SKILL_KEY_GROUPS.flat();

export const SKILL_CODES = [
  "Digit1", "Digit2", "Digit3", "Digit4", "Digit5",
  "Digit6", "Digit7", "Digit8", "Digit9",
  "KeyQ", "KeyW", "KeyE", "KeyR",
  "KeyA", "KeyS", "KeyD", "KeyF",
] as const;
