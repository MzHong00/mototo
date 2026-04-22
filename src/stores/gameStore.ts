import { create } from "zustand";
import { respawnTrigger } from "@/stores/worldRefs";

export type JobClass = "warrior" | "archer" | "mage" | "rogue";

export interface Item {
  uid: string;
  id: string;
  name: string;
  type: "weapon" | "armor" | "ring";
  icon: string;
  atk: number;
  def: number;
  hpBonus: number;
}

export interface EquipSlots {
  weapon: Item | null;
  armor: Item | null;
  ring: Item | null;
}

export interface SkillState {
  id: string;
  key: string;
  label: string;
  mpCost: number;
  cooldown: number;
  lastUsed: number;
}

export interface SkillFX {
  fxId: number;
  type:
    | "slash"
    | "blast"
    | "arrow"
    | "arrow_blast"
    | "fireball"
    | "meteor"
    | "shuriken"
    | "shuriken_blast";
  pos: [number, number, number];
  dir: [number, number, number];
  startTime: number;
}

interface CharacterStats {
  name: string;
  jobClass: JobClass | null;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  exp: number;
  expToNext: number;
  baseAtk: number;
  baseDef: number;
}

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
  addFX: (
    type: SkillFX["type"],
    pos: [number, number, number],
    dir?: [number, number, number],
  ) => void;
  removeFX: (fxId: number) => void;
  clearLevelUp: () => void;
}

const EXP_PER_LEVEL = (lv: number) => lv * 100;
let fxCounter = 0;

// 직업별 초기 스탯 + 스킬
const CLASS_CONFIG: Record<
  JobClass,
  {
    hp: number;
    mp: number;
    atk: number;
    def: number;
    skills: SkillState[];
  }
