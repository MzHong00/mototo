import * as THREE from "three";

export const playerPositionRef = { current: new THREE.Vector3() };
export const playerFacingRef = { current: new THREE.Vector3(0, 0, -1) }; // normalized XZ
export const mouseTargetRef = { current: new THREE.Vector3(0, 0, -5) };
export const monsterPositions = new Map<number, THREE.Vector3>();
export const monsterDamageFns = new Map<number, (dmg: number) => void>();
export const respawnTrigger = { pending: false };
export const bossEnterTrigger = { pending: false };
export const portalTravelTrigger: { pending: boolean; spawnPos: [number, number, number] } = {
  pending: false,
  spawnPos: [0, 1, 0],
};
export const dashTrigger = { pending: false };

// 플레이어 피격 데미지 이벤트 큐
let _dmgId = 0;
export const playerDamageEvents: { id: number; amount: number }[] = [];

// 캐릭터 애니메이션 신호 — CharacterModel의 useFrame이 읽음
export const playerAnimSignals = {
  hitCount: 0, // 증가할 때마다 Hit_A 트리거
  dashUntil: 0, // 대시 종료 timestamp
  attackCount: 0, // 증가할 때마다 공격 애니메이션 트리거
  attackUntil: 0, // 공격 애니메이션 종료 timestamp — 이동 잠금용
};

export function pushPlayerDamage(amount: number) {
  playerDamageEvents.push({ id: _dmgId++, amount });
  playerAnimSignals.hitCount++;
}
export const npcProximity = { isNear: false };
export const bossGateProximity = { isNear: false };

export const bossDamageFnRef: { current: ((dmg: number) => void) | null } = { current: null };
export function registerBossDamageFn(fn: ((dmg: number) => void) | null) {
  bossDamageFnRef.current = fn;
}

export function consumePlayerDamageEvents(): { id: number; amount: number }[] {
  const events = [...playerDamageEvents];
  playerDamageEvents.length = 0;
  return events;
}

export const bossPositionRef: { current: THREE.Vector3 | null } = { current: null };

export const playerScreenPos = { x: 0, y: 0 }; // 픽셀 단위 (size.width/height 기준) — UI 위치 계산용
