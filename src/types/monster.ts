export type MonsterType = "green" | "blue" | "red";

export interface MonsterConfig {
  id: number;
  type: MonsterType;
  position: [number, number, number];
}
