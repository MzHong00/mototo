import { useGameStore } from "@/stores/gameStore";
import { useShallow } from "zustand/react/shallow";
import { StatBar } from "@/components/game/hud/StatBar/StatBar";
import s from "./CharacterPanel.module.scss";

const STAT_BARS = [
  { label: "HP", key: "hp" as const, maxKey: "maxHp" as const, colorVar: "--hp" },
  { label: "MP", key: "mp" as const, maxKey: "maxMp" as const, colorVar: "--mp" },
  { label: "EXP", key: "exp" as const, maxKey: "expToNext" as const, colorVar: "--exp" },
];

export function CharacterPanel() {
  const character = useGameStore(useShallow((s) => s.character));
  const isShielded = useGameStore((s) => s.isShielded);
  const expPct = Math.round((character.exp / character.expToNext) * 100);

  return (
    <div className={`${s.panel} ${isShielded ? s.shielded : ""}`}>
      <div className={s.header}>
        <div className={s.levelBadge}>Lv.{character.level}</div>
        <span className={s.name}>{character.name}</span>
        {isShielded && <span className={s.shieldBadge}>방패</span>}
      </div>

      {STAT_BARS.map(({ label, key, maxKey, colorVar }, i) => {
        const value = character[key];
        const max = character[maxKey];
        return (
          <div key={label} className={i < 2 ? s.statGap : undefined}>
            <div className={s.statRow} style={{ color: `var(${colorVar})` }}>
              <span>{label}</span>
              <span>{label === "EXP" ? `${expPct}%` : `${value}/${max}`}</span>
            </div>
            <StatBar value={value} max={max} colorVar={colorVar} />
          </div>
        );
      })}
    </div>
  );
}
