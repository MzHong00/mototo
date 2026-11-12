import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

export type Screen = "create" | "game";

export interface UiState {
  isEditing: boolean; // 게임 중 꾸미기 화면 열림 여부
  /** 꾸미기 화면 열기/닫기 */
  setEditing: (isEditing: boolean) => void;
}

const uiStore = create<UiState>((set) => ({
  isEditing: false,
  setEditing: (isEditing) => set({ isEditing }),
}));

export const useUiStore = <T>(selector: (s: UiState) => T) => uiStore(useShallow(selector));
