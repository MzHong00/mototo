import { useState } from "react";
import type { JobClass } from "@/types/character";
import s from "./class-select.module.scss";

const CLASSES: {
  id: JobClass;
  name: string;
  icon: string;
  desc: string;
  stats: string;
  color: string;
}[] = [
  { id: "warrior", name: "전사",   icon: "⚔️", desc: "두꺼운 갑옷과 강인한 체력으로 최전선을 지킨다.", stats: "HP ★★★  MP ★  ATK ★★  DEF ★★★", color: "#FF6633" },
  { id: "archer",  name: "궁수",   icon: "🏹", desc: "빠른 발놀림과 정확한 조준으로 적을 압도한다.",   stats: "HP ★★  MP ★★  ATK ★★★  DEF ★",    color: "#33BB55" },
  { id: "mage",    name: "마법사", icon: "🔮", desc: "광대한 마나로 강력한 마법을 구사한다.",           stats: "HP ★  MP ★★★  ATK ★★★★  DEF ☆",  color: "#5BA3FF" },
  { id: "rogue",   name: "도적",   icon: "🗡️", desc: "날랜 몸놀림과 표창으로 적의 빈틈을 노린다.",    stats: "HP ★★  MP ★★  ATK ★★★  DEF ★",    color: "#AA44FF" },
];

interface ClassSelectProps {
  onSelect: (cls: JobClass) => void;
}

export function ClassSelect({ onSelect }: ClassSelectProps) {
  const [hovered, setHovered] = useState<JobClass | null>(null);

  return (
    <div className={s.overlay}>
      <div className={s.subtitle}>Browser RPG</div>
      <h1 className={s.title}>직업을 선택하세요</h1>

      <div className={s.cards}>
        {CLASSES.map((cls) => {
          const active = hovered === cls.id;
          return (
            <div
              key={cls.id}
              onMouseEnter={() => setHovered(cls.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(cls.id)}
              className={`${s.card} ${active ? s.active : ""}`}
              style={{ "--cls-color": cls.color } as React.CSSProperties}
            >
              <div className={s.cardIcon}>{cls.icon}</div>
              <div className={s.cardName}>{cls.name}</div>
              <div className={s.cardDesc}>{cls.desc}</div>
              <div className={s.cardStats}>{cls.stats}</div>
              {active && <div className={s.selectBtn}>선택</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
