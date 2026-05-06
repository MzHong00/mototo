import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

export interface ModalConfig {
  title: string;
  subtitle?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface ModalState {
  modal: ModalConfig | null;
  open: (config: ModalConfig) => void;
  close: () => void;
}

const modalStore = create<ModalState>()((set) => ({
  modal: null,
  open: (config) => set({ modal: config }),
  close: () => set({ modal: null }),
}));

export const useModalStore = <T>(selector: (s: ModalState) => T) =>
  modalStore(useShallow(selector));
