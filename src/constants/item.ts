import type { ItemType, ItemRarity, ItemTrade } from "@/types/item";

export const ITEM_TYPE = {
  WEAPON: "weapon",
  ARMOR: "armor",
  RING: "ring",
} as const satisfies Record<string, ItemType>;

export const ITEM_TYPE_LABEL: Record<ItemType, string> = {
  [ITEM_TYPE.WEAPON]: "무기",
  [ITEM_TYPE.ARMOR]: "방어구",
  [ITEM_TYPE.RING]: "반지",
};

export const ITEM_RARITY = {
  COMMON: "common",
  RARE: "rare",
  EPIC: "epic",
} as const satisfies Record<string, ItemRarity>;

export const ITEM_RARITY_LABEL: Record<ItemRarity, string> = {
  [ITEM_RARITY.COMMON]: "일반",
  [ITEM_RARITY.RARE]: "희귀",
  [ITEM_RARITY.EPIC]: "영웅",
};

export const ITEM_TRADE = {
  TRADEABLE: "tradeable",
  UNTRADEABLE: "untradeable",
} as const satisfies Record<string, ItemTrade>;

export const ITEM_TRADE_LABEL: Record<ItemTrade, string> = {
  [ITEM_TRADE.TRADEABLE]: "교환 가능",
  [ITEM_TRADE.UNTRADEABLE]: "교환 불가",
};
