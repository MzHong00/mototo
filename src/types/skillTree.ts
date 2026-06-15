import type { SkillFXType, DamageType, TargetType } from "@/types/combat";

export type SkillBehaviorTag =
  | "aoe_360"
  | "dash_then_attack"
  | "reflect_damage"
  | "speed_boost"
  | "execute_bonus"
  | "linger_flame";

export interface SkillNodeModifier {
  fxType?: SkillFXType;
  targetType?: TargetType;
  damageMultiplier?: number;
  cooldownMultiplier?: number;
  durationMultiplier?: number;
  damageType?: DamageType;
  behaviorTag?: SkillBehaviorTag;
}

export type Archetype =
  | "🔴 광전사"
  | "🔵 지배자"
  | "🟢 기동형"
  | "🟣 포격형"
  | "🔥 파괴형"
  | "❄️ 통제형"
  | "🗡️ 표창형"
  | "⚔️ 단검형";

export interface SkillNodeChoice {
  id: string;
  label: string;
  description: string;
  archetype: Archetype;
  modifier: SkillNodeModifier;
  disabled?: true;
}

export interface SkillTierDef {
  tier: number;
  requiredLevel: number;
  choices: [SkillNodeChoice, SkillNodeChoice];
}

export interface SkillTreeDef {
  skillId: string;
  tiers: SkillTierDef[];
}
