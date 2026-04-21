"use client";

import { useState } from "react";
import { type JobClass } from "@/stores/gameStore";

const CLASSES: { id: JobClass; name: string; icon: string; desc: string; stats: string; color: string }[] = [
  {
    id: "warrior",
    name: "전사",
    icon: "⚔️",
    desc: "두꺼운 갑옷과 강인한 체력으로 최전선을 지킨다.",
    stats: "HP ★★★  MP ★  ATK ★★  DEF ★★★",
    color: "#FF6633",
  },
  {
    id: "archer",
    name: "궁수",
    icon: "🏹",
    desc: "빠른 발놀림과 정확한 조준으로 적을 압도한다.",
    stats: "HP ★★  MP ★★  ATK ★★★  DEF ★",
    color: "#33BB55",
  },
  {
    id: "mage",
    name: "마법사",
    icon: "🔮",
    desc: "광대한 마나로 강력한 마법을 구사한다.",
    stats: "HP ★  MP ★★★  ATK ★★★★  DEF ☆",
    color: "#5BA3FF",
  },
];

interface ClassSelectProps {
  onSelect: (cls: JobClass) => void;
}

export function ClassSelect({ onSelect }: ClassSelectProps) {
  const [hovered, setHovered] = useState<JobClass | null>(null);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "var(--bg)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      zIndex: 100,
    }}>
      {/* 타이틀 */}
      <div style={{ marginBottom: 8, fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 13, color: "var(--text-muted)", letterSpacing: 4, textTransform: "uppercase" }}>
        Browser RPG
      </div>
      <h1 style={{ fontFamily: "var(--font-title)", fontWeight: 600, fontSize: 32, color: "var(--text)", margin: "0 0 48px", textShadow: "0 2px 8px rgba(91,163,255,0.3)" }}>
        직업을 선택하세요
      </h1>

      <div style={{ display: "flex", gap: 20 }}>
        {CLASSES.map((cls) => {
          const active = hovered === cls.id;
          return (
            <div
              key={cls.id}
              onMouseEnter={() => setHovered(cls.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(cls.id)}
              style={{
                width: 200,
                padding: "28px 20px 24px",
                background: active ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.85)",
                border: `2px solid ${active ? cls.color : "var(--border-blue)"}`,
                borderRadius: "var(--r-xl)",
                cursor: "pointer",
                textAlign: "center",
                transform: active ? "translateY(-8px) scale(1.03)" : "none",
                transition: "all 0.18s ease",
                boxShadow: active
                  ? `0 12px 32px ${cls.color}44, 0 0 0 1px ${cls.color}66`
                  : "0 2px 12px rgba(91,163,255,0.1)",
              }}
            >
              <div style={{ fontSize: 52, marginBottom: 12 }}>{cls.icon}</div>
              <div style={{ fontFamily: "var(--font-title)", fontWeight: 600, fontSize: 22, color: active ? cls.color : "var(--text)", marginBottom: 10 }}>
                {cls.name}
              </div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 16 }}>
                {cls.desc}
              </div>
              <div style={{ fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 10, color: active ? cls.color : "var(--text-muted)", lineHeight: 1.8 }}>
                {cls.stats}
              </div>

              {active && (
                <div style={{ marginTop: 20, padding: "8px 20px", background: cls.color, borderRadius: "var(--r-full)", fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 13, color: "#fff", boxShadow: `0 4px 12px ${cls.color}66` }}>
                  선택
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
