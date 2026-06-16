import { useEffect, useState } from "react";

import { getGameState } from "@/stores/gameStore";
import { SKILL_COLOR, SKILL_ICON } from "@/constants/skill/skill";

import type { SkillState } from "@/types/skill";

import s from "./SkillSlot.module.scss";

interface SkillSlotProps {
  skill: SkillState;
  hotkey: string;
  slotIdx: number;
}

function handleDrop(e: React.DragEvent, targetIdx: number) {
  e.preventDefault();
  try {
    const data = JSON.parse(e.dataTransfer.getData("text/plain")) as
      | { from: "slot"; slotIdx: number }
      | { from: "pool"; skillId: string };
    const store = getGameState();
    if (data.from === "slot") {
      store.swapSkillSlots(data.slotIdx, targetIdx);
    } else {
      const skill = store.allSkills.find((sk) => sk.id === data.skillId);
      if (skill) store.assignSkill(targetIdx, skill);
    }
  } catch {
    // ignore bad drag data
  }
}

export function SkillSlot({ skill, hotkey, slotIdx }: SkillSlotProps) {
  const [now, setNow] = useState(() => Date.now());
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(iv);
  }, []);

  const elapsed = (now - skill.lastUsed) / 1000;
  const remaining = Math.max(0, skill.cooldown - elapsed);
  const pct = skill.cooldown > 0 ? Math.min(1, elapsed / skill.cooldown) : 1;
  const ready = remaining === 0;
  const color = SKILL_COLOR[skill.id] ?? "var(--accent)";

  return (
    <div
      className={`${s.slot} ${ready ? s.ready : s.cooldown} ${dragOver ? s.dragOver : ""}`}
      style={{ "--slot-color": color } as React.CSSProperties}
      draggable
      onDragStart={(e) => {
        const ghost = document.createElement("div");
        ghost.className = s.dragGhost;
        ghost.style.background = color;
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 20, 20);
        setTimeout(() => document.body.removeChild(ghost), 0);
        e.dataTransfer.setData("text/plain", JSON.stringify({ from: "slot", slotIdx }));
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        setDragOver(false);
        handleDrop(e, slotIdx);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        getGameState().removeSkillFromSlot(slotIdx);
      }}
    >
      {!ready && (
        <div
          className={s.overlay}
          style={{ "--fill-h": `${(1 - pct) * 100}%` } as React.CSSProperties}
        />
      )}
      <span className={s.icon}>{SKILL_ICON[skill.id] ?? "?"}</span>
      {remaining > 0 && <span className={s.remaining}>{remaining.toFixed(1)}s</span>}
      <div className={s.hotkey}>{hotkey}</div>
    </div>
  );
}

export function EmptySlot({ hotkey, slotIdx }: { hotkey: string; slotIdx: number }) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`${s.empty} ${dragOver ? s.dragOver : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        setDragOver(false);
        handleDrop(e, slotIdx);
      }}
    >
      <div className={s.hotkey}>{hotkey}</div>
    </div>
  );
}
