import { useEffect, useRef, useState } from "react";

import { ASSET_BASE, Character } from "@/engine/chibi/character";
import { CHIBI_ASSET_BASE } from "@/constants/assets/chibi";

import type { ChibiState } from "@/engine/chibi/character";

ASSET_BASE.url = CHIBI_ASSET_BASE;

/**
 * 치비 캐릭터 인스턴스를 로드하고 외형(성별·파츠·색)을 적용한다.
 * 첫 외형 적용이 끝난 뒤에 character 를 돌려줘 파츠가 늦게 붙는 깜빡임을 막는다.
 */
export function useChibiCharacter(appearance: ChibiState) {
  const appearanceRef = useRef(appearance); // 로드 완료 시점의 최신 외형
  const [character, setCharacter] = useState<Character | null>(null);
  const [isError, setIsError] = useState(false);

  /** 마운트 시 1회 로드 — 언마운트되면 결과 폐기 */
  useEffect(() => {
    let isAlive = true;
    const load = async () => {
      try {
        const ch = await Character.load();
        await ch.applyState(appearanceRef.current);
        if (isAlive) setCharacter(ch);
      } catch (e) {
        console.warn("치비 캐릭터 로드 실패", e);
        if (isAlive) setIsError(true);
      }
    };
    void load();
    return () => {
      isAlive = false;
    };
  }, []);

  /** 외형이 바뀌면 최신값 기록 + 다시 적용 (같은 파츠는 색만 갱신) */
  useEffect(() => {
    appearanceRef.current = appearance;
    if (character) void character.applyState(appearance);
  }, [character, appearance]);

  return { character, isError };
}
