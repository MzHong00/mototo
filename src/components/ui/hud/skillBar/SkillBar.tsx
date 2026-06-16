import { useGameStore } from "@/stores/gameStore";
import { SKILL_KEY_GROUPS, ALL_HOTKEYS } from "@/constants/ui/controls";
import { SkillSlot, EmptySlot } from "@/components/ui/hud/skillSlot/SkillSlot";

import s from "./SkillBar.module.scss";

export function SkillBar() {
  const { skills, hp, maxHp } = useGameStore((st) => ({
    skills: st.skills,
    hp: st.character.hp,
    maxHp: st.character.maxHp,
  }));

  const renderSlot = (hotkey: (typeof ALL_HOTKEYS)[number]) => {
    const idx = ALL_HOTKEYS.indexOf(hotkey);
    const skill = skills[idx];
    return skill ? (
      <SkillSlot key={hotkey} skill={skill} hotkey={hotkey} slotIdx={idx} />
    ) : (
      <EmptySlot key={hotkey} hotkey={hotkey} slotIdx={idx} />
    );
  };

  const numericGroup = SKILL_KEY_GROUPS[0];

  return (
    <div className={s.bar}>
      {/* HP 바 — .bar 전체 너비 */}
      <div className={s.hpBar}>
        <div
          className={s.hpFill}
          style={{ "--hp-pct": `${Math.min((hp / maxHp) * 100, 100)}%` } as React.CSSProperties}
        />
        <span className={s.hpText}>
          <span className={s.hpLabel}>HP</span> {hp}
          <span className={s.hpMax}>/{maxHp}</span>
        </span>
      </div>

      {/* 스킬 슬롯 */}
      <div className={s.slots}>
        <div className={s.group}>
          <div className={s.row}>{SKILL_KEY_GROUPS[1].map(renderSlot)}</div>
          <div className={s.row}>{SKILL_KEY_GROUPS[2].map(renderSlot)}</div>
        </div>
        <div className={s.group}>
          <div className={s.row}>{numericGroup.slice(0, 4).map(renderSlot)}</div>
          <div className={s.row}>{numericGroup.slice(4, 8).map(renderSlot)}</div>
        </div>
      </div>
    </div>
  );
}
