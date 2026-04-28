import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { bossGateProximity } from "@/stores/worldRefs";
import { BOSS_TYPE } from "@/constants/boss";

const BOSS_ID = BOSS_TYPE.RED_GUARDIAN;

const POLL_MS = 150;

interface RedGuardianEntryProps {
  onEnter: () => void;
}

export function RedGuardianEntry({ onEnter }: RedGuardianEntryProps) {
  const [isNear, setIsNear] = useState(false);
  const clearedBosses = useGameStore((s) => s.clearedBosses);

  useEffect(() => {
    const iv = setInterval(() => setIsNear(bossGateProximity.isNear), POLL_MS);
    return () => clearInterval(iv);
  }, []);

  if (!isNear) return null;

  const isCleared = clearedBosses.includes(BOSS_ID);
  const title = isCleared ? "수호자를 이미 물리쳤습니다." : "붉은 수호자에게 도전하시겠습니까?";
  const subtitle = isCleared
    ? "재도전 시 골드·경험치만 획득 (아이템 드랍 없음)"
    : "클리어 시 수호자의 검 획득";
  const confirmLabel = isCleared ? "재도전" : "도전";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.96)",
          border: "2px solid var(--border)",
          borderRadius: "var(--r-lg)",
          padding: "var(--sp-lg)",
          boxShadow: "0 4px 24px rgba(204,34,34,0.3), 0 0 0 1px rgba(255,215,0,0.3)",
          minWidth: 300,
          textAlign: "center",
          fontFamily: "var(--font-ui)",
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-title)",
            fontWeight: 600,
            fontSize: 18,
            color: "#CC2222",
            marginBottom: "var(--sp-xs)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginBottom: "var(--sp-md)",
          }}
        >
          {subtitle}
        </div>
        <div style={{ display: "flex", gap: "var(--sp-sm)", justifyContent: "center" }}>
          <button
            className="btn btn-primary"
            style={{
              background: "linear-gradient(135deg,#CC2222,#FF4444)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--r-full)",
              padding: "9px 24px",
              fontFamily: "var(--font-ui)",
              fontWeight: 900,
              fontSize: 13,
              cursor: "pointer",
            }}
            onClick={onEnter}
          >
            {confirmLabel}
          </button>
          <button
            style={{
              background: "var(--panel-bg)",
              color: "var(--text)",
              border: "2px solid var(--border-blue)",
              borderRadius: "var(--r-full)",
              padding: "9px 24px",
              fontFamily: "var(--font-ui)",
              fontWeight: 900,
              fontSize: 13,
              cursor: "pointer",
            }}
            onClick={() => setIsNear(false)}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
