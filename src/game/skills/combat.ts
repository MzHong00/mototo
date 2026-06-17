import * as THREE from "three";

import { monsterPositions, monsterDamageFns, bossPosition, bossDamageFn } from "@/game/worldState";
import {
  SLASH_RANGE,
  BLAST_RANGE,
  PROJECTILE_HIT_RADIUS,
  PROJECTILE_PARAMS,
  BLAST_PROJECTILE_PARAMS,
} from "@/constants/skill/combat";

import type { SkillFXType } from "@/types/combat";

// cos(75°) — 전방 75도 부채꼴 범위 내 타격 판정
const BLAST_ARC_COS = 0.26;

// 투사체가 직선 경로 위 목표에 닿는지 체크하고 경로상 거리를 반환 (미적중 시 null)
function calcProjectileAlong(
  from: THREE.Vector3,
  target: THREE.Vector3,
  facing: THREE.Vector3,
  maxDist: number,
): number | null {
  const toTarget = new THREE.Vector3(target.x - from.x, 0, target.z - from.z);
  const along = facing.dot(toTarget);
  if (along <= 0 || along > maxDist) return null;
  if (toTarget.lengthSq() - along * along > PROJECTILE_HIT_RADIUS ** 2) return null;
  return along;
}

// 직선 투사체가 경로상 몬스터·보스에게 거리 비례 딜레이로 데미지 적용
function applyProjectileDamage(
  ppos: THREE.Vector3,
  facing: THREE.Vector3,
  maxDist: number,
  durationMs: number,
  dmg: number,
) {
  monsterPositions.forEach((mpos, mid) => {
    const along = calcProjectileAlong(ppos, mpos, facing, maxDist);
    if (along === null) return;
    setTimeout(() => monsterDamageFns.get(mid)?.(dmg), (along / maxDist) * durationMs);
  });
  const bpos = bossPosition.current;
  const fn = bossDamageFn.current;
  if (!bpos || !fn) return;
  const along = calcProjectileAlong(ppos, bpos, facing, maxDist);
  if (along !== null) setTimeout(() => fn(dmg), (along / maxDist) * durationMs);
}

// 전방 부채꼴 근접 범위 내 몬스터·보스에게 즉시 데미지 적용
function applyMeleeDamage(ppos: THREE.Vector3, facing: THREE.Vector3, dmg: number) {
  monsterPositions.forEach((mpos, mid) => {
    const toMon = new THREE.Vector3(mpos.x - ppos.x, 0, mpos.z - ppos.z);
    if (toMon.length() > SLASH_RANGE || facing.dot(toMon.normalize()) < 0.5) return;
    monsterDamageFns.get(mid)?.(dmg);
  });
  const bpos = bossPosition.current;
  const fn = bossDamageFn.current;
  if (!bpos || !fn) return;
  const toMon = new THREE.Vector3(bpos.x - ppos.x, 0, bpos.z - ppos.z);
  if (toMon.length() <= SLASH_RANGE && facing.dot(toMon.normalize()) >= 0.5) fn(dmg);
}

// 폭발 중심점 반경 내 몬스터·보스에게 즉시 데미지 적용
function applyBlastProjectileDamage(bx: number, bz: number, blastRadius: number, dmg: number) {
  monsterPositions.forEach((mpos, mid) => {
    const dx = mpos.x - bx;
    const dz = mpos.z - bz;
    if (dx * dx + dz * dz > blastRadius ** 2) return;
    monsterDamageFns.get(mid)?.(dmg);
  });
  const bpos = bossPosition.current;
  const fn = bossDamageFn.current;
  if (!bpos || !fn) return;
  const dx = bpos.x - bx;
  const dz = bpos.z - bz;
  if (dx * dx + dz * dz <= blastRadius ** 2) fn(dmg);
}

// 전방 넓은 부채꼴(75°) 근접 범위 내 몬스터·보스에게 즉시 데미지 적용
function applyBlastMeleeDamage(ppos: THREE.Vector3, facing: THREE.Vector3, dmg: number) {
  monsterPositions.forEach((mpos, mid) => {
    const toMon = new THREE.Vector3(mpos.x - ppos.x, 0, mpos.z - ppos.z);
    if (toMon.length() > BLAST_RANGE || facing.dot(toMon.normalize()) < BLAST_ARC_COS) return;
    monsterDamageFns.get(mid)?.(dmg);
  });
  const bpos = bossPosition.current;
  const fn = bossDamageFn.current;
  if (!bpos || !fn) return;
  const toMon = new THREE.Vector3(bpos.x - ppos.x, 0, bpos.z - ppos.z);
  if (toMon.length() <= BLAST_RANGE && facing.dot(toMon.normalize()) >= BLAST_ARC_COS) fn(dmg);
}

// slash 계열 스킬 실행 — fx 설정 시 투사체 판정, 없으면 hitDelay 후 근접 판정
export function fireSlash(
  ppos: THREE.Vector3,
  facing: THREE.Vector3,
  fxType: SkillFXType | undefined,
  dmg: number,
  hitDelay: number,
) {
  const proj = fxType ? PROJECTILE_PARAMS[fxType] : undefined;
  if (proj) {
    applyProjectileDamage(ppos, facing, proj.maxDist, proj.durationMs, dmg);
  } else {
    const fx = facing.clone(); // setTimeout 클로저에서 facing stale 방지
    setTimeout(() => applyMeleeDamage(ppos, fx, dmg), hitDelay);
  }
}

// blast 계열 스킬 실행 — fx 설정 시 travelMs 후 폭발 판정, 없으면 즉시 근접 광역 판정
export function fireBlast(
  ppos: THREE.Vector3,
  facing: THREE.Vector3,
  fxType: SkillFXType,
  dmg: number,
) {
  const blastProj = BLAST_PROJECTILE_PARAMS[fxType];
  if (blastProj) {
    const bx = ppos.x + facing.x * blastProj.blastDist;
    const bz = ppos.z + facing.z * blastProj.blastDist;
    setTimeout(
      () => applyBlastProjectileDamage(bx, bz, blastProj.blastRadius, dmg),
      blastProj.travelMs,
    );
  } else {
    applyBlastMeleeDamage(ppos, facing, dmg);
  }
}
