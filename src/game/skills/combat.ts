import * as THREE from "three";

import {
  monsterPositions,
  monsterDamageFns,
  bossPositionRef,
  bossDamageFnRef,
} from "@/stores/worldRefs";
import {
  SLASH_RANGE,
  BLAST_RANGE,
  PROJECTILE_HIT_RADIUS,
  PROJECTILE_PARAMS,
  BLAST_PROJECTILE_PARAMS,
} from "@/constants/skill/combat";

import type { SkillFXType } from "@/types/combat";

type ProjectileMap = Partial<Record<SkillFXType, { maxDist: number; durationMs: number }>>;
type BlastProjectileMap = Partial<
  Record<SkillFXType, { blastDist: number; travelMs: number; blastRadius: number }>
>;
const PROJ = PROJECTILE_PARAMS as ProjectileMap;
const BLAST_PROJ = BLAST_PROJECTILE_PARAMS as BlastProjectileMap;

// cos(75°) — 전방 75도 부채꼴 범위 내 타격 판정
const BLAST_ARC_COS = 0.26;

export function hitBossProjectile(
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
  const fn = bossDamageFnRef.current;
  setTimeout(() => fn(dmg), (along / maxDist) * durationMs);
}

export function hitBossMelee(ppos: THREE.Vector3, facing: THREE.Vector3, dmg: number) {
  if (!bossPositionRef.current || !bossDamageFnRef.current) return;
  const bpos = bossPositionRef.current;
  const toMon = new THREE.Vector3(bpos.x - ppos.x, 0, bpos.z - ppos.z);
  if (toMon.length() <= SLASH_RANGE && facing.dot(toMon.normalize()) >= 0.5)
    bossDamageFnRef.current(dmg);
}

export function hitBossBlastProjectile(
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

export function hitBossBlastMelee(ppos: THREE.Vector3, facing: THREE.Vector3, dmg: number) {
  if (!bossPositionRef.current || !bossDamageFnRef.current) return;
  const bpos = bossPositionRef.current;
  const toMon = new THREE.Vector3(bpos.x - ppos.x, 0, bpos.z - ppos.z);
  if (toMon.length() <= BLAST_RANGE && facing.dot(toMon.normalize()) >= BLAST_ARC_COS)
    bossDamageFnRef.current(dmg);
}

export function fireSlash(
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
      setTimeout(() => monsterDamageFns.get(mid)?.(dmg), (along / proj.maxDist) * proj.durationMs);
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

export function fireBlast(
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
