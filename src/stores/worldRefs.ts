import * as THREE from "three";

export const playerPositionRef = { current: new THREE.Vector3() };
export const playerFacingRef = { current: new THREE.Vector3(0, 0, -1) }; // normalized XZ
export const mouseTargetRef = { current: new THREE.Vector3(0, 0, -5) };
export const monsterPositions = new Map<number, THREE.Vector3>();
export const monsterDamageFns = new Map<number, (dmg: number) => void>();
export const respawnTrigger = { pending: false };
export const npcProximity = { isNear: false };
