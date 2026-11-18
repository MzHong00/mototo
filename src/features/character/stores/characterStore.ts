import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { persist } from "zustand/middleware";

import { CHARACTER_STORAGE_KEY } from "@/features/character/constants/rules";

import type { SavedCharacter } from "@/types/character";

export interface CharacterState {
  character: SavedCharacter | null; // 내 캐릭터 (없으면 생성 화면)
  /** 캐릭터 저장 (생성·외형 수정 공용) */
  saveCharacter: (character: SavedCharacter) => void;
}

const characterStore = create<CharacterState>()(
  persist(
    (set) => ({
      character: null,
      saveCharacter: (character) => set({ character }),
    }),
    { name: CHARACTER_STORAGE_KEY },
  ),
);

export const useCharacterStore = <T>(selector: (s: CharacterState) => T) =>
  characterStore(useShallow(selector));
