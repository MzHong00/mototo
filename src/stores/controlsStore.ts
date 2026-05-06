import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { persist } from "zustand/middleware";

export const DEFAULT_BINDINGS = {
  moveUp: "ArrowUp",
  moveDown: "ArrowDown",
  moveLeft: "ArrowLeft",
  moveRight: "ArrowRight",
  interact: "Space",
  inventory: "KeyI",
  equipment: "KeyU",
  skillWindow: "KeyK",
  skill1: "Digit1",
  skill2: "Digit2",
  skill3: "Digit3",
  skill4: "Digit4",
  skill5: "Digit5",
} as const satisfies Record<string, string>;

export type ActionKey = keyof typeof DEFAULT_BINDINGS;
export type Bindings = Record<ActionKey, string>;

export interface ControlsState {
  bindings: Bindings;
  swap: (a: ActionKey, b: ActionKey) => void;
  reset: () => void;
}

const controlsStore = create<ControlsState>()(
  persist(
    (set) => ({
      bindings: { ...DEFAULT_BINDINGS },
      swap: (a, b) =>
        set((s) => ({
          bindings: { ...s.bindings, [a]: s.bindings[b], [b]: s.bindings[a] },
        })),
      reset: () => set({ bindings: { ...DEFAULT_BINDINGS } }),
    }),
    { name: "mototo-controls" },
  ),
);

export const useControlsStore = <T>(selector: (s: ControlsState) => T) =>
  controlsStore(useShallow(selector));

export const getControlsState = () => controlsStore.getState();
