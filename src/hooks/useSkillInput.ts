import { useEffect, useCallback } from "react";

import { useGameStore } from "@/stores/gameStore";
import { playerPositionRef, playerFacingRef, playerAnimSignals } from "@/stores/worldRefs";
import { SKILL_CODES } from "@/constants/skill";
import { getControlsState } from "@/stores/controlsStore";
import { SKILL_REGISTRY, commonSkills } from "@/game/skills";

import type { SkillContext } from "@/types/skill";

export function useSkillInput() {
  const skills = useGameStore((s) => s.skills);
  const triggerSkill = useGameStore((s) => s.useSkill);
  const addFX = useGameStore((s) => s.addFX);
  const activateShield = useGameStore((s) => s.activateShield);
  const healHp = useGameStore((s) => s.healHp);
  const totalAtk = useGameStore((s) => s.totalAtk);
  const jobClass = useGameStore((s) => s.character.jobClass);
  const maxHp = useGameStore((s) => s.character.maxHp);

  const fireSkill = useCallback(
    (id: string) => {
      const now = Date.now();
      if (now < playerAnimSignals.attackUntil || now < playerAnimSignals.dashUntil) return;
      if (!triggerSkill(id)) return;

      const cls = jobClass ?? "warrior";
      const handler = SKILL_REGISTRY[cls][id] ?? commonSkills[id];
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
    [triggerSkill, addFX, activateShield, healHp, totalAtk, jobClass, maxHp, skills],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { bindings } = getControlsState();
      const skillActions = ["skill1", "skill2", "skill3", "skill4", "skill5"] as const;
      for (let i = 0; i < skillActions.length; i++) {
        const sk = skills[i];
        if (e.code === bindings[skillActions[i]] && sk) {
          fireSkill(sk.id);
          return;
        }
      }
      const idx = SKILL_CODES.indexOf(e.code as (typeof SKILL_CODES)[number]);
      if (idx === -1 || idx < 5) return;
      const sk = skills[idx];
      if (sk) fireSkill(sk.id);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fireSkill, skills]);
}
