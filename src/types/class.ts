import type { SkillState } from "@/types/skill";

export type Class = "warrior" | "archer" | "mage" | "rogue";

export interface ClassCardConfig {
  id: Class;
  icon: string;
  desc: string;
  stats: {
    hp: number;
    atk: number;
    def: number;
    spd: number;
  };
}

export interface ClassConfig {
  hp: number;
  atk: number;
  def: number;
  skills: SkillState[];
}

export interface WeaponConfig {
  mainHand: string;
  offHand?: string;
}
