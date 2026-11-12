import { useEffect } from "react";

import { playerAnimSignals } from "@/engine/runtime/frameState";
import { KEY_BINDINGS } from "@/constants/ui/controls";
import { ATTACK_LOCK_MS } from "@/constants/game/movement";

const ATTACK_CODES: readonly string[] = KEY_BINDINGS.attack;

/** 공격 키 → 공격 모션 신호 (판정은 전투 시스템 도입 시 추가) */
export function useAttackInput() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const now = Date.now();
      if (e.repeat || !ATTACK_CODES.includes(e.code) || now < playerAnimSignals.attackUntil) return;
      playerAnimSignals.attackUntil = now + ATTACK_LOCK_MS;
      playerAnimSignals.attackCount++;
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
