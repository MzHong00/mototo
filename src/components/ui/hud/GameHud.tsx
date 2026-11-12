import { CONTROL_HINTS } from "@/constants/ui/controls";

import s from "./GameHud.module.scss";

interface GameHudProps {
  name: string;
  /** 꾸미기 화면 열기 */
  onEdit: () => void;
}

/** 게임 화면 HUD — 이름표, 조작 안내, 꾸미기 버튼 */
export function GameHud({ name, onEdit }: GameHudProps) {
  return (
    <>
      <div className={s.nameChip}>
        <span className={s.logo}>✦</span>
        <b>{name}</b>
      </div>
      <button type="button" className={s.editBtn} onClick={onEdit}>
        꾸미기 ✎
      </button>
      <ul className={s.hints}>
        {CONTROL_HINTS.map((h) => (
          <li key={h.label}>
            <kbd>{h.keys}</kbd>
            <span>{h.label}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
