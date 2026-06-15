import type { Class } from "@/types/class";

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
  requiredClass: Class[];
}

export interface DropEntry {
  chance: number;
  item: Omit<Item, "uid">;
}
