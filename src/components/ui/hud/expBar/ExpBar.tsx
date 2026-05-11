import { useShallow } from "zustand/react/shallow";

import { useGameStore } from "@/stores/gameStore";

import s from "./ExpBar.module.scss";

export function ExpBar() {
  const { exp, expToNext } = useGameStore(
    useShallow((st) => ({ exp: st.character.exp, expToNext: st.character.expToNext }))
  );
  const pct = Math.min((exp / expToNext) * 100, 100);

  return (
    <div className={s.track}>
      <div className={s.fill} style={{ width: `${pct}%` }} />
    </div>
  );
}