> = {
  warrior: {
    hp: 150,
    mp: 30,
    atk: 20,
    def: 5,
    skills: [
      {
        id: "slash",
        key: "1",
        label: "베기",
        mpCost: 0,
        cooldown: 0.5,
        lastUsed: 0,
      },
      {
        id: "shield",
        key: "2",
        label: "방패막기",
        mpCost: 8,
        cooldown: 8,
        lastUsed: 0,
      },
      {
        id: "heal",
        key: "3",
        label: "투지",
        mpCost: 10,
        cooldown: 10,
        lastUsed: 0,
      },
      {
        id: "blast",
        key: "4",
        label: "회오리",
        mpCost: 20,
        cooldown: 18,
        lastUsed: 0,
      },
    ],
  },
  archer: {
    hp: 100,
    mp: 60,
    atk: 22,
    def: 2,
    skills: [
      {
        id: "slash",
        key: "1",
        label: "연사",
        mpCost: 0,
        cooldown: 0.4,
        lastUsed: 0,
      },
      {
        id: "shield",
        key: "2",
        label: "회피",
        mpCost: 12,
        cooldown: 10,
        lastUsed: 0,
      },
      {
        id: "heal",
        key: "3",
        label: "치료약",
        mpCost: 15,
        cooldown: 12,
        lastUsed: 0,
      },
      {
        id: "blast",
        key: "4",
        label: "폭발화살",
        mpCost: 25,
        cooldown: 20,
        lastUsed: 0,
      },
    ],
  },
  mage: {
    hp: 80,
    mp: 120,
    atk: 30,
    def: 0,
    skills: [
      {
        id: "slash",
        key: "1",
        label: "화염볼",
        mpCost: 5,
        cooldown: 0.6,
        lastUsed: 0,
      },
      {
        id: "shield",
        key: "2",
        label: "냉기장벽",
        mpCost: 15,
        cooldown: 12,
        lastUsed: 0,
      },
      {
        id: "heal",
        key: "3",
        label: "마나흡수",
        mpCost: 0,
        cooldown: 15,
        lastUsed: 0,
      },
      {
        id: "blast",
        key: "4",
        label: "메테오",
        mpCost: 40,
        cooldown: 25,
        lastUsed: 0,
      },
    ],
  },
  rogue: {
    hp: 90,
    mp: 80,
    atk: 26,
    def: 1,
    skills: [
      {
        id: "slash",
        key: "1",
        label: "표창",
        mpCost: 0,
        cooldown: 0.3,
        lastUsed: 0,
      },
      {
        id: "shield",
        key: "2",
        label: "은신",
        mpCost: 12,
        cooldown: 10,
        lastUsed: 0,
      },
      {
        id: "heal",
        key: "3",
        label: "회복약",
        mpCost: 0,
        cooldown: 18,
        lastUsed: 0,
      },
      {
        id: "blast",
        key: "4",
        label: "폭탄",
        mpCost: 30,
        cooldown: 15,
        lastUsed: 0,
      },
    ],
  },
};

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
    return (
      character.baseAtk + character.level * 2 + (equipped.weapon?.atk ?? 0)
    );
  },
  totalDef: () => {
    const { character, equipped } = get();
    return (
      character.baseDef + (equipped.armor?.def ?? 0) + (equipped.ring?.def ?? 0)
    );
  },

  selectClass: (cls) => {
    const cfg = CLASS_CONFIG[cls];
    set((state) => ({
      character: {
        ...state.character,
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
    set((state) => {
      if (state.isShielded || state.isDead) return {};
      const actual = Math.max(1, amount - get().totalDef());
      const newHp = Math.max(0, state.character.hp - actual);
      return {
        character: { ...state.character, hp: newHp },
        isDead: newHp <= 0,
      };
    }),

  gainExp: (amount) =>
    set((state) => {
      const { character } = state;
      const newExp = character.exp + amount;
      const needed = EXP_PER_LEVEL(character.level);
      if (newExp >= needed) {
        const lv = character.level + 1;
        const mhp = character.maxHp + 20;
        const mmp = character.maxMp + 10;
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
            baseAtk: character.baseAtk + 3,
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
    set((s) => ({
      character: {
        ...s.character,
        hp: Math.min(s.character.maxHp, s.character.hp + n),
      },
    })),
  healMp: (n) =>
    set((s) => ({
      character: {
        ...s.character,
        mp: Math.min(s.character.maxMp, s.character.mp + n),
      },
    })),

  useSkill: (id) => {
    const { skills, character } = get();
    const skill = skills.find((s) => s.id === id);
    if (!skill) return false;
    if ((Date.now() - skill.lastUsed) / 1000 < skill.cooldown) return false;
    if (character.mp < skill.mpCost) return false;
    set((state) => ({
      character: { ...state.character, mp: state.character.mp - skill.mpCost },
      skills: state.skills.map((s) =>
        s.id === id ? { ...s, lastUsed: Date.now() } : s,
      ),
    }));
    return true;
  },

  activateShield: () =>
    set({ isShielded: true, shieldEndTime: Date.now() + 4000 }),
  tickShield: () => {
    if (get().isShielded && Date.now() > get().shieldEndTime)
      set({ isShielded: false });
  },

  respawn: () => {
    const { character } = get();
    respawnTrigger.pending = true;
    set({
      isDead: false,
      character: { ...character, hp: character.maxHp, mp: character.maxMp },
    });
  },

  addItem: (item) =>
    set((s) => ({
      inventory: s.inventory.length < 16 ? [...s.inventory, item] : s.inventory,
    })),

  equipItem: (item) =>
    set((state) => {
      const slot = item.type as keyof EquipSlots;
      const prev = state.equipped[slot];
      const hpDelta = (item.hpBonus ?? 0) - (prev?.hpBonus ?? 0);
      return {
        equipped: { ...state.equipped, [slot]: item },
        inventory: state.inventory
          .filter((i) => i.uid !== item.uid)
          .concat(prev ? [prev] : []),
        character: {
          ...state.character,
          maxHp: state.character.maxHp + hpDelta,
          hp: Math.min(
            state.character.hp + hpDelta,
            state.character.maxHp + hpDelta,
          ),
        },
      };
    }),

  unequipItem: (slot) =>
    set((state) => {
      const item = state.equipped[slot];
      if (!item) return {};
      const hpDelta = -(item.hpBonus ?? 0);
      return {
        equipped: { ...state.equipped, [slot]: null },
        inventory: [...state.inventory, item],
        character: {
          ...state.character,
          maxHp: Math.max(10, state.character.maxHp + hpDelta),
          hp: Math.min(state.character.hp, state.character.maxHp + hpDelta),
        },
      };
    }),

  setShopOpen: (v) => set({ shopOpen: v }),
  addFX: (type, pos, dir = [0, 0, -1]) =>
    set((s) => ({
      fxList: [
        ...s.fxList,
        { fxId: fxCounter++, type, pos, dir, startTime: Date.now() },
      ],
    })),
  removeFX: (id) =>
    set((s) => ({ fxList: s.fxList.filter((f) => f.fxId !== id) })),
  clearLevelUp: () => set({ levelUpPending: false }),
}));
