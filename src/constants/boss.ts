import type { Item } from "@/types/item";
import type { BossType, BossStats } from "@/types/boss";
import { ITEMS } from "@/constants/items";
import { ITEM_TYPE } from "@/constants/item";

export const BOSS_TYPE = {
  KING_BEAR: "king_bear",
  GIANT_TURTLE: "giant_turtle",
  KING_DEER: "king_deer",
} as const satisfies Record<string, BossType>;

export const BOSS_TYPE_LABEL: Record<BossType, string> = {
  [BOSS_TYPE.KING_BEAR]: "왕 곰",
  [BOSS_TYPE.GIANT_TURTLE]: "대왕 거북",
  [BOSS_TYPE.KING_DEER]: "왕 사슴",
};

export const BOSSES = {
  mototo: {
    evergreen: {
      [BOSS_TYPE.KING_BEAR]: {
        id: BOSS_TYPE.KING_BEAR,
        name: "왕 곰",
        maxHp: 800,
        speed: 3.5,
        scale: 2.5,
        attackDamage: 18,
        attackCd: 1.8,
        attackRange: 2.2,
        aggroRange: 30,
        phase2HpPct: 0.6,
        phase3HpPct: 0.3,
        phaseIframesMs: 1000,
        phaseColors: ["#DAA520", "#8B4513", "#FF9AC1"] as const,
        meleeStormRadius: 3.5,
        meleeStormDps: 15,
        projectileIntervalMs: 2500,
        projectileWindupMs: 2000,
        entryPosition: [15, 0, 0] as const,
        entryRadius: 2.5,
        arenaRadius: 20,
        arenaBoundary: 19,
        clearExp: 300,
        clearGold: 500,
        rewardItem: ITEMS[ITEM_TYPE.WEAPON].bear_claw_sword,
      } satisfies BossStats,
    },
    blueCove: {
      [BOSS_TYPE.GIANT_TURTLE]: {
        id: BOSS_TYPE.GIANT_TURTLE,
        name: "대왕 거북",
        maxHp: 2000,
        speed: 2.8,
        scale: 3.0,
        attackDamage: 30,
        attackCd: 2.0,
        attackRange: 2.5,
        aggroRange: 30,
        phase2HpPct: 0.6,
        phase3HpPct: 0.3,
        phaseIframesMs: 1000,
        phaseColors: ["#338833", "#00AAAA", "#0066FF"] as const,
        meleeStormRadius: 4.0,
        meleeStormDps: 20,
        projectileIntervalMs: 3000,
        projectileWindupMs: 2000,
        entryPosition: [15, 0, 0] as const,
        entryRadius: 2.5,
        arenaRadius: 20,
        arenaBoundary: 19,
        clearExp: 700,
        clearGold: 1200,
        rewardItem: ITEMS[ITEM_TYPE.ARMOR].turtle_shield,
      } satisfies BossStats,
    },
    danpunggol: {
      [BOSS_TYPE.KING_DEER]: {
        id: BOSS_TYPE.KING_DEER,
        name: "왕 사슴",
        maxHp: 3500,
        speed: 4.0,
        scale: 2.8,
        attackDamage: 45,
        attackCd: 1.5,
        attackRange: 2.5,
        aggroRange: 30,
        phase2HpPct: 0.6,
        phase3HpPct: 0.3,
        phaseIframesMs: 1000,
        phaseColors: ["#DDAA00", "#FF8800", "#88CCFF"] as const,
        meleeStormRadius: 5.0,
        meleeStormDps: 25,
        projectileIntervalMs: 2000,
        projectileWindupMs: 1500,
        entryPosition: [15, 0, 0] as const,
        entryRadius: 2.5,
        arenaRadius: 20,
        arenaBoundary: 19,
        clearExp: 1500,
        clearGold: 2500,
        rewardItem: ITEMS[ITEM_TYPE.WEAPON].deer_horn_sword,
      } satisfies BossStats,
    },
  },
} as const;

export const BOSS_STATS: Record<BossType, BossStats> = {
  [BOSS_TYPE.KING_BEAR]: BOSSES.mototo.evergreen[BOSS_TYPE.KING_BEAR],
  [BOSS_TYPE.GIANT_TURTLE]: BOSSES.mototo.blueCove[BOSS_TYPE.GIANT_TURTLE],
  [BOSS_TYPE.KING_DEER]: BOSSES.mototo.danpunggol[BOSS_TYPE.KING_DEER],
};

export const BOSS_REWARD_ITEM: Item = {
  ...BOSS_STATS[BOSS_TYPE.KING_BEAR].rewardItem,
  uid: "bear_claw_sword_reward",
};
