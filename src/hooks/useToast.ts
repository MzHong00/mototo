import { useShallow } from "zustand/react/shallow";
import { useToastStore } from "@/stores/toastStore";

export function useToast() {
  return useToastStore(useShallow((s) => ({ toasts: s.toasts, push: s.push, remove: s.remove })));
}
