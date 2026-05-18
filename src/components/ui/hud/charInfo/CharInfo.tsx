import { useShallow } from "zustand/react/shallow";

import { useGameStore } from "@/stores/gameStore";
import { JOB_CLASS_LABEL } from "@/constants/character";

import s from "./CharInfo.module.scss";

export function CharInfo() {
  const { level, name, jobClass } = useGameStore(
    useShallow((st) => ({
      level: st.character.level,
      name: st.character.name,
      jobClass: st.character.jobClass,
    })),
  );
  const isShielded = useGameStore((st) => st.isShielded);
  const skillPoints = useGameStore((st) => st.skillPoints);

  const jobLabel = jobClass ? (JOB_CLASS_LABEL[jobClass] ?? jobClass) : "";

  return (
    <div className={`${s.wrap} ${isShielded ? s.shielded : ""}`}>
      <span className={s.level}>Lv.{level}</span>
      {jobLabel && <span className={s.job}>{jobLabel}</span>}
      <span className={s.name}>{name}</span>
      {isShielded && <span className={s.badge}>방패</span>}
      {skillPoints > 0 && <span className={s.sp}>SP {skillPoints}</span>}
    </div>
  );
}
