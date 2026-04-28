import type { Item } from "@/types/item";
import { ITEMS } from "@/constants/items";
import { ITEM_TYPE } from "@/constants/item";

export interface ShopItemDef {
  id: string;
  name: string;
  icon: string;
  price: number;
  desc: string;
  healHp?: number;
  healMp?: number;
  enhanceAtk?: number;
  grantItem?: Omit<Item, "uid">;
}

export const SHOP_CATALOG: ShopItemDef[] = [
  {
    id: "hp_potion",
    name: "HP 포션",
    icon: "🧪",
    price: 50,
    desc: "HP를 80 회복합니다",
    healHp: 80,
  },
  {
    id: "mp_potion",
    name: "MP 포션",
    icon: "💧",
    price: 30,
    desc: "MP를 50 회복합니다",
    healMp: 50,
  },
  {
    id: "enhance_rune",
    name: "강화의 룬",
    icon: "✨",
    price: 200,
    desc: "baseATK +5 (영구)",
    enhanceAtk: 5,
  },
  {
    ...ITEMS[ITEM_TYPE.WEAPON].iron_sword,
    price: 150,
    desc: "ATK +12",
    grantItem: ITEMS[ITEM_TYPE.WEAPON].iron_sword,
  },
  {
    ...ITEMS[ITEM_TYPE.ARMOR].iron_armor,
    price: 120,
    desc: "DEF +7",
    grantItem: ITEMS[ITEM_TYPE.ARMOR].iron_armor,
  },
  {
    ...ITEMS[ITEM_TYPE.RING].life_ring,
    price: 100,
    desc: "MaxHP +40",
    grantItem: ITEMS[ITEM_TYPE.RING].life_ring,
  },
];
