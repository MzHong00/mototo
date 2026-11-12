import { CHIBI_PALETTE, DEFAULT_COLOR_LABEL } from "@/constants/character/chibiPalette";

import type { ColorKey } from "@/constants/character/chibiPalette";

import s from "./ColorSwatches.module.scss";

interface ColorSwatchesProps {
  colorKey: ColorKey;
  value: string | null; // 현재 색 (null: 기본색)
  /** 색 선택 (null: 기본색) */
  onSelect: (hex: string | null) => void;
}

/** 기본색 + 팔레트 + 직접 고르기 스와치 줄 */
export function ColorSwatches({ colorKey, value, onSelect }: ColorSwatchesProps) {
  const palette = CHIBI_PALETTE[colorKey];
  const isCustom = value !== null && !palette.includes(value);

  return (
    <div className={s.row}>
      <button
        type="button"
        className={`${s.swatch} ${s.def} ${value === null ? s.on : ""}`}
        aria-label={`${DEFAULT_COLOR_LABEL} 색`}
        aria-pressed={value === null}
        onClick={() => onSelect(null)}
      />
      {palette.map((hex) => (
        <button
          key={hex}
          type="button"
          className={`${s.swatch} ${value === hex ? s.on : ""}`}
          // 팔레트 색 자체가 데이터라 CSS 변수로 주입
          style={{ "--sw": hex } as React.CSSProperties}
          aria-label={hex}
          aria-pressed={value === hex}
          onClick={() => onSelect(hex)}
        />
      ))}
      <label className={`${s.swatch} ${s.custom} ${isCustom ? s.on : ""}`} title="직접 고르기">
        <b>+</b>
        <input
          type="color"
          aria-label="직접 색 고르기"
          value={value ?? "#ffffff"}
          onChange={(e) => onSelect(e.target.value.toLowerCase())}
        />
      </label>
    </div>
  );
}
