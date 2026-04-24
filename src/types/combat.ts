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
