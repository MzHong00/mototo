import { CHIBI_PALETTE, ORIGINAL_COLOR_LABEL } from "@/features/character/constants/chibiPalette";
import { EYES_DEFAULT, SKIN_DEFAULT } from "@/features/character/utils/chibi";

import type { ColorKey } from "@/features/character/constants/chibiPalette";

import s from "./ColorSwatches.module.scss";

const BASE_COLOR: Partial<Record<ColorKey, string>> = { skin: SKIN_DEFAULT, eyes: EYES_DEFAULT };

interface ColorSwatchesProps {
  colorKey: ColorKey;
  value: string | null; // 현재 색 (null: 아이템 원래 색)
  originalHex?: string; // 아이템 원래 색 (옷·머리)
  /** 색 선택 (null: 아이템 원래 색) */
  onSelect: (hex: string | null) => void;
}

/** 색 동그라미 줄 — 옷·머리는 맨 앞이 아이템 원래 색, 피부·눈은 기본색이 팔레트 첫 칸 */
export function ColorSwatches({ colorKey, value, originalHex, onSelect }: ColorSwatchesProps) {
  const base = BASE_COLOR[colorKey];
  const palette = base
    ? [base, ...CHIBI_PALETTE[colorKey].filter((hex) => hex !== base)]
    : CHIBI_PALETTE[colorKey];
  const isCustom = value !== null && !palette.includes(value);

  return (
    <div className={s.row}>
      {!base && (
        <button
          type="button"
          className={`${s.swatch} ${s.original} ${value === null ? s.on : ""}`}
          // 고른 아이템마다 원래 색이 달라 CSS 변수로 주입
          style={originalHex ? ({ "--sw": originalHex } as React.CSSProperties) : undefined}
          title={ORIGINAL_COLOR_LABEL}
          aria-label={ORIGINAL_COLOR_LABEL}
          aria-pressed={value === null}
          onClick={() => onSelect(null)}
        />
      )}
      {palette.map((hex) => (
        <button
          key={hex}
          type="button"
          className={`${s.swatch} ${value === hex ? s.on : ""}`}
          style={{ "--sw": hex } as React.CSSProperties}
          aria-label={hex}
          aria-pressed={value === hex}
          onClick={() => onSelect(hex)}
        />
      ))}
      <label className={`${s.swatch} ${s.custom} ${isCustom ? s.on : ""}`} title="직접 고르기">
        <input
          type="color"
          aria-label="직접 색 고르기"
          value={value ?? originalHex ?? "#ffffff"}
          onChange={(e) => onSelect(e.target.value.toLowerCase())}
        />
      </label>
    </div>
  );
}
