import { useEffect, useCallback } from "react";

import { useGameStore } from "@/stores/gameStore";
import { playerPositionRef, playerFacingRef, playerAnimSignals } from "@/stores/worldRefs";
import { SKILL_CODES } from "@/constants/ui/controls";
import { getControlsState } from "@/stores/controlsStore";
import { SKILL_REGISTRY } from "@/game/skills";
import { CLASS } from "@/constants/character/class";

import type { SkillContext } from "@/types/skill";

const SKILL_ACTIONS = ["skill1", "skill2", "skill3", "skill4", "skill5"] as const;

export function useSkillInput() {
  const skills = useGameStore((s) => s.skills);
  const triggerSkill = useGameStore((s) => s.useSkill);
  const addFX = useGameStore((s) => s.addFX);
  const activateShield = useGameStore((s) => s.activateShield);
  const healHp = useGameStore((s) => s.healHp);
  const totalAtk = useGameStore((s) => s.totalAtk);
  const cls = useGameStore((s) => s.character.cls);
  const maxHp = useGameStore((s) => s.character.maxHp);

  const fireSkill = useCallback(
    (id: string) => {
      const now = Date.now();
      if (now < playerAnimSignals.attackUntil || now < playerAnimSignals.dashUntil) return;
      if (!triggerSkill(id)) return;

      const activeClass = cls ?? CLASS.WARRIOR;
      const handler = SKILL_REGISTRY[activeClass][id];
      if (!handler) return;

      const ppos = playerPositionRef.current.clone();
      const facing = playerFacingRef.current;
      const ctx: SkillContext = {
        ppos,
        facing,
        pos: [ppos.x, ppos.y, ppos.z],
        dir: [facing.x, facing.y, facing.z],
        atk: totalAtk(),
        skillLevel: skills.find((sk) => sk?.id === id)?.level ?? 1,
        maxHp,
        addFX,
        healHp,
        activateShield,
      };

      playerAnimSignals.attackUntil = now + handler.lockMs;
      if (handler.triggersAttack) playerAnimSignals.attackCount++;
      handler.execute(ctx);
    },
    [triggerSkill, addFX, activateShield, healHp, totalAtk, cls, maxHp, skills],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { bindings } = getControlsState();
      for (let i = 0; i < SKILL_ACTIONS.length; i++) {
        const sk = skills[i];
        if (e.code === bindings[SKILL_ACTIONS[i]] && sk) {
          fireSkill(sk.id);
          return;
        }
      }
      const idx = SKILL_CODES.indexOf(e.code as (typeof SKILL_CODES)[number]);
      if (idx === -1 || idx < SKILL_ACTIONS.length) return;
      const sk = skills[idx];
      if (sk) fireSkill(sk.id);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fireSkill, skills]);
}
