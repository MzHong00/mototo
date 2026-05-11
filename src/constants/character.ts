import type { JobClass } from "@/types/job";
import type { SkillState } from "@/types/character";
import { SKILL_TYPE, DAMAGE_TYPE, TARGET_TYPE } from "@/constants/combat";

export const EXP_PER_LEVEL = (lv: number) => lv * 100;

export const CHARACTER_MODELS: Record<JobClass, string> = {
  warrior: "/models/characters/warrior/model.glb",
  archer:  "/models/characters/archer/model.glb",
  mage:    "/models/characters/mage/model.glb",
  rogue:   "/models/characters/rogue/model.glb",
};

export const CHARACTER_ANIMATIONS = {
  // 공유 리그 애니메이션
  general:       "/models/characters/shared/animations/general.glb",
  movement:      "/models/characters/shared/animations/movement.glb",
  // 직업별 공격 애니메이션
  warriorAttack: "/models/characters/warrior/animations/slash.glb",
} as const;

export interface WeaponConfig {
  mainHand: string;
  offHand?: string;
}

export const WEAPON_MODELS: Record<JobClass, WeaponConfig> = {
  warrior: {
    mainHand: "/models/weapons/warrior/sword_1handed.glb",
    offHand:  "/models/weapons/warrior/shield_round.glb",
  },
  archer: {
    mainHand: "/models/weapons/archer/bow_withString.glb",
  },
  mage: {
    mainHand: "/models/weapons/mage/staff.glb",
  },
  rogue: {
    mainHand: "/models/weapons/rogue/dagger.glb",
  },
};

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

const DASH_SKILL: SkillState = {
  id: "dash",
  key: "5",
  label: "대쉬",
  skillType: SKILL_TYPE.BUFF,
  cooldown: 0.5,
  lastUsed: 0,
  level: 1,
  requiredLevel: 1,
};

interface ClassConfig {
  hp: number;
  atk: number;
  def: number;
  skills: SkillState[];
}

export const CLASS_CONFIG: Record<JobClass, ClassConfig> = {
  [JOB_CLASS.WARRIOR]: {
    hp: 150,
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
        cooldown: 0.5,
        lastUsed: 0,
        level: 1,
        requiredLevel: 1,
      },
      {
        id: "shield",
        key: "2",
        label: "방패막기",
        skillType: SKILL_TYPE.BUFF,
        cooldown: 8,
        lastUsed: 0,
        level: 1,
        requiredLevel: 10,
      },
      {
        id: "heal",
        key: "3",
        label: "투지",
        skillType: SKILL_TYPE.HEAL,
        cooldown: 10,
        lastUsed: 0,
        level: 1,
        requiredLevel: 20,
      },
      {
        id: "blast",
        key: "4",
        label: "회오리",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.AOE,
        cooldown: 18,
        lastUsed: 0,
        level: 1,
        requiredLevel: 30,
      },
      DASH_SKILL,
    ],
  },
  [JOB_CLASS.ARCHER]: {
    hp: 100,
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
        cooldown: 0.4,
        lastUsed: 0,
        level: 1,
        requiredLevel: 1,
      },
      {
        id: "shield",
        key: "2",
        label: "회피",
        skillType: SKILL_TYPE.BUFF,
        cooldown: 10,
        lastUsed: 0,
        level: 1,
        requiredLevel: 10,
      },
      {
        id: "heal",
        key: "3",
        label: "치료약",
        skillType: SKILL_TYPE.HEAL,
        cooldown: 12,
        lastUsed: 0,
        level: 1,
        requiredLevel: 20,
      },
      {
        id: "blast",
        key: "4",
        label: "폭발화살",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.AOE,
        cooldown: 20,
        lastUsed: 0,
        level: 1,
        requiredLevel: 30,
      },
      DASH_SKILL,
    ],
  },
  [JOB_CLASS.MAGE]: {
    hp: 80,
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
        cooldown: 0.6,
        lastUsed: 0,
        level: 1,
        requiredLevel: 1,
      },
      {
        id: "shield",
        key: "2",
        label: "냉기장벽",
        skillType: SKILL_TYPE.BUFF,
        cooldown: 12,
        lastUsed: 0,
        level: 1,
        requiredLevel: 10,
      },
      {
        id: "heal",
        key: "3",
        label: "마나흡수",
        skillType: SKILL_TYPE.HEAL,
        cooldown: 15,
        lastUsed: 0,
        level: 1,
        requiredLevel: 20,
      },
      {
        id: "blast",
        key: "4",
        label: "메테오",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.MAGIC,
        targetType: TARGET_TYPE.AOE,
        cooldown: 25,
        lastUsed: 0,
        level: 1,
        requiredLevel: 30,
      },
      DASH_SKILL,
    ],
  },
  [JOB_CLASS.ROGUE]: {
    hp: 90,
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
        cooldown: 0.3,
        lastUsed: 0,
        level: 1,
        requiredLevel: 1,
      },
      {
        id: "shield",
        key: "2",
        label: "은신",
        skillType: SKILL_TYPE.BUFF,
        cooldown: 10,
        lastUsed: 0,
        level: 1,
        requiredLevel: 10,
      },
      {
        id: "heal",
        key: "3",
        label: "회복약",
        skillType: SKILL_TYPE.HEAL,
        cooldown: 18,
        lastUsed: 0,
        level: 1,
        requiredLevel: 20,
      },
      {
        id: "blast",
        key: "4",
        label: "폭탄",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.AOE,
        cooldown: 15,
        lastUsed: 0,
        level: 1,
        requiredLevel: 30,
      },
      DASH_SKILL,
    ],
  },
};
