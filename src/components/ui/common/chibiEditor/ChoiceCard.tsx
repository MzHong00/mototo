import s from "./ChoiceCard.module.scss";

interface ChoiceCardProps {
  label: string;
  thumb: string | null; // 썸네일 경로 (null: '없음' 표시)
  isActive: boolean;
  /** 카드 선택 */
  onSelect: () => void;
}

/** 썸네일 + 이름 선택 카드 (파츠·얼굴·성별 공용) */
export function ChoiceCard({ label, thumb, isActive, onSelect }: ChoiceCardProps) {
  return (
    <button
      type="button"
      className={`${s.card} ${isActive ? s.active : ""}`}
      aria-pressed={isActive}
      onClick={onSelect}
    >
      <span className={s.thumb}>
        {thumb ? <img src={thumb} alt="" /> : <b className={s.none}>✕</b>}
      </span>
      <span className={s.label}>{label}</span>
    </button>
  );
}
