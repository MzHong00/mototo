import { useEffect } from "react";

import { playerAnimSignals, playerInput } from "@/engine/runtime/frameState";
import { KEY_BINDINGS } from "@/constants/ui/controls";
import { ATTACK_LOCK_MS } from "@/constants/game/movement";

const ATTACK_CODES: readonly string[] = KEY_BINDINGS.attack;
const JUMP_CODES: readonly string[] = KEY_BINDINGS.jump;

/**
 * 한 번 누르면 한 번만 일어나는 동작(점프·공격)의 키 입력.
 * 꾹 누르고 있어도 반복되지 않는다 (e.repeat 무시).
 */
export function useActionInput() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (JUMP_CODES.includes(e.code)) {
        e.preventDefault(); // 스페이스로 페이지 스크롤·버튼 클릭 방지
        playerInput.isJumpQueued = true;
        return;
      }
      const now = Date.now();
      if (!ATTACK_CODES.includes(e.code) || now < playerAnimSignals.attackUntil) return;
      playerAnimSignals.attackUntil = now + ATTACK_LOCK_MS;
      playerAnimSignals.attackCount++;
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
