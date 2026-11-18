import { useEffect } from "react";

import { playerExpression, playerInput } from "@/lib/runtime/frameState";
import { EXPRESSION_CATALOG } from "@/lib/chibi/character";
import { getWorldState } from "@/features/world/stores/worldStore";
import { CLOSE_KEY, EXPRESSION_KEYS, KEY_BINDINGS } from "@/config/controls";

const JUMP_CODES: readonly string[] = KEY_BINDINGS.jump;
const AREA_MAP_CODES: readonly string[] = KEY_BINDINGS.areaMap;

/**
 * 한 번 누르면 한 번만 일어나는 동작(점프·표정·맵 전체 보기 열기)의 키 입력.
 * 꾹 누르고 있어도 반복되지 않는다 (e.repeat 무시).
 */
export function useActionInput() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return;
      // 맵 전체 보기 열기/닫기, Esc로 열린 창(맵 전체 보기·확인창) 닫기
      const world = getWorldState();
      if (AREA_MAP_CODES.includes(e.code)) {
        world.setAreaMapOpen(!world.isAreaMapOpen);
        return;
      }
      if (e.code === CLOSE_KEY) {
        world.setAreaMapOpen(false);
        world.askExit(null);
        return;
      }
      const expression = EXPRESSION_CATALOG[EXPRESSION_KEYS.indexOf(e.code)];
      if (expression) {
        e.preventDefault(); // F1 브라우저 도움말 등 기본 동작 막기
        playerExpression.id = expression.id;
        playerExpression.count++;
        return;
      }
      if (JUMP_CODES.includes(e.code)) {
        e.preventDefault(); // 스페이스로 페이지 스크롤·버튼 클릭 방지
        playerInput.isJumpQueued = true;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
