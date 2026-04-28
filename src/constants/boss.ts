import type { Item } from "@/types/item";
import type { BossType, BossStats } from "@/types/boss";
import { ITEMS } from "@/constants/items";
import { ITEM_TYPE } from "@/constants/item";

export const BOSS_TYPE = {
  RED_GUARDIAN: "red_guardian",
} as const satisfies Record<string, BossType>;

export const BOSS_TYPE_LABEL: Record<BossType, string> = {
  [BOSS_TYPE.RED_GUARDIAN]: "붉은 수호자",
};

export const BOSSES = {
  mototo: {
    evergreen: {
      [BOSS_TYPE.RED_GUARDIAN]: {
        id: BOSS_TYPE.RED_GUARDIAN,
        name: "붉은 수호자",
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
        phaseColors: ["#CC2222", "#FF6600", "#AA00FF"] as const,
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
        rewardItem: ITEMS[ITEM_TYPE.WEAPON].boss_sword,
      } satisfies BossStats,
    },
  },
} as const;

export const BOSS_STATS: Record<BossType, BossStats> = {
  [BOSS_TYPE.RED_GUARDIAN]: BOSSES.mototo.evergreen[BOSS_TYPE.RED_GUARDIAN],
};

export const BOSS_REWARD_ITEM: Item = {
  ...BOSS_STATS[BOSS_TYPE.RED_GUARDIAN].rewardItem,
  uid: "boss_sword_reward",
};
