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
export function pushPlayerDamage(amount: number) {
  playerDamageEvents.push({ id: _dmgId++, amount });
}
export const npcProximity = { isNear: false };
export const bossGateProximity = { isNear: false };

export let bossDamageFn: ((dmg: number) => void) | null = null;
export function registerBossDamageFn(fn: ((dmg: number) => void) | null) {
  bossDamageFn = fn;
}

export const bossPositionRef: { current: THREE.Vector3 | null } = { current: null };

export const playerScreenPos = { x: 0.5, y: 0.5 }; // normalized (0~1)
