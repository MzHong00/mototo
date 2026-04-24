import { useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";

const MP_REGEN_AMOUNT = 2;
const MP_REGEN_INTERVAL_MS = 1000;

export function useMpRegen() {
  const healMp = useGameStore((s) => s.healMp);

  useEffect(() => {
    const iv = setInterval(() => healMp(MP_REGEN_AMOUNT), MP_REGEN_INTERVAL_MS);
    return () => clearInterval(iv);
  }, [healMp]);
}
