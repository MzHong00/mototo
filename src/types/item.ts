export type ItemType = "weapon" | "armor" | "ring";

export interface Item {
  uid: string;
  id: string;
  name: string;
  type: ItemType;
  icon: string;
  atk: number;
  def: number;
  hpBonus: number;
}
