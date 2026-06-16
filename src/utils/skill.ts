import {
  SKILL_UPGRADE_CATEGORY,
  SLASH_DMG_MULT,
  BLAST_DMG_MULT,
  HEAL_PCT,
  COOLDOWN_MULT,
} from "@/constants/character/growth";

export function getSkillUpgradeDesc(skillId: string, level: number): string {
  const cat = SKILL_UPGRADE_CATEGORY[skillId];
  if (cat === "damage_slash") return `데미지 배율 ${SLASH_DMG_MULT(level).toFixed(2)}×`;
  if (cat === "damage_blast") return `데미지 배율 ${BLAST_DMG_MULT(level).toFixed(2)}×`;
  if (cat === "heal") return `회복량 최대HP × ${(HEAL_PCT(level) * 100).toFixed(0)}%`;
  if (cat === "cooldown") return `쿨타임 감소 ${((1 - COOLDOWN_MULT(level)) * 100).toFixed(0)}%`;
  return "";
}
