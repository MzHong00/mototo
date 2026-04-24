import { useEffect, useRef } from "react";
import { useGameStore } from "@/stores/gameStore";
import s from "./LevelUpEffect.module.scss";

export function LevelUpEffect() {
  const levelUpPending = useGameStore((s) => s.levelUpPending);
  const clearLevelUp = useGameStore((s) => s.clearLevelUp);
  const level = useGameStore((s) => s.character.level);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!levelUpPending || !overlayRef.current) return;
    const el = overlayRef.current;
    el.style.opacity = "1";
    el.style.transform = "translateX(-50%) scale(1.15)";
    const t1 = setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateX(-50%) scale(1)";
    }, 1800);
    const t2 = setTimeout(() => clearLevelUp(), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [levelUpPending, clearLevelUp]);

  if (!levelUpPending) return null;

  return (
    <>
      <div className={s.flash} />
      <div ref={overlayRef} className={s.overlay}>
        <div className={s.levelUpText}>LEVEL UP!</div>
        <div className={s.levelNum}>Lv.{level}</div>
      </div>
    </>
  );
}
