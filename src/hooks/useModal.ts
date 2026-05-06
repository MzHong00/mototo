import { useShallow } from "zustand/react/shallow";
import { useModalStore } from "@/stores/modalStore";

export function useModal() {
  return useModalStore(useShallow((s) => ({ modal: s.modal, open: s.open, close: s.close })));
}
