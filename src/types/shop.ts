import type { Item } from "@/types/item";

export interface ShopItemDef {
  id: string;
  name: string;
  icon: string;
  price: number;
  desc: string;
  healHp?: number;
  enhanceAtk?: number;
  grantItem?: Omit<Item, "uid">;
}
