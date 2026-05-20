export type DamageType = "physical" | "magic";
export type TargetType = "single" | "aoe";
export type SkillType = "attack" | "buff" | "heal";

export type SkillFXType =
  | "slash"
  | "blast"
  | "arrow"
  | "arrow_blast"
  | "fireball"
  | "meteor"
  | "shuriken"
  | "shuriken_blast";

export interface SkillFX {
  fxId: number;
  type: SkillFXType;
  pos: [number, number, number];
  dir: [number, number, number];
  startTime: number;
}
