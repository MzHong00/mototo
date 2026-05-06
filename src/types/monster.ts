export type MonsterType =
  | "chicken"
  | "rooster"
  | "sheep"
  | "ram"
  | "deer"
  | "elk"
  | "pig"
  | "wildBoar";

export type MonsterRank = "normal" | "elite" | "boss";

export interface MonsterConfig {
  id: number;
  type: MonsterType;
  position: [number, number, number];
}
