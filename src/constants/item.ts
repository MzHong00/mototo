import type { ItemType, ItemRarity } from "@/types/item";

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
