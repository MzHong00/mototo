import type { SkillUpgradeCategory } from "@/types/skill";

export const SKILL_UPGRADE_CATEGORY: Record<string, SkillUpgradeCategory> = {
  // Warrior
  slash: "damage_slash",
  charge: "cooldown",
  taunt: "cooldown",
  cataclysm: "damage_blast",
  // Archer
  arrow_shot: "damage_slash",
  piercing_arrow: "damage_slash",
  backstep: "cooldown",
  explosive_arrow: "damage_blast",
  // Mage
  fireball: "damage_slash",
  ice_spike: "damage_slash",
  blink: "cooldown",
  black_hole: "damage_blast",
  // Rogue
  dagger_slash: "damage_slash",
  shadow_slash: "damage_slash",
  smoke_bomb: "cooldown",
  death_dance: "damage_blast",
  // Common
  dash: "cooldown",
};

export const SLASH_DMG_MULT = (lv: number) => 0.75 + lv * 0.05; // 0.80 → 1.00
export const BLAST_DMG_MULT = (lv: number) => 1.4 + lv * 0.2; // 1.60 → 2.40
export const HEAL_PCT = (lv: number) => 0.25 + lv * 0.05; // 0.30 → 0.50
export const COOLDOWN_MULT = (lv: number) => 1 - (lv - 1) * 0.1; // 1.00 → 0.60
