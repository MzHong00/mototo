import { useEffect, useCallback } from "react";
import * as THREE from "three";
import { useGameStore } from "@/stores/gameStore";
import {
  playerPositionRef,
  playerFacingRef,
  monsterPositions,
  monsterDamageFns,
} from "@/stores/worldRefs";
import {
  SLASH_RANGE,
  BLAST_RANGE,
  PROJECTILE_HIT_RADIUS,
  PROJECTILE_PARAMS,
  BLAST_PROJECTILE_PARAMS,
} from "@/constants/combat";
import { SKILL_CODES } from "@/constants/skill";
import type { JobClass } from "@/types/character";
import type { SkillFXType } from "@/types/combat";

const SLASH_FX_BY_CLASS: Record<JobClass, SkillFXType> = {
  warrior: "slash",
  archer: "arrow",
  mage: "fireball",
  rogue: "shuriken",
};

const BLAST_FX_BY_CLASS: Record<JobClass, SkillFXType> = {
  warrior: "blast",
  archer: "arrow_blast",
  mage: "meteor",
  rogue: "shuriken_blast",
};

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
      if (!triggerSkill(id)) return;

      const ppos = playerPositionRef.current;
      const pos: [number, number, number] = [ppos.x, ppos.y, ppos.z];
      const f = playerFacingRef.current;
      const dir: [number, number, number] = [f.x, f.y, f.z];
      const atk = totalAtk();
      const cls = jobClass ?? "warrior";

      if (id === "slash") {
        const fxType = SLASH_FX_BY_CLASS[cls];
        addFX(fxType, pos, dir);
        const dmg = Math.floor(atk * 0.8 + Math.random() * 6);
        const proj = PROJECTILE_PARAMS[fxType as keyof typeof PROJECTILE_PARAMS];

        if (proj) {
          monsterPositions.forEach((mpos, mid) => {
            const toMon = new THREE.Vector3(mpos.x - ppos.x, 0, mpos.z - ppos.z);
            const along = f.dot(toMon);
            if (along <= 0 || along > proj.maxDist) return;
            if (toMon.lengthSq() - along * along > PROJECTILE_HIT_RADIUS ** 2) return;
            const delay = (along / proj.maxDist) * proj.durationMs;
            setTimeout(() => monsterDamageFns.get(mid)?.(dmg), delay);
          });
        } else {
          monsterPositions.forEach((mpos, mid) => {
            const toMon = new THREE.Vector3(mpos.x - ppos.x, 0, mpos.z - ppos.z);
            if (toMon.length() > SLASH_RANGE) return;
            if (f.dot(toMon.normalize()) < 0.5) return;
            monsterDamageFns.get(mid)?.(dmg);
          });
        }
      }

      if (id === "blast") {
        const fxType = BLAST_FX_BY_CLASS[cls];
        addFX(fxType, pos, dir);
        const dmg = Math.floor(atk * 1.6 + Math.random() * 12);
        const blastProj = BLAST_PROJECTILE_PARAMS[fxType as keyof typeof BLAST_PROJECTILE_PARAMS];

        if (blastProj) {
          const bx = ppos.x + f.x * blastProj.blastDist;
          const bz = ppos.z + f.z * blastProj.blastDist;
          setTimeout(() => {
            monsterPositions.forEach((mpos, mid) => {
              const dx = mpos.x - bx;
              const dz = mpos.z - bz;
              if (dx * dx + dz * dz > blastProj.blastRadius ** 2) return;
              monsterDamageFns.get(mid)?.(dmg);
            });
          }, blastProj.travelMs);
        } else {
          monsterPositions.forEach((mpos, mid) => {
            const toMon = new THREE.Vector3(mpos.x - ppos.x, 0, mpos.z - ppos.z);
            if (toMon.length() > BLAST_RANGE) return;
            if (f.dot(toMon.normalize()) < 0.26) return;
            monsterDamageFns.get(mid)?.(dmg);
          });
        }
      }

      if (id === "shield") activateShield();
      if (id === "heal") healHp(Math.floor(maxHp * 0.3));
    },
    [triggerSkill, addFX, activateShield, healHp, totalAtk, jobClass, maxHp],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const idx = SKILL_CODES.indexOf(e.code as (typeof SKILL_CODES)[number]);
      if (idx !== -1 && skills[idx]) fireSkill(skills[idx].id);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fireSkill, skills]);
}
