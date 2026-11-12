import { useWorldStore } from "@/stores/worldStore";

import s from "./ExitConfirmDialog.module.scss";

/** 배·전투맵 입구처럼 확인이 필요한 출구 — "갈까요?" */
export function ExitConfirmDialog() {
  const { pendingExit, askExit, travel } = useWorldStore((st) => ({
    pendingExit: st.pendingExit,
    askExit: st.askExit,
    travel: st.travel,
  }));
  if (!pendingExit) return null;

  return (
    <div className={s.dialog} role="dialog" aria-label="이동 확인">
      <p className={s.text}>
        <b>{pendingExit.label}</b>
        <br />
        {pendingExit.mode === "dungeon" ? "들어갈까요?" : "출발할까요?"}
      </p>
      <div className={s.buttons}>
        <button type="button" className={s.ok} onClick={() => travel(pendingExit.to)}>
          {pendingExit.mode === "dungeon" ? "들어가기" : "출발"}
        </button>
        <button type="button" className={s.cancel} onClick={() => askExit(null)}>
          그만두기
        </button>
      </div>
    </div>
  );
}
