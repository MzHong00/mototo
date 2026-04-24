import { useGameStore } from "@/stores/gameStore";
import { SKILL_KEY_GROUPS, ALL_HOTKEYS } from "@/constants/skill";
import { SkillSlot, EmptySlot } from "@/components/game/hud/skill-slot/SkillSlot";
import s from "./skill-bar.module.scss";

export function SkillBar() {
  const skills = useGameStore((s) => s.skills);
  return (
    <div className={s.bar}>
      {SKILL_KEY_GROUPS.map((group, gi) => (
        <div key={gi} className={s.row}>
          {group.map((hotkey) => {
            const idx = ALL_HOTKEYS.indexOf(hotkey);
            const skill = skills[idx];
            return skill
              ? <SkillSlot key={hotkey} skill={skill} hotkey={hotkey} />
              : <EmptySlot key={hotkey} hotkey={hotkey} />;
          })}
        </div>
      ))}
    </div>
  );
}
