import s from "./StatBar.module.scss";

interface StatBarProps {
  value: number;
  max: number;
  colorVar: string;
}

export function StatBar({ value, max, colorVar }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={s.track}>
      <div className={s.fill} style={{ width: `${pct}%`, background: `var(${colorVar})` }} />
    </div>
  );
}
