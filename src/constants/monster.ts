import type { MonsterType, MonsterRank } from "@/types/monster";

export const MONSTER_TYPE = {
  SLIME: "slime",
  GOBLIN: "goblin",
  ORC: "orc",
} as const satisfies Record<string, MonsterType>;

export const MONSTER_TYPE_LABEL: Record<MonsterType, string> = {
  [MONSTER_TYPE.SLIME]: "풀 슬라임",
  [MONSTER_TYPE.GOBLIN]: "숲 고블린",
  [MONSTER_TYPE.ORC]: "황야 오크",
};

export const MONSTER_RANK = {
  NORMAL: "normal",
  ELITE: "elite",
  BOSS: "boss",
} as const satisfies Record<string, MonsterRank>;

export const MONSTER_RANK_LABEL: Record<MonsterRank, string> = {
  [MONSTER_RANK.NORMAL]: "일반",
  [MONSTER_RANK.ELITE]: "정예",
  [MONSTER_RANK.BOSS]: "보스",
};

interface MonsterStats {
  level: number;
  maxHp: number;
  exp: number;
  damage: number;
  speed: number;
  color: string;
  scale: number;
  rank: MonsterRank;
}

export const MONSTERS = {
  mototo: {
    evergreen: {
      [MONSTER_TYPE.SLIME]: {
        level: 1,
        maxHp: 30,
        exp: 10,
        damage: 5,
        speed: 2.2,
        color: "#44AA44",
        scale: 0.7,
        rank: MONSTER_RANK.NORMAL,
      } satisfies MonsterStats,
      [MONSTER_TYPE.GOBLIN]: {
        level: 3,
        maxHp: 60,
        exp: 25,
        damage: 10,
        speed: 2.8,
        color: "#4488FF",
        scale: 0.9,
        rank: MONSTER_RANK.NORMAL,
      } satisfies MonsterStats,
      [MONSTER_TYPE.ORC]: {
        level: 6,
        maxHp: 100,
        exp: 50,
        damage: 18,
        speed: 3.2,
        color: "#FF4444",
        scale: 1.1,
        rank: MONSTER_RANK.ELITE,
      } satisfies MonsterStats,
    },
  },
} as const;

export const MONSTER_STATS: Record<MonsterType, MonsterStats> = {
  [MONSTER_TYPE.SLIME]: MONSTERS.mototo.evergreen[MONSTER_TYPE.SLIME],
  [MONSTER_TYPE.GOBLIN]: MONSTERS.mototo.evergreen[MONSTER_TYPE.GOBLIN],
  [MONSTER_TYPE.ORC]: MONSTERS.mototo.evergreen[MONSTER_TYPE.ORC],
};

export const AGGRO_RANGE = 7;
export const DEAGGRO_RANGE = 12;
export const ATTACK_RANGE = 1.3;
export const ATTACK_CD = 2.0;
export const RESPAWN_MS = 8_000;
