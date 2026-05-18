import type { JobClass } from "@/types/job";

export type ItemType = "weapon" | "armor" | "ring";
export type ItemRarity = "common" | "rare" | "epic";
export type ItemTrade = "tradeable" | "untradeable";

export interface Item {
  uid: string;
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  trade: ItemTrade;
  icon: string;
  atk: number;
  def: number;
  hpBonus: number;
  requiredLevel: number;
  requiredClass: JobClass[];
}
