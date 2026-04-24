import type { JobClass, SkillState } from "@/types/character";

export const EXP_PER_LEVEL = (lv: number) => lv * 100;

interface ClassConfig {
  hp: number;
  mp: number;
  atk: number;
  def: number;
  skills: SkillState[];
}

export const CLASS_CONFIG: Record<JobClass, ClassConfig> = {
  warrior: {
    hp: 150,
    mp: 30,
    atk: 20,
    def: 5,
    skills: [
      { id: "slash",  key: "1", label: "베기",    mpCost: 0,  cooldown: 0.5, lastUsed: 0 },
      { id: "shield", key: "2", label: "방패막기", mpCost: 8,  cooldown: 8,  lastUsed: 0 },
      { id: "heal",   key: "3", label: "투지",    mpCost: 10, cooldown: 10, lastUsed: 0 },
      { id: "blast",  key: "4", label: "회오리",   mpCost: 20, cooldown: 18, lastUsed: 0 },
    ],
  },
  archer: {
    hp: 100,
    mp: 60,
    atk: 22,
    def: 2,
    skills: [
      { id: "slash",  key: "1", label: "연사",    mpCost: 0,  cooldown: 0.4, lastUsed: 0 },
      { id: "shield", key: "2", label: "회피",    mpCost: 12, cooldown: 10, lastUsed: 0 },
      { id: "heal",   key: "3", label: "치료약",   mpCost: 15, cooldown: 12, lastUsed: 0 },
      { id: "blast",  key: "4", label: "폭발화살", mpCost: 25, cooldown: 20, lastUsed: 0 },
    ],
  },
  mage: {
    hp: 80,
    mp: 120,
    atk: 30,
    def: 0,
    skills: [
      { id: "slash",  key: "1", label: "화염볼",  mpCost: 5,  cooldown: 0.6, lastUsed: 0 },
      { id: "shield", key: "2", label: "냉기장벽", mpCost: 15, cooldown: 12, lastUsed: 0 },
      { id: "heal",   key: "3", label: "마나흡수", mpCost: 0,  cooldown: 15, lastUsed: 0 },
      { id: "blast",  key: "4", label: "메테오",   mpCost: 40, cooldown: 25, lastUsed: 0 },
    ],
  },
  rogue: {
    hp: 90,
    mp: 80,
    atk: 26,
    def: 1,
    skills: [
      { id: "slash",  key: "1", label: "표창",   mpCost: 0,  cooldown: 0.3, lastUsed: 0 },
      { id: "shield", key: "2", label: "은신",   mpCost: 12, cooldown: 10, lastUsed: 0 },
      { id: "heal",   key: "3", label: "회복약",  mpCost: 0,  cooldown: 18, lastUsed: 0 },
      { id: "blast",  key: "4", label: "폭탄",   mpCost: 30, cooldown: 15, lastUsed: 0 },
    ],
  },
};
