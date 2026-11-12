import { useWorldStore } from "@/stores/worldStore";
import { EXIT_DIALOG_TEXT } from "@/constants/ui/worldMap";

import s from "./ExitConfirmDialog.module.scss";

/** 배·전투맵 입구처럼 확인이 필요한 출구 — "갈까요?" */
export function ExitConfirmDialog() {
  const { pendingExit, askExit, travel } = useWorldStore((st) => ({
    pendingExit: st.pendingExit,
    askExit: st.askExit,
    travel: st.travel,
  }));
  if (!pendingExit) return null;
  const isDungeon = pendingExit.mode === "dungeon";

  return (
    <div className={s.dialog} role="dialog" aria-label="이동 확인">
      <p className={s.text}>
        <b>{pendingExit.label}</b>
        <br />
        {isDungeon ? EXIT_DIALOG_TEXT.askDungeon : EXIT_DIALOG_TEXT.askTravel}
      </p>
      <div className={s.buttons}>
        <button type="button" className={s.ok} onClick={() => travel(pendingExit.to)}>
          {isDungeon ? EXIT_DIALOG_TEXT.okDungeon : EXIT_DIALOG_TEXT.okTravel}
        </button>
        <button type="button" className={s.cancel} onClick={() => askExit(null)}>
          {EXIT_DIALOG_TEXT.cancel}
        </button>
      </div>
    </div>
  );
}
