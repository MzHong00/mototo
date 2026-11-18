import type { ChibiState } from "@/lib/chibi/character";

/** 저장되는 내 캐릭터 */
export interface SavedCharacter {
  name: string; // 닉네임
  appearance: ChibiState; // 치비 외형 (성별·파츠·색)
}
