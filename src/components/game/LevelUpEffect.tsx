import { useEffect, useRef } from "react";
import { useGameStore } from "@/stores/gameStore";

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
      {/* 화면 플래시 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,215,0,0.18)",
          pointerEvents: "none",
          zIndex: 20,
          animation: "levelFlash 0.5s ease-out forwards",
        }}
      />

      {/* LEVEL UP 텍스트 */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translateX(-50%) scale(1)",
          opacity: 0,
          transition: "opacity 0.3s ease, transform 0.3s ease",
          zIndex: 30,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-title)",
            fontWeight: 600,
            fontSize: 48,
            color: "#FFD700",
            textShadow:
              "0 0 20px rgba(255,153,0,0.9), 0 2px 4px rgba(0,0,0,0.6)",
            letterSpacing: 4,
          }}
        >
          LEVEL UP!
        </div>
        <div
          style={{
            fontFamily: "var(--font-ui)",
            fontWeight: 900,
            fontSize: 22,
            color: "#fff",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            marginTop: 6,
          }}
        >
          Lv.{level}
        </div>
      </div>

      <style>{`
        @keyframes levelFlash {
          0%   { opacity: 0.6 }
          100% { opacity: 0 }
        }
      `}</style>
    </>
  );
}
