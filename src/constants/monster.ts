import type { MonsterType } from "@/types/monster";

export const MONSTER_STATS: Record<
  MonsterType,
  { maxHp: number; exp: number; damage: number; speed: number; color: string; scale: number }
> = {
  green: { maxHp: 30,  exp: 10, damage: 5,  speed: 2.2, color: "#44AA44", scale: 0.7 },
  blue:  { maxHp: 60,  exp: 25, damage: 10, speed: 2.8, color: "#4488FF", scale: 0.9 },
  red:   { maxHp: 100, exp: 50, damage: 18, speed: 3.2, color: "#FF4444", scale: 1.1 },
};

export const AGGRO_RANGE   = 7;
export const DEAGGRO_RANGE = 12;
export const ATTACK_RANGE  = 1.3;
export const ATTACK_CD     = 2.0;
export const RESPAWN_MS    = 8_000;
