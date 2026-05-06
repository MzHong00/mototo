import type { MonsterType, MonsterRank } from "@/types/monster";

export const MONSTER_TYPE = {
  CHICKEN: "chicken",
  ROOSTER: "rooster",
  SHEEP: "sheep",
  RAM: "ram",
  DEER: "deer",
  ELK: "elk",
  PIG: "pig",
  WILD_BOAR: "wildBoar",
} as const satisfies Record<string, MonsterType>;

export const MONSTER_TYPE_LABEL: Record<MonsterType, string> = {
  [MONSTER_TYPE.CHICKEN]: "닭",
  [MONSTER_TYPE.ROOSTER]: "수탉",
  [MONSTER_TYPE.SHEEP]: "양",
  [MONSTER_TYPE.RAM]: "숫양",
  [MONSTER_TYPE.DEER]: "사슴",
  [MONSTER_TYPE.ELK]: "엘크",
  [MONSTER_TYPE.PIG]: "돼지",
  [MONSTER_TYPE.WILD_BOAR]: "멧돼지",
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
      meadow: {
        [MONSTER_TYPE.CHICKEN]: {
          level: 1,
          maxHp: 18,
          exp: 8,
          damage: 3,
          speed: 2.0,
          color: "#F4C542",
          scale: 0.6,
          rank: MONSTER_RANK.NORMAL,
        } satisfies MonsterStats,
        [MONSTER_TYPE.ROOSTER]: {
          level: 2,
          maxHp: 32,
          exp: 15,
          damage: 6,
          speed: 2.4,
          color: "#E8821A",
          scale: 0.75,
          rank: MONSTER_RANK.ELITE,
        } satisfies MonsterStats,
      },
      forest: {
        [MONSTER_TYPE.SHEEP]: {
          level: 3,
          maxHp: 45,
          exp: 22,
          damage: 8,
          speed: 2.0,
          color: "#EEEEEE",
          scale: 0.85,
          rank: MONSTER_RANK.NORMAL,
        } satisfies MonsterStats,
        [MONSTER_TYPE.RAM]: {
          level: 4,
          maxHp: 70,
          exp: 35,
          damage: 13,
          speed: 2.6,
          color: "#8B7355",
          scale: 1.0,
          rank: MONSTER_RANK.ELITE,
        } satisfies MonsterStats,
      },
      swamp: {
        [MONSTER_TYPE.DEER]: {
          level: 5,
          maxHp: 75,
          exp: 45,
          damage: 13,
          speed: 3.0,
          color: "#C19A6B",
          scale: 1.0,
          rank: MONSTER_RANK.NORMAL,
        } satisfies MonsterStats,
        [MONSTER_TYPE.ELK]: {
          level: 6,
          maxHp: 105,
          exp: 60,
          damage: 19,
          speed: 2.8,
          color: "#8B4513",
          scale: 1.2,
          rank: MONSTER_RANK.ELITE,
        } satisfies MonsterStats,
      },
      ruins: {
        [MONSTER_TYPE.PIG]: {
          level: 7,
          maxHp: 95,
          exp: 55,
          damage: 16,
          speed: 2.4,
          color: "#FFB6C1",
          scale: 0.9,
          rank: MONSTER_RANK.NORMAL,
        } satisfies MonsterStats,
        [MONSTER_TYPE.WILD_BOAR]: {
          level: 8,
          maxHp: 135,
          exp: 80,
          damage: 24,
          speed: 3.2,
          color: "#654321",
          scale: 1.1,
          rank: MONSTER_RANK.ELITE,
        } satisfies MonsterStats,
      },
    },
  },
} as const;

export const MONSTER_STATS: Record<MonsterType, MonsterStats> = {
  [MONSTER_TYPE.CHICKEN]: MONSTERS.mototo.evergreen.meadow[MONSTER_TYPE.CHICKEN],
  [MONSTER_TYPE.ROOSTER]: MONSTERS.mototo.evergreen.meadow[MONSTER_TYPE.ROOSTER],
  [MONSTER_TYPE.SHEEP]: MONSTERS.mototo.evergreen.forest[MONSTER_TYPE.SHEEP],
  [MONSTER_TYPE.RAM]: MONSTERS.mototo.evergreen.forest[MONSTER_TYPE.RAM],
  [MONSTER_TYPE.DEER]: MONSTERS.mototo.evergreen.swamp[MONSTER_TYPE.DEER],
  [MONSTER_TYPE.ELK]: MONSTERS.mototo.evergreen.swamp[MONSTER_TYPE.ELK],
  [MONSTER_TYPE.PIG]: MONSTERS.mototo.evergreen.ruins[MONSTER_TYPE.PIG],
  [MONSTER_TYPE.WILD_BOAR]: MONSTERS.mototo.evergreen.ruins[MONSTER_TYPE.WILD_BOAR],
};

export const AGGRO_RANGE = 7;
export const DEAGGRO_RANGE = 12;
export const ATTACK_RANGE = 1.3;
export const ATTACK_CD = 2.0;
export const RESPAWN_MS = 8_000;
