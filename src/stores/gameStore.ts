import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { respawnTrigger, pushPlayerDamage } from "@/stores/worldRefs";
import { EXP_PER_LEVEL, CLASS_CONFIG } from "@/constants/character";
import { MAPS } from "@/constants/maps";
import {
  SKILL_LEVEL_MAX,
  PASSIVE_LEVEL_MAX,
  SKILL_UPGRADE_CATEGORY,
  COOLDOWN_MULT,
  PASSIVE_CONFIG,
  PASSIVE_STATS,
} from "@/constants/growth";

import type { JobClass, CharacterStats, EquipSlots, SkillState } from "@/types/character";
import type { Item } from "@/types/item";
import type { SkillFX, SkillFXType } from "@/types/combat";
import type { MapId } from "@/types/map";
import type { PassiveStat } from "@/constants/growth";

export type { JobClass, Item, SkillFX, SkillState, EquipSlots };

let fxCounter = 0;

const TOTAL_SLOTS = 17;

export interface GameState {
  character: CharacterStats;
  allSkills: SkillState[];
  skills: (SkillState | null)[];
  inventory: Item[];
  equipped: EquipSlots;
  gold: number;
  isShielded: boolean;
  shieldEndTime: number;
  isDead: boolean;

  shopOpen: boolean;
  bossEntryId: string | null;
  fxList: SkillFX[];
  skillPoints: number;
  passiveUpgrades: Record<PassiveStat, number>;
  clearedBosses: string[];
  currentMapId: MapId;
  previousFieldMapId: MapId;

  totalAtk: () => number;
  totalDef: () => number;

  selectClass: (cls: JobClass, name?: string) => void;
  assignSkill: (slotIdx: number, skill: SkillState) => void;
  swapSkillSlots: (a: number, b: number) => void;
  removeSkillFromSlot: (slotIdx: number) => void;
  takeDamage: (amount: number) => void;
  gainExp: (amount: number) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  healHp: (amount: number) => void;
  useSkill: (id: string) => boolean;
  activateShield: () => void;
  tickShield: () => void;
  respawn: () => void;
  addItem: (item: Item) => void;
  equipItem: (item: Item) => void;
  unequipItem: (slot: keyof EquipSlots) => void;
  setShopOpen: (v: boolean) => void;
  setBossEntryId: (bossId: string | null) => void;
  addFX: (type: SkillFXType, pos: [number, number, number], dir?: [number, number, number]) => void;
  addFXBatch: (
    items: Array<{
      type: SkillFXType;
      pos: [number, number, number];
      dir?: [number, number, number];
    }>,
  ) => void;
  removeFX: (fxId: number) => void;

  setBossCleared: (bossId: string) => void;
  travelTo: (mapId: MapId) => void;
  exitBoss: () => void;
  upgradeSkill: (skillId: string) => void;
  upgradePassive: (stat: PassiveStat) => void;
}

const INVENTORY_MAX = 16;
const LEVEL_HP_BONUS = 20;
const LEVEL_ATK_BONUS = 3;
const SHIELD_DURATION_MS = 4000;

