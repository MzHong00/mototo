import { useGameStore } from "@/stores/gameStore";
import { SKILL_KEY_GROUPS, ALL_HOTKEYS } from "@/constants/skill";
import { SkillSlot, EmptySlot } from "@/components/ui/hud/skillSlot/SkillSlot";

import s from "./SkillBar.module.scss";

export function SkillBar() {
  const skills = useGameStore((st) => st.skills);
  return (
    <div className={s.bar}>
      {SKILL_KEY_GROUPS.map((group, gi) => (
        <div key={gi} className={s.row}>
          {group.map((hotkey) => {
            const idx = ALL_HOTKEYS.indexOf(hotkey);
            const skill = skills[idx];
            return skill ? (
              <SkillSlot key={hotkey} skill={skill} hotkey={hotkey} slotIdx={idx} />
            ) : (
              <EmptySlot key={hotkey} hotkey={hotkey} slotIdx={idx} />
            );
          })}
        </div>
      ))}
    </div>
  );
}
