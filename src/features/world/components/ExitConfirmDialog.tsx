import { useWorldStore } from "@/features/world/stores/worldStore";
import { EXIT_DIALOG_TEXT } from "@/features/world/constants/world";

import s from "./ExitConfirmDialog.module.scss";

/** 확인이 필요한 출구 (지하철 탑승 등) — "출발할까요?" */
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
        {EXIT_DIALOG_TEXT.ask}
      </p>
      <div className={s.buttons}>
        <button type="button" className={s.ok} onClick={() => travel(pendingExit.to)}>
          {EXIT_DIALOG_TEXT.ok}
        </button>
        <button type="button" className={s.cancel} onClick={() => askExit(null)}>
          {EXIT_DIALOG_TEXT.cancel}
        </button>
      </div>
    </div>
  );
}