const gameStore = create<GameState>((set, get) => ({
  character: {
    name: "플레이어",
    jobClass: null,
    level: 1,
    hp: 100,
    maxHp: 100,
    exp: 0,
    expToNext: EXP_PER_LEVEL(1),
    baseAtk: 15,
    baseDef: 0,
  },
  allSkills: [],
  skills: Array<null>(TOTAL_SLOTS).fill(null),
  inventory: [],
  equipped: { weapon: null, armor: null, ring: null },
  gold: 0,
  isShielded: false,
  shieldEndTime: 0,
  isDead: false,

  shopOpen: false,
  bossEntryId: null,
  fxList: [],
  skillPoints: 0,
  passiveUpgrades: Object.fromEntries(PASSIVE_STATS.map((k) => [k, 0])) as Record<
    PassiveStat,
    number
  >,
  clearedBosses: [],
  currentMapId: "evergreenVillage" as MapId,
  previousFieldMapId: "evergreenMeadow" as MapId,

  totalAtk: () => {
    const { character, equipped, passiveUpgrades } = get();
    const base =
      character.baseAtk +
      character.level * 2 +
      (equipped.weapon?.atk ?? 0) +
      passiveUpgrades.atk * PASSIVE_CONFIG.atk.bonusPerLevel;
    return Math.floor(base);
  },
  totalDef: () => {
    const { character, equipped, passiveUpgrades } = get();
    return (
      character.baseDef +
      (equipped.armor?.def ?? 0) +
      (equipped.ring?.def ?? 0) +
      passiveUpgrades.def * PASSIVE_CONFIG.def.bonusPerLevel
    );
  },

  selectClass: (cls, name) => {
    const cfg = CLASS_CONFIG[cls];
    const lv = get().character.level;
    const learned = cfg.skills.filter((sk) => (sk.requiredLevel ?? 1) <= lv);
    set((s) => ({
      character: {
        ...s.character,
        jobClass: cls,
        name: name ?? s.character.name,
        hp: cfg.hp,
        maxHp: cfg.hp,
        baseAtk: cfg.atk,
        baseDef: cfg.def,
      },
      allSkills: learned,
      skills: Array<null>(TOTAL_SLOTS).fill(null),
    }));
  },

  assignSkill: (slotIdx, skill) =>
    set((s) => {
      const skills = [...s.skills];
      skills[slotIdx] = { ...skill, lastUsed: 0 };
      return { skills };
    }),

  swapSkillSlots: (a, b) =>
    set((s) => {
      const skills = [...s.skills];
      [skills[a], skills[b]] = [skills[b], skills[a]];
      return { skills };
    }),

  removeSkillFromSlot: (slotIdx) =>
    set((s) => {
      const skills = [...s.skills];
      skills[slotIdx] = null;
      return { skills };
    }),

  takeDamage: (amount) =>
    set((s) => {
      if (s.isShielded || s.isDead) return {};
      const actual = Math.max(1, amount - get().totalDef());
      pushPlayerDamage(actual);
      const newHp = Math.max(0, s.character.hp - actual);
      return { character: { ...s.character, hp: newHp }, isDead: newHp <= 0 };
    }),

  gainExp: (amount) =>
    set((s) => {
      const { character } = s;
      const newExp = character.exp + amount;
      const needed = EXP_PER_LEVEL(character.level);
      if (newExp >= needed) {
        const lv = character.level + 1;
        const mhp = character.maxHp + LEVEL_HP_BONUS;

        // 새 레벨에서 해금되는 스킬 자동 추가
        const newlyLearned = character.jobClass
          ? CLASS_CONFIG[character.jobClass].skills.filter(
              (sk) => (sk.requiredLevel ?? 1) === lv && !s.allSkills.some((as) => as.id === sk.id),
            )
          : [];

        return {
          skillPoints: s.skillPoints + 1,
          character: {
            ...character,
            level: lv,
            exp: newExp - needed,
            expToNext: EXP_PER_LEVEL(lv),
            maxHp: mhp,
            hp: mhp,
            baseAtk: character.baseAtk + LEVEL_ATK_BONUS,
          },
          allSkills: [...s.allSkills, ...newlyLearned],
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
    set((s) => ({
      character: { ...s.character, hp: Math.min(s.character.maxHp, s.character.hp + n) },
    })),

  useSkill: (id) => {
    const { skills } = get();
    const skill = skills.find((s): s is SkillState => s?.id === id);
    if (!skill) return false;
    if ((Date.now() - skill.lastUsed) / 1000 < skill.cooldown) return false;
    set((s) => ({
      skills: s.skills.map((sk) => (sk?.id === id ? { ...sk, lastUsed: Date.now() } : sk)),
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
    set({ isDead: false, character: { ...character, hp: character.maxHp } });
  },

  addItem: (item) =>
    set((s) => ({
      inventory: s.inventory.length < INVENTORY_MAX ? [...s.inventory, item] : s.inventory,
    })),

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
  setBossEntryId: (bossId) => set({ bossEntryId: bossId }),

  addFX: (type, pos, dir = [0, 0, -1]) =>
    set((s) => ({
      fxList: [...s.fxList, { fxId: fxCounter++, type, pos, dir, startTime: Date.now() }],
    })),
  addFXBatch: (items) =>
    set((s) => ({
      fxList: [
        ...s.fxList,
        ...items.map((it) => ({
          fxId: fxCounter++,
          type: it.type,
          pos: it.pos,
          dir: it.dir ?? ([0, 0, -1] as [number, number, number]),
          startTime: Date.now(),
        })),
      ],
    })),
  removeFX: (id) => set((s) => ({ fxList: s.fxList.filter((f) => f.fxId !== id) })),

  setBossCleared: (bossId) => set((s) => ({ clearedBosses: [...s.clearedBosses, bossId] })),

  upgradeSkill: (skillId) =>
    set((s) => {
      if (s.skillPoints < 1) return {};
      const current = s.allSkills.find((sk) => sk.id === skillId);
      if (!current || current.level >= SKILL_LEVEL_MAX) return {};

      const nextLevel = current.level + 1;
      const baseCooldown = s.character.jobClass
        ? (CLASS_CONFIG[s.character.jobClass].skills.find((sk) => sk.id === skillId)?.cooldown ??
          current.cooldown)
        : current.cooldown;
      const newCooldown =
        SKILL_UPGRADE_CATEGORY[skillId] === "cooldown"
          ? parseFloat((baseCooldown * COOLDOWN_MULT(nextLevel)).toFixed(2))
          : current.cooldown;

      const apply = (sk: SkillState | null): SkillState | null => {
        if (!sk || sk.id !== skillId) return sk;
        return { ...sk, level: nextLevel, cooldown: newCooldown };
      };
      return {
        skillPoints: s.skillPoints - 1,
        allSkills: s.allSkills.map((sk) =>
          sk.id === skillId ? { ...sk, level: nextLevel, cooldown: newCooldown } : sk,
        ),
        skills: s.skills.map(apply),
      };
    }),

  upgradePassive: (stat) =>
    set((s) => {
      if (s.skillPoints < 1) return {};
      if (s.passiveUpgrades[stat] >= PASSIVE_LEVEL_MAX) return {};
      const bonus = PASSIVE_CONFIG[stat].bonusPerLevel;
      const passiveUpgrades = { ...s.passiveUpgrades, [stat]: s.passiveUpgrades[stat] + 1 };
      let { character } = s;
      if (stat === "hp") {
        character = { ...character, maxHp: character.maxHp + bonus, hp: character.hp + bonus };
      }
      return { skillPoints: s.skillPoints - 1, passiveUpgrades, character };
    }),

  travelTo: (mapId) =>
    set((s) =>
      MAPS[mapId].type === "boss"
        ? { currentMapId: mapId, previousFieldMapId: s.currentMapId }
        : { currentMapId: mapId },
    ),

  exitBoss: () => set((s) => ({ currentMapId: s.previousFieldMapId })),
}));

export const useGameStore = <T>(selector: (s: GameState) => T) => gameStore(useShallow(selector));

export const getGameState = () => gameStore.getState();
export const setGameState = gameStore.setState.bind(gameStore);
