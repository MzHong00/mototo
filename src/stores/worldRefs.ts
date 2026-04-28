import * as THREE from "three";

export const playerPositionRef = { current: new THREE.Vector3() };
export const playerFacingRef = { current: new THREE.Vector3(0, 0, -1) }; // normalized XZ
export const mouseTargetRef = { current: new THREE.Vector3(0, 0, -5) };
export const monsterPositions = new Map<number, THREE.Vector3>();
export const monsterDamageFns = new Map<number, (dmg: number) => void>();
export const respawnTrigger = { pending: false };
export const bossEnterTrigger = { pending: false };
export const npcProximity = { isNear: false };
export const bossGateProximity = { isNear: false };

export let bossDamageFn: ((dmg: number) => void) | null = null;
export function registerBossDamageFn(fn: ((dmg: number) => void) | null) {
  bossDamageFn = fn;
}

export const bossPositionRef: { current: THREE.Vector3 | null } = { current: null };
