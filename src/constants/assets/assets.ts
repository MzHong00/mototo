import type { Class, WeaponConfig } from "@/types/class";

export const CHARACTER_MODELS: Record<Class, string> = {
  warrior: "/models/characters/warrior/model.glb",
  archer: "/models/characters/archer/model.glb",
  mage: "/models/characters/mage/model.glb",
  rogue: "/models/characters/rogue/model.glb",
};

export const CHARACTER_ANIMATIONS = {
  general: "/models/characters/shared/animations/general.glb",
  movement: "/models/characters/shared/animations/movement.glb",
  warriorAttack: "/models/characters/warrior/animations/slash.glb",
} as const;

export const TREE_MODELS: Record<string, string> = {
  pine: "",
  oak: "",
  dead: "",
};

export const WEAPON_MODELS: Record<Class, WeaponConfig> = {
  warrior: {
    mainHand: "/models/weapons/warrior/sword_1handed.glb",
    offHand: "/models/weapons/warrior/shield_round.glb",
  },
  archer: { mainHand: "/models/weapons/archer/bow_withString.glb" },
  mage: { mainHand: "/models/weapons/mage/staff.glb" },
  rogue: { mainHand: "/models/weapons/rogue/dagger.glb" },
};
