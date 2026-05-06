import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

export type ToastType = "info" | "success" | "warning" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export interface ToastState {
  toasts: Toast[];
  push: (message: string, type?: ToastType) => void;
  remove: (id: number) => void;
}

let _id = 0;

const toastStore = create<ToastState>()((set) => ({
  toasts: [],
  push: (message, type = "info") =>
    set((s) => ({ toasts: [...s.toasts, { id: _id++, message, type }] })),
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const useToastStore = <T>(selector: (s: ToastState) => T) =>
  toastStore(useShallow(selector));
