import { useWorldStore } from "@/stores/worldStore";

import s from "./FadeOverlay.module.scss";

/** 맵 이동 때 화면을 잠깐 어둡게 덮는 막 */
export function FadeOverlay() {
  const fade = useWorldStore((st) => st.fade);

  return <div className={`${s.fade} ${fade === "out" ? s.isDark : ""}`} aria-hidden />;
}
