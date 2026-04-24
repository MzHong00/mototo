import type { Item } from "@/types/item";

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
    id: "iron_sword",
    name: "철제 검",
    icon: "⚔️",
    price: 150,
    desc: "ATK +12",
    grantItem: {
      id: "iron_sword",
      name: "철제 검",
      type: "weapon",
      icon: "⚔️",
      atk: 12,
      def: 0,
      hpBonus: 0,
    },
  },
  {
    id: "iron_armor",
    name: "철제 갑옷",
    icon: "🛡️",
    price: 120,
    desc: "DEF +7",
    grantItem: {
      id: "iron_armor",
      name: "철제 갑옷",
      type: "armor",
      icon: "🛡️",
      atk: 0,
      def: 7,
      hpBonus: 0,
    },
  },
  {
    id: "life_ring",
    name: "생명의 반지",
    icon: "💍",
    price: 100,
    desc: "MaxHP +40",
    grantItem: {
      id: "life_ring",
      name: "생명의 반지",
      type: "ring",
      icon: "💍",
      atk: 0,
      def: 0,
      hpBonus: 40,
    },
  },
  {
    id: "enhance_rune",
    name: "강화의 룬",
    icon: "✨",
    price: 200,
    desc: "baseATK +5 (영구)",
    enhanceAtk: 5,
  },
];
