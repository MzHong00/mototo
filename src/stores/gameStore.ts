import { create } from "zustand";
import { respawnTrigger } from "@/stores/worldRefs";
import type { JobClass, CharacterStats, EquipSlots, SkillState } from "@/types/character";
import type { Item } from "@/types/item";
import type { SkillFX, SkillFXType } from "@/types/combat";
import { EXP_PER_LEVEL, CLASS_CONFIG } from "@/constants/character";

export type { JobClass, Item, SkillFX, SkillState, EquipSlots };

let fxCounter = 0;

interface GameState {
  character: CharacterStats;
  skills: SkillState[];
  inventory: Item[];
  equipped: EquipSlots;
  gold: number;
  isShielded: boolean;
  shieldEndTime: number;
  isDead: boolean;
  levelUpPending: boolean;
  shopOpen: boolean;
  fxList: SkillFX[];

  totalAtk: () => number;
  totalDef: () => number;

  selectClass: (cls: JobClass) => void;
  takeDamage: (amount: number) => void;
  gainExp: (amount: number) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  healHp: (amount: number) => void;
  healMp: (amount: number) => void;
  useSkill: (id: string) => boolean;
  activateShield: () => void;
  tickShield: () => void;
  respawn: () => void;
  addItem: (item: Item) => void;
  equipItem: (item: Item) => void;
  unequipItem: (slot: keyof EquipSlots) => void;
  setShopOpen: (v: boolean) => void;
  addFX: (type: SkillFXType, pos: [number, number, number], dir?: [number, number, number]) => void;
  removeFX: (fxId: number) => void;
  clearLevelUp: () => void;
}

const INVENTORY_MAX = 16;
const LEVEL_HP_BONUS = 20;
const LEVEL_MP_BONUS = 10;
const LEVEL_ATK_BONUS = 3;
const SHIELD_DURATION_MS = 4000;

export const useGameStore = create<GameState>((set, get) => ({
  character: {
    name: "플레이어",
    jobClass: null,
    level: 1,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    exp: 0,
    expToNext: EXP_PER_LEVEL(1),
    baseAtk: 15,
    baseDef: 0,
  },
  skills: CLASS_CONFIG.warrior.skills,
  inventory: [],
  equipped: { weapon: null, armor: null, ring: null },
  gold: 0,
  isShielded: false,
  shieldEndTime: 0,
  isDead: false,
  levelUpPending: false,
  shopOpen: false,
  fxList: [],

  totalAtk: () => {
    const { character, equipped } = get();
    return character.baseAtk + character.level * 2 + (equipped.weapon?.atk ?? 0);
  },
  totalDef: () => {
    const { character, equipped } = get();
    return character.baseDef + (equipped.armor?.def ?? 0) + (equipped.ring?.def ?? 0);
  },

  selectClass: (cls) => {
    const cfg = CLASS_CONFIG[cls];
    set((s) => ({
      character: {
        ...s.character,
        jobClass: cls,
        hp: cfg.hp,
        maxHp: cfg.hp,
        mp: cfg.mp,
        maxMp: cfg.mp,
        baseAtk: cfg.atk,
        baseDef: cfg.def,
      },
      skills: cfg.skills,
    }));
  },

  takeDamage: (amount) =>
    set((s) => {
      if (s.isShielded || s.isDead) return {};
      const actual = Math.max(1, amount - get().totalDef());
      const newHp = Math.max(0, s.character.hp - actual);
      return { character: { ...s.character, hp: newHp }, isDead: newHp <= 0 };
    }),

  gainExp: (amount) =>
    set((s) => {
      const { character } = s;
      const newExp = character.exp + amount;
      const needed = EXP_PER_LEVEL(character.level);
      if (newExp >= needed) {
        const lv  = character.level + 1;
        const mhp = character.maxHp + LEVEL_HP_BONUS;
        const mmp = character.maxMp + LEVEL_MP_BONUS;
        return {
          levelUpPending: true,
          character: {
            ...character,
            level: lv,
            exp: newExp - needed,
            expToNext: EXP_PER_LEVEL(lv),
            maxHp: mhp,
            hp: mhp,
            maxMp: mmp,
            mp: mmp,
            baseAtk: character.baseAtk + LEVEL_ATK_BONUS,
          },
        };
      }
      return { character: { ...character, exp: newExp } };
    }),

  addGold: (n) => set((s) => ({ gold: s.gold + n })),
  spendGold: (n) => {
    if (get().gold < n) return false;
    set((s) => ({ gold: s.gold - n }));
    return true;
  },

  healHp: (n) =>
    set((s) => ({ character: { ...s.character, hp: Math.min(s.character.maxHp, s.character.hp + n) } })),
  healMp: (n) =>
    set((s) => ({ character: { ...s.character, mp: Math.min(s.character.maxMp, s.character.mp + n) } })),

  useSkill: (id) => {
    const { skills, character } = get();
    const skill = skills.find((s) => s.id === id);
    if (!skill) return false;
    if ((Date.now() - skill.lastUsed) / 1000 < skill.cooldown) return false;
    if (character.mp < skill.mpCost) return false;
    set((s) => ({
      character: { ...s.character, mp: s.character.mp - skill.mpCost },
      skills: s.skills.map((sk) => sk.id === id ? { ...sk, lastUsed: Date.now() } : sk),
    }));
    return true;
  },

  activateShield: () => set({ isShielded: true, shieldEndTime: Date.now() + SHIELD_DURATION_MS }),
  tickShield: () => {
    if (get().isShielded && Date.now() > get().shieldEndTime) set({ isShielded: false });
  },

  respawn: () => {
    const { character } = get();
    respawnTrigger.pending = true;
    set({ isDead: false, character: { ...character, hp: character.maxHp, mp: character.maxMp } });
  },

  addItem: (item) =>
    set((s) => ({ inventory: s.inventory.length < INVENTORY_MAX ? [...s.inventory, item] : s.inventory })),

  equipItem: (item) =>
    set((s) => {
      const slot = item.type as keyof EquipSlots;
      const prev = s.equipped[slot];
      const hpDelta = (item.hpBonus ?? 0) - (prev?.hpBonus ?? 0);
      return {
        equipped: { ...s.equipped, [slot]: item },
        inventory: s.inventory.filter((i) => i.uid !== item.uid).concat(prev ? [prev] : []),
        character: {
          ...s.character,
          maxHp: s.character.maxHp + hpDelta,
          hp: Math.min(s.character.hp + hpDelta, s.character.maxHp + hpDelta),
        },
      };
    }),

  unequipItem: (slot) =>
    set((s) => {
      const item = s.equipped[slot];
      if (!item) return {};
      const hpDelta = -(item.hpBonus ?? 0);
      return {
        equipped: { ...s.equipped, [slot]: null },
        inventory: [...s.inventory, item],
        character: {
          ...s.character,
          maxHp: Math.max(10, s.character.maxHp + hpDelta),
          hp: Math.min(s.character.hp, s.character.maxHp + hpDelta),
        },
      };
    }),

  setShopOpen: (v) => set({ shopOpen: v }),

  addFX: (type, pos, dir = [0, 0, -1]) =>
    set((s) => ({ fxList: [...s.fxList, { fxId: fxCounter++, type, pos, dir, startTime: Date.now() }] })),
  removeFX: (id) =>
    set((s) => ({ fxList: s.fxList.filter((f) => f.fxId !== id) })),
  clearLevelUp: () => set({ levelUpPending: false }),
}));
