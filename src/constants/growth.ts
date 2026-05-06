export const SKILL_LEVEL_MAX = 5;
export const PASSIVE_LEVEL_MAX = 10;

export type SkillUpgradeCategory = "damage_slash" | "damage_blast" | "cooldown" | "heal";

export const SKILL_UPGRADE_CATEGORY: Record<string, SkillUpgradeCategory> = {
  slash: "damage_slash",
  blast: "damage_blast",
  shield: "cooldown",
  heal: "heal",
  dash: "cooldown",
};

// 레벨별 배율 (level 1~5)
export const SLASH_DMG_MULT = (lv: number) => 0.75 + lv * 0.05; // 0.80 → 1.00
export const BLAST_DMG_MULT = (lv: number) => 1.4 + lv * 0.2; // 1.60 → 2.40
export const HEAL_PCT = (lv: number) => 0.25 + lv * 0.05; // 0.30 → 0.50
export const COOLDOWN_MULT = (lv: number) => 1 - (lv - 1) * 0.1; // 1.00 → 0.60

export function getSkillUpgradeDesc(skillId: string, level: number): string {
  const cat = SKILL_UPGRADE_CATEGORY[skillId];
  if (cat === "damage_slash") return `데미지 배율 ${SLASH_DMG_MULT(level).toFixed(2)}×`;
  if (cat === "damage_blast") return `데미지 배율 ${BLAST_DMG_MULT(level).toFixed(2)}×`;
  if (cat === "heal") return `회복량 최대HP × ${(HEAL_PCT(level) * 100).toFixed(0)}%`;
  if (cat === "cooldown") return `쿨타임 감소 ${((1 - COOLDOWN_MULT(level)) * 100).toFixed(0)}%`;
  return "";
}

export const PASSIVE_CONFIG = {
  hp: {
    label: "HP 강화",
    icon: "❤️",
    bonusPerLevel: 30,
    desc: (lv: number) => `최대 HP +${lv * 30}`,
  },
  mp: {
    label: "MP 강화",
    icon: "💙",
    bonusPerLevel: 20,
    desc: (lv: number) => `최대 MP +${lv * 20}`,
  },
  atk: {
    label: "공격력 강화",
    icon: "⚔️",
    bonusPerLevel: 5,
    desc: (lv: number) => `ATK +${lv * 5}`,
  },
  def: {
    label: "방어력 강화",
    icon: "🛡️",
    bonusPerLevel: 2,
    desc: (lv: number) => `DEF +${lv * 2}`,
  },
} as const;

export type PassiveStat = keyof typeof PASSIVE_CONFIG;
export const PASSIVE_STATS = Object.keys(PASSIVE_CONFIG) as PassiveStat[];
