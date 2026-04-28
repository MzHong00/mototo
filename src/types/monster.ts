export type MonsterType = "slime" | "goblin" | "orc";
export type MonsterRank = "normal" | "elite" | "boss";

export interface MonsterConfig {
  id: number;
  type: MonsterType;
  position: [number, number, number];
}
