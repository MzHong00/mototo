import type { JobClass } from "@/types/job";
import type { SkillState } from "@/types/character";
import { SKILL_TYPE, DAMAGE_TYPE, TARGET_TYPE } from "@/constants/combat";

export const MAX_LEVEL = 50;
export const EXP_PER_LEVEL = (lv: number) => lv * 100;

export const CHARACTER_MODELS: Record<JobClass, string> = {
  warrior: "/models/characters/warrior/model.glb",
  archer: "/models/characters/archer/model.glb",
  mage: "/models/characters/mage/model.glb",
  rogue: "/models/characters/rogue/model.glb",
};

export const CHARACTER_ANIMATIONS = {
  general: "/models/characters/shared/animations/general.glb",
  movement: "/models/characters/shared/animations/movement.glb",
  warriorAttack: "/models/characters/warrior/animations/slash.glb",
} as const;

export interface WeaponConfig {
  mainHand: string;
  offHand?: string;
}

export const WEAPON_MODELS: Record<JobClass, WeaponConfig> = {
  warrior: {
    mainHand: "/models/weapons/warrior/sword_1handed.glb",
    offHand: "/models/weapons/warrior/shield_round.glb",
  },
  archer: { mainHand: "/models/weapons/archer/bow_withString.glb" },
  mage: { mainHand: "/models/weapons/mage/staff.glb" },
  rogue: { mainHand: "/models/weapons/rogue/dagger.glb" },
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
        id: "charge",
        key: "2",
        label: "돌진",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.SINGLE,
        cooldown: 8,
        lastUsed: 0,
        level: 1,
        requiredLevel: 10,
      },
      {
        id: "taunt",
        key: "3",
        label: "도발",
        skillType: SKILL_TYPE.BUFF,
        cooldown: 15,
        lastUsed: 0,
        level: 1,
        requiredLevel: 20,
      },
      {
        id: "cataclysm",
        key: "4",
        label: "파멸의 일격",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.SINGLE,
        cooldown: 25,
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
        id: "arrow_shot",
        key: "1",
        label: "화살",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.SINGLE,
        cooldown: 0.35,
        lastUsed: 0,
        level: 1,
        requiredLevel: 1,
      },
      {
        id: "piercing_arrow",
        key: "2",
        label: "관통화살",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.SINGLE,
        cooldown: 10,
        lastUsed: 0,
        level: 1,
        requiredLevel: 10,
      },
      {
        id: "backstep",
        key: "3",
        label: "백스텝",
        skillType: SKILL_TYPE.BUFF,
        cooldown: 12,
        lastUsed: 0,
        level: 1,
        requiredLevel: 20,
      },
      {
        id: "explosive_arrow",
        key: "4",
        label: "작렬화살",
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
        id: "fireball",
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
        id: "ice_spike",
        key: "2",
        label: "빙결창",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.MAGIC,
        targetType: TARGET_TYPE.SINGLE,
        cooldown: 10,
        lastUsed: 0,
        level: 1,
        requiredLevel: 10,
      },
      {
        id: "blink",
        key: "3",
        label: "순간이동",
        skillType: SKILL_TYPE.BUFF,
        cooldown: 12,
        lastUsed: 0,
        level: 1,
        requiredLevel: 20,
      },
      {
        id: "black_hole",
        key: "4",
        label: "블랙홀",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.MAGIC,
        targetType: TARGET_TYPE.AOE,
        cooldown: 28,
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
        id: "dagger_slash",
        key: "1",
        label: "단검 베기",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.SINGLE,
        cooldown: 0.3,
        lastUsed: 0,
        level: 1,
        requiredLevel: 1,
      },
      {
        id: "shadow_slash",
        key: "2",
        label: "그림자 베기",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.SINGLE,
        cooldown: 5,
        lastUsed: 0,
        level: 1,
        requiredLevel: 10,
      },
      {
        id: "smoke_bomb",
        key: "3",
        label: "연막탄",
        skillType: SKILL_TYPE.BUFF,
        cooldown: 14,
        lastUsed: 0,
        level: 1,
        requiredLevel: 20,
      },
      {
        id: "death_dance",
        key: "4",
        label: "죽음의 무도",
        skillType: SKILL_TYPE.ATTACK,
        damageType: DAMAGE_TYPE.PHYSICAL,
        targetType: TARGET_TYPE.SINGLE,
        cooldown: 30,
        lastUsed: 0,
        level: 1,
        requiredLevel: 30,
      },
      DASH_SKILL,
    ],
  },
};
