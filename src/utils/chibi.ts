import {
  CATEGORIES,
  DEFAULT_HAIR,
  IRIS_BASE,
  PART_CATALOG,
  SKIN_BASE,
  partFits,
  rgbHex,
} from "@/engine/chibi/character";

import type { ChibiState, Gender, PartCategory } from "@/engine/chibi/character";
import type { ColorKey } from "@/constants/character/chibiPalette";

export const SKIN_DEFAULT = rgbHex(SKIN_BASE); // 피부 기본색
export const EYES_DEFAULT = rgbHex(IRIS_BASE); // 눈 기본색

const isPartKey = (k: ColorKey): k is PartCategory => (CATEGORIES as string[]).includes(k);

/** 성별 변경 — 다른 성별 전용 머리는 그 성별 기본 머리로 교체 */
export function withGender(s: ChibiState, gender: Gender): ChibiState {
  const hair = PART_CATALOG.hair.find((p) => p.id === s.parts.hair);
  const isMismatch = !!hair && !partFits(hair, gender);
  return { ...s, gender, parts: isMismatch ? { ...s.parts, hair: DEFAULT_HAIR[gender] } : s.parts };
}

/** 파츠 교체 (null = 없음) */
export const withPart = (s: ChibiState, cat: PartCategory, id: string | null): ChibiState => ({
  ...s,
  parts: { ...s.parts, [cat]: id },
});

/** 색 변경 (null = 기본색) */
export function withColor(s: ChibiState, key: ColorKey, hex: string | null): ChibiState {
  if (key === "skin") return { ...s, skin: hex ?? SKIN_DEFAULT };
  if (key === "eyes") return { ...s, eyes: hex ?? EYES_DEFAULT };
  return { ...s, colors: { ...s.colors, [key]: hex } };
}

/** 현재 선택된 색 (기본색이면 null) */
export function currentColor(s: ChibiState, key: ColorKey): string | null {
  if (isPartKey(key)) return s.colors[key];
  const def = key === "skin" ? SKIN_DEFAULT : EYES_DEFAULT;
  return s[key] === def ? null : s[key];
}
