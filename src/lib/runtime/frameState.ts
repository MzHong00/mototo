import * as THREE from "three";

import { KEYS } from "@/lib/runtime/keyState";
import { KEY_BINDINGS } from "@/config/controls";

import type { KeyAction } from "@/config/controls";

// ── 매 프레임 공유되는 플레이어 상태 (React 렌더와 무관) ──
export const playerPosition = { current: new THREE.Vector3() };
export const playerFacing = { current: new THREE.Vector3(0, 0, 1) }; // XZ 단위 벡터

export const playerAnimSignals = {
  isAirborne: false, // 공중 여부 — 점프 모션
  isMoving: false, // 실제로 이동 중인지 (반대 방향 키 동시 입력 = 정지)
  isRunning: false, // 달리는 중인지
};

export const playerInput = {
  isJumpQueued: false, // 점프 키를 새로 눌렀음 — 착지 상태에서만 1회 소비
};

export const playerExpression = {
  id: "", // 마지막으로 요청한 표정
  count: 0, // 요청마다 증가 — 같은 표정을 다시 눌러도 재생되게
};

/** 해당 동작의 키 중 하나라도 눌려 있는지 */
export const isPressed = (action: KeyAction): boolean =>
  KEY_BINDINGS[action].some((code) => KEYS.has(code));
