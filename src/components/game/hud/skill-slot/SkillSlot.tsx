import { useEffect, useState } from "react";
import { SKILL_COLOR } from "@/constants/skill";
import type { SkillState } from "@/types/character";
import s from "./skill-slot.module.scss";

interface SkillSlotProps {
  skill: SkillState;
  hotkey: string;
}

export function SkillSlot({ skill, hotkey }: SkillSlotProps) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(iv);
  }, []);

  const elapsed   = (now - skill.lastUsed) / 1000;
  const remaining = Math.max(0, skill.cooldown - elapsed);
  const pct       = skill.cooldown > 0 ? Math.min(1, elapsed / skill.cooldown) : 1;
  const ready     = remaining === 0;
  const color     = SKILL_COLOR[skill.id] ?? "var(--accent)";

  return (
    <div
      className={`${s.slot} ${ready ? s.ready : s.cooldown}`}
      style={{ "--slot-color": color } as React.CSSProperties}
    >
      {!ready && (
        <div
          className={s.overlay}
          style={{ "--fill-h": `${(1 - pct) * 100}%` } as React.CSSProperties}
        />
      )}
      <span className={s.label} style={{ color: ready ? color : "#888" }}>
        {skill.label}
      </span>
      <span className={s.remaining}>
        {remaining > 0 ? `${remaining.toFixed(1)}s` : skill.mpCost > 0 ? `MP${skill.mpCost}` : ""}
      </span>
      <div className={s.hotkey}>{hotkey}</div>
    </div>
  );
}

export function EmptySlot({ hotkey }: { hotkey: string }) {
  return (
    <div className={s.empty}>
      <div className={s.hotkey}>{hotkey}</div>
    </div>
  );
}
