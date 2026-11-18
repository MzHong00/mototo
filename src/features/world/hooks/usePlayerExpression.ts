import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { playerExpression } from "@/lib/runtime/frameState";
import { EXPRESSION_SEC } from "@/config/controls";

import type { Character } from "@/lib/chibi/character";

/** 표정 키 신호를 받아 캐릭터 얼굴에 표정을 띄운다 */
export function usePlayerExpression(character: Character | null) {
  const handledCount = useRef(playerExpression.count);

  useFrame(() => {
    if (!character || playerExpression.count === handledCount.current) return;
    handledCount.current = playerExpression.count;
    void character.setExpression(playerExpression.id, EXPRESSION_SEC);
  });
}
