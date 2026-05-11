import { useEffect, useCallback } from "react";
import * as THREE from "three";

import { useGameStore } from "@/stores/gameStore";
import {
  playerPositionRef,
  playerFacingRef,
  monsterPositions,
  monsterDamageFns,
  bossPositionRef,
  bossDamageFnRef,
  dashTrigger,
  playerAnimSignals,
} from "@/stores/worldRefs";
import {
  SLASH_RANGE,
  BLAST_RANGE,
  PROJECTILE_HIT_RADIUS,
  PROJECTILE_PARAMS,
  BLAST_PROJECTILE_PARAMS,
} from "@/constants/combat";
import { SLASH_DMG_MULT, BLAST_DMG_MULT, HEAL_PCT } from "@/constants/growth";
import { SKILL_CODES } from "@/constants/skill";
import { getControlsState } from "@/stores/controlsStore";

import type { JobClass } from "@/types/job";
import type { SkillFXType } from "@/types/combat";

const SLASH_FX_BY_CLASS: Partial<Record<JobClass, SkillFXType>> = {
  // warrior: GLB 슬래시 모션으로 대체 — FX 없음
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

// 공격 애니메이션 지속 시간 (이동 잠금) — useCharacterAnimation ATTACK_ANIM과 동기화 필요
const SLASH_LOCK_MS = 500;

// 슬래시 히트 판정 딜레이 — 칼이 실제로 닿는 프레임 (애니메이션 ~50% 지점)
const SLASH_HIT_DELAY_MS: Record<JobClass, number> = {
  warrior: 250, // 500ms 모션 중 절반 지점
  archer: 0,
  mage: 0,
  rogue: 0,
};
const BLAST_LOCK_MS = 500;

// cos(75°) — 전방 75도 부채꼴 범위 내 타격 판정
const BLAST_ARC_COS = 0.26;

// 타입 단언 없이 PROJECTILE_PARAMS 키 조회용 타입
type ProjectileMap = Partial<Record<SkillFXType, { maxDist: number; durationMs: number }>>;
type BlastProjectileMap = Partial<
  Record<SkillFXType, { blastDist: number; travelMs: number; blastRadius: number }>
>;
const PROJ = PROJECTILE_PARAMS as ProjectileMap;
const BLAST_PROJ = BLAST_PROJECTILE_PARAMS as BlastProjectileMap;

// ── 보스 히트 체크 헬퍼 ──────────────────────────────────────────
function hitBossProjectile(
  ppos: THREE.Vector3,
  facing: THREE.Vector3,
  maxDist: number,
  durationMs: number,
  dmg: number,
) {
  if (!bossPositionRef.current || !bossDamageFnRef.current) return;
  const bpos = bossPositionRef.current;
  const toMon = new THREE.Vector3(bpos.x - ppos.x, 0, bpos.z - ppos.z);
  const along = facing.dot(toMon);
  if (along <= 0 || along > maxDist) return;
  if (toMon.lengthSq() - along * along > PROJECTILE_HIT_RADIUS ** 2) return;
  const delay = (along / maxDist) * durationMs;
  const fn = bossDamageFnRef.current;
  setTimeout(() => fn(dmg), delay);
}

function hitBossMelee(ppos: THREE.Vector3, facing: THREE.Vector3, dmg: number) {
  if (!bossPositionRef.current || !bossDamageFnRef.current) return;
  const bpos = bossPositionRef.current;
  const toMon = new THREE.Vector3(bpos.x - ppos.x, 0, bpos.z - ppos.z);
  if (toMon.length() <= SLASH_RANGE && facing.dot(toMon.normalize()) >= 0.5)
    bossDamageFnRef.current(dmg);
}

function hitBossBlastProjectile(
  bx: number,
  bz: number,
  blastRadius: number,
  travelMs: number,
  dmg: number,
) {
  if (!bossPositionRef.current || !bossDamageFnRef.current) return;
  const bpos = bossPositionRef.current;
  const dx = bpos.x - bx;
  const dz = bpos.z - bz;
  if (dx * dx + dz * dz > blastRadius ** 2) return;
  const fn = bossDamageFnRef.current;
  setTimeout(() => fn(dmg), travelMs);
}

function hitBossBlastMelee(ppos: THREE.Vector3, facing: THREE.Vector3, dmg: number) {
  if (!bossPositionRef.current || !bossDamageFnRef.current) return;
  const bpos = bossPositionRef.current;
  const toMon = new THREE.Vector3(bpos.x - ppos.x, 0, bpos.z - ppos.z);
  if (toMon.length() <= BLAST_RANGE && facing.dot(toMon.normalize()) >= BLAST_ARC_COS)
    bossDamageFnRef.current(dmg);
}

// ── 슬래시 발동 ──────────────────────────────────────────────────
function fireSlash(
  ppos: THREE.Vector3,
  facing: THREE.Vector3,
  fxType: SkillFXType | undefined,
  dmg: number,
  hitDelay: number,
) {
  const proj = fxType ? PROJ[fxType] : undefined;

  if (proj) {
    monsterPositions.forEach((mpos, mid) => {
      const toMon = new THREE.Vector3(mpos.x - ppos.x, 0, mpos.z - ppos.z);
      const along = facing.dot(toMon);
      if (along <= 0 || along > proj.maxDist) return;
      if (toMon.lengthSq() - along * along > PROJECTILE_HIT_RADIUS ** 2) return;
      const delay = (along / proj.maxDist) * proj.durationMs;
      setTimeout(() => monsterDamageFns.get(mid)?.(dmg), delay);
    });
    hitBossProjectile(ppos, facing, proj.maxDist, proj.durationMs, dmg);
  } else {
    const fx = facing.clone(); // setTimeout 클로저에서 facing stale 방지
    setTimeout(() => {
      monsterPositions.forEach((mpos, mid) => {
        const toMon = new THREE.Vector3(mpos.x - ppos.x, 0, mpos.z - ppos.z);
        if (toMon.length() > SLASH_RANGE) return;
        if (fx.dot(toMon.normalize()) < 0.5) return;
        monsterDamageFns.get(mid)?.(dmg);
      });
      hitBossMelee(ppos, fx, dmg);
    }, hitDelay);
  }
}

// ── 블래스트 발동 ─────────────────────────────────────────────────
function fireBlast(
  ppos: THREE.Vector3,
  facing: THREE.Vector3,
  fxType: SkillFXType,
  dmg: number,
) {
  const blastProj = BLAST_PROJ[fxType];

  if (blastProj) {
    const bx = ppos.x + facing.x * blastProj.blastDist;
    const bz = ppos.z + facing.z * blastProj.blastDist;
    setTimeout(() => {
      monsterPositions.forEach((mpos, mid) => {
        const dx = mpos.x - bx;
        const dz = mpos.z - bz;
        if (dx * dx + dz * dz > blastProj.blastRadius ** 2) return;
        monsterDamageFns.get(mid)?.(dmg);
      });
      hitBossBlastProjectile(bx, bz, blastProj.blastRadius, 0, dmg);
    }, blastProj.travelMs);
  } else {
    monsterPositions.forEach((mpos, mid) => {
      const toMon = new THREE.Vector3(mpos.x - ppos.x, 0, mpos.z - ppos.z);
      if (toMon.length() > BLAST_RANGE) return;
      if (facing.dot(toMon.normalize()) < BLAST_ARC_COS) return;
      monsterDamageFns.get(mid)?.(dmg);
    });
    hitBossBlastMelee(ppos, facing, dmg);
  }
}

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

      const ppos = playerPositionRef.current.clone(); // 발사 시점 위치 스냅샷
      const pos: [number, number, number] = [ppos.x, ppos.y, ppos.z];
      const facing = playerFacingRef.current;
      const dir: [number, number, number] = [facing.x, facing.y, facing.z];
      const atk = totalAtk();
      const cls = jobClass ?? "warrior";
      const skillLevel = skills.find((sk) => sk?.id === id)?.level ?? 1;

      if (id === "slash") {
        playerAnimSignals.attackCount++;
        playerAnimSignals.attackUntil = Date.now() + SLASH_LOCK_MS;
        const fxType = SLASH_FX_BY_CLASS[cls];
        if (fxType) addFX(fxType, pos, dir);
        const dmg = Math.floor(atk * SLASH_DMG_MULT(skillLevel) + Math.random() * 6);
        fireSlash(ppos, facing, fxType, dmg, SLASH_HIT_DELAY_MS[cls]);
      }

      if (id === "blast") {
        playerAnimSignals.attackCount++;
        playerAnimSignals.attackUntil = Date.now() + BLAST_LOCK_MS;
        const fxType = BLAST_FX_BY_CLASS[cls];
        addFX(fxType, pos, dir);
        const dmg = Math.floor(atk * BLAST_DMG_MULT(skillLevel) + Math.random() * 12);
        fireBlast(ppos, facing, fxType, dmg);
      }

      if (id === "shield") activateShield();
      if (id === "heal") healHp(Math.floor(maxHp * HEAL_PCT(skillLevel)));
      if (id === "dash") dashTrigger.pending = true;
    },
    [triggerSkill, addFX, activateShield, healHp, totalAtk, jobClass, maxHp, skills],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { bindings } = getControlsState();
      // 스킬 슬롯 1-5: controlsStore 바인딩 우선
      const skillActions = ["skill1", "skill2", "skill3", "skill4", "skill5"] as const;
      for (let i = 0; i < skillActions.length; i++) {
        const sk = skills[i];
        if (e.code === bindings[skillActions[i]] && sk) {
          fireSkill(sk.id);
          return;
        }
      }
      // 슬롯 6+ (Q, W, E, R, A, S, D, F): 기존 SKILL_CODES 방식
      const idx = SKILL_CODES.indexOf(e.code as (typeof SKILL_CODES)[number]);
      if (idx === -1 || idx < 5) return;
      const sk = skills[idx];
      if (sk) fireSkill(sk.id);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fireSkill, skills]);
}
