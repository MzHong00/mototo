import * as THREE from "three";

import { KEYS } from "@/engine/runtime/keyState";
import { KEY_BINDINGS } from "@/constants/ui/controls";

import type { KeyAction } from "@/constants/ui/controls";

// ── 매 프레임 공유되는 플레이어 상태 (React 렌더와 무관) ──
export const playerPosition = { current: new THREE.Vector3() };
export const playerFacing = { current: new THREE.Vector3(0, 0, 1) }; // XZ 단위 벡터

export const playerAnimSignals = {
  attackCount: 0, // 증가할 때마다 공격 모션
  attackUntil: 0, // 공격 종료 timestamp — 이동 잠금
  isAirborne: false, // 공중 여부 — 점프 모션
};

/** 해당 동작의 키 중 하나라도 눌려 있는지 */
export const isPressed = (action: KeyAction): boolean =>
  KEY_BINDINGS[action].some((code) => KEYS.has(code));
