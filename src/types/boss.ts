import type { Item } from "@/types/item";

export type BossPhase = 1 | 2 | 3;
export type BossType = "red_guardian";

export interface BossState {
  hp: number;
  maxHp: number;
  phase: BossPhase;
  dead: boolean;
}

export interface BossStats {
  id: BossType;
  name: string;
  maxHp: number;
  speed: number;
  scale: number;
  attackDamage: number;
  attackCd: number;
  attackRange: number;
  aggroRange: number;
  phase2HpPct: number;
  phase3HpPct: number;
  phaseIframesMs: number;
  phaseColors: readonly [string, string, string];
  meleeStormRadius: number;
  meleeStormDps: number;
  projectileIntervalMs: number;
  projectileWindupMs: number;
  entryPosition: readonly [number, number, number];
  entryRadius: number;
  arenaRadius: number;
  arenaBoundary: number;
  clearExp: number;
  clearGold: number;
  rewardItem: Omit<Item, "uid">;
}
