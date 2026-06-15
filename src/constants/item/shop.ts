import type { ShopItemDef } from "@/types/shop";
import { ITEMS } from "@/constants/item/items";
import { ITEM_TYPE } from "@/constants/item/item";

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
