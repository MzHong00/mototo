import s from "./ChoiceCard.module.scss";

import type { ReactNode } from "react";

interface ChoiceCardProps {
  label: string;
  thumb: string | null; // 썸네일 경로 (null: icon 또는 '없음' 표시)
  icon?: ReactNode;
  isLabelHidden?: boolean; // 아이콘만으로 뜻이 보일 때 이름 숨김 (화면 읽기용으로는 남김)
  isActive: boolean;
  /** 카드 선택 */
  onSelect: () => void;
}

/** 썸네일(또는 아이콘) + 이름 선택 칸 (파츠·얼굴·성별 공용) */
export function ChoiceCard({
  label,
  thumb,
  icon,
  isLabelHidden,
  isActive,
  onSelect,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      className={`${s.card} ${isActive ? s.active : ""}`}
      aria-pressed={isActive}
      onClick={onSelect}
    >
      <span className={s.thumb}>
        {thumb && <img src={thumb} alt="" />}
        {!thumb && (icon ?? <b className={s.none}>✕</b>)}
      </span>
      <span className={isLabelHidden ? s.srOnly : s.label}>{label}</span>
    </button>
  );
}
