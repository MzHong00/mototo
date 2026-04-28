import type { JobClass } from "@/types/job";

export type ItemType = "weapon" | "armor" | "ring";
export type ItemRarity = "common" | "rare" | "epic";

export interface Item {
  uid: string;
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  icon: string;
  atk: number;
  def: number;
  hpBonus: number;
  requiredLevel: number;
  requiredClass: JobClass[];
}
