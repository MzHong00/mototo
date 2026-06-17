import * as THREE from "three";

// ── 플레이어 공간 상태 ────────────────────────────────────────────
export const playerPosition = { current: new THREE.Vector3() };
export const playerFacing = { current: new THREE.Vector3(0, 0, -1) }; // normalized XZ
export const playerScreenPos = { x: 0, y: 0 }; // 픽셀 단위 — UI 위치 계산용

// ── 플레이어 전투 상태 ────────────────────────────────────────────
export const playerAnimSignals = {
  hitCount: 0, // 증가할 때마다 Hit_A 트리거
  dashUntil: 0, // 대시 종료 timestamp
  attackCount: 0, // 증가할 때마다 공격 애니메이션 트리거
  attackUntil: 0, // 공격 애니메이션 종료 timestamp — 이동 잠금용
};

let _dmgId = 0;
export const playerDamageEvents: { id: number; amount: number }[] = [];

export function pushPlayerDamage(amount: number) {
  playerDamageEvents.push({ id: _dmgId++, amount });
  playerAnimSignals.hitCount++;
}

// ── 몬스터 레지스트리 ─────────────────────────────────────────────
export const monsterPositions = new Map<number, THREE.Vector3>();
export const monsterDamageFns = new Map<number, (dmg: number) => void>();

// ── 보스 상태 ────────────────────────────────────────────────────
export const bossPosition: { current: THREE.Vector3 | null } = { current: null };
export const bossDamageFn: { current: ((dmg: number) => void) | null } = { current: null };

export function setBossDamageFn(fn: ((dmg: number) => void) | null) {
  bossDamageFn.current = fn;
}

// ── NPC 근접 감지 ─────────────────────────────────────────────────
export const npcProximity = { isNear: false };
