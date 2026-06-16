import { MAX_LEVEL } from "@/constants/character/rules";
import { useGameStore } from "@/stores/gameStore";

import s from "./ExpBar.module.scss";

export function ExpBar() {
  const { level, exp, expToNext } = useGameStore((st) => ({
    level: st.character.level,
    exp: st.character.exp,
    expToNext: st.character.expToNext,
  }));
  const isMaxLevel = level >= MAX_LEVEL;
  const pct = isMaxLevel ? 100 : Math.min((exp / expToNext) * 100, 100);

  return (
    <div className={s.track}>
      <div className={s.fill} style={{ "--pct": `${pct}%` } as React.CSSProperties} />
    </div>
  );
}
