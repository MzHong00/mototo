import { useGameStore } from "@/stores/gameStore";
import { CLASS_LABEL } from "@/constants/character/class";

import s from "./CharInfo.module.scss";

export function CharInfo() {
  const { level, name, cls, isShielded, skillPoints } = useGameStore((st) => ({
    level: st.character.level,
    name: st.character.name,
    cls: st.character.cls,
    isShielded: st.isShielded,
    skillPoints: st.skillPoints,
  }));

  const classLabel = cls ? (CLASS_LABEL[cls] ?? cls) : "";

  return (
    <div className={`${s.wrap} ${isShielded ? s.shielded : ""}`}>
      <span className={s.level}>Lv.{level}</span>
      {classLabel && <span className={s.job}>{classLabel}</span>}
      <span className={s.name}>{name}</span>
      {isShielded && <span className={s.badge}>방패</span>}
      {skillPoints > 0 && <span className={s.sp}>SP {skillPoints}</span>}
    </div>
  );
}
