import type { JobClass, SkillState } from "@/types/character";
import { SKILL_TYPE, DAMAGE_TYPE, TARGET_TYPE } from "@/constants/combat";

export const EXP_PER_LEVEL = (lv: number) => lv * 100;

export const JOB_CLASS = {
  WARRIOR: "warrior",
  ARCHER: "archer",
  MAGE: "mage",
  ROGUE: "rogue",
} as const satisfies Record<string, JobClass>;

export const JOB_CLASS_LABEL: Record<JobClass, string> = {
  [JOB_CLASS.WARRIOR]: "전사",
  [JOB_CLASS.ARCHER]: "궁수",
  [JOB_CLASS.MAGE]: "마법사",
  [JOB_CLASS.ROGUE]: "도적",
};

interface ClassConfig {
  hp: number;
  mp: number;
  atk: number;
  def: number;
  skills: SkillState[];
}

export const CLASS_CONFIG: Record<JobClass, ClassConfig> = {
  [JOB_CLASS.WARRIOR]: {
    hp: 150,
    mp: 30,
    atk: 20,
    def: 5,
    skills: [
      {
        id: "slash",
        key: "1",
        label: "베기",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.SINGLE,
        mpCost: 0,
        cooldown: 0.5,
        lastUsed: 0,
      },
      {
        id: "shield",
        key: "2",
        label: "방패막기",
        skillType: SKILL_TYPE.BUFF,
        mpCost: 8,
        cooldown: 8,
        lastUsed: 0,
      },
      {
        id: "heal",
        key: "3",
        label: "투지",
        skillType: SKILL_TYPE.HEAL,
        mpCost: 10,
        cooldown: 10,
        lastUsed: 0,
      },
      {
        id: "blast",
        key: "4",
        label: "회오리",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.AOE,
        mpCost: 20,
        cooldown: 18,
        lastUsed: 0,
      },
    ],
  },
  [JOB_CLASS.ARCHER]: {
    hp: 100,
    mp: 60,
    atk: 22,
    def: 2,
    skills: [
      {
        id: "slash",
        key: "1",
        label: "연사",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.SINGLE,
        mpCost: 0,
        cooldown: 0.4,
        lastUsed: 0,
      },
      {
        id: "shield",
        key: "2",
        label: "회피",
        skillType: SKILL_TYPE.BUFF,
        mpCost: 12,
        cooldown: 10,
        lastUsed: 0,
      },
      {
        id: "heal",
        key: "3",
        label: "치료약",
        skillType: SKILL_TYPE.HEAL,
        mpCost: 15,
        cooldown: 12,
        lastUsed: 0,
      },
      {
        id: "blast",
        key: "4",
        label: "폭발화살",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.AOE,
        mpCost: 25,
        cooldown: 20,
        lastUsed: 0,
      },
    ],
  },
  [JOB_CLASS.MAGE]: {
    hp: 80,
    mp: 120,
    atk: 30,
    def: 0,
    skills: [
      {
        id: "slash",
        key: "1",
        label: "화염볼",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.MAGIC,
        targetType: TARGET_TYPE.SINGLE,
        mpCost: 5,
        cooldown: 0.6,
        lastUsed: 0,
      },
      {
        id: "shield",
        key: "2",
        label: "냉기장벽",
        skillType: SKILL_TYPE.BUFF,
        mpCost: 15,
        cooldown: 12,
        lastUsed: 0,
      },
      {
        id: "heal",
        key: "3",
        label: "마나흡수",
        skillType: SKILL_TYPE.HEAL,
        mpCost: 0,
        cooldown: 15,
        lastUsed: 0,
      },
      {
        id: "blast",
        key: "4",
        label: "메테오",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.MAGIC,
        targetType: TARGET_TYPE.AOE,
        mpCost: 40,
        cooldown: 25,
        lastUsed: 0,
      },
    ],
  },
  [JOB_CLASS.ROGUE]: {
    hp: 90,
    mp: 80,
    atk: 26,
    def: 1,
    skills: [
      {
        id: "slash",
        key: "1",
        label: "표창",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.SINGLE,
        mpCost: 0,
        cooldown: 0.3,
        lastUsed: 0,
      },
      {
        id: "shield",
        key: "2",
        label: "은신",
        skillType: SKILL_TYPE.BUFF,
        mpCost: 12,
        cooldown: 10,
        lastUsed: 0,
      },
      {
        id: "heal",
        key: "3",
        label: "회복약",
        skillType: SKILL_TYPE.HEAL,
        mpCost: 0,
        cooldown: 18,
        lastUsed: 0,
      },
      {
        id: "blast",
        key: "4",
        label: "폭탄",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.AOE,
        mpCost: 30,
        cooldown: 15,
        lastUsed: 0,
      },
    ],
  },
};
