import { useFrame } from "@react-three/fiber";

import {
  isPressed,
  playerAnimSignals,
  playerFacing,
  playerPosition,
} from "@/engine/runtime/frameState";
import {
  ACCEL_RATE,
  FALL_THRESHOLD,
  GROUNDED_EPS,
  JUMP_VELOCITY,
  RUN_SPEED,
  SPAWN_POS,
  TURN_RATE,
  WALK_SPEED,
} from "@/constants/game/movement";
import { FRAME_PRIORITY } from "@/constants/game/frame";

import type { RefObject } from "react";
import type { Group } from "three";
import type { RapierRigidBody } from "@react-three/rapier";

interface UsePlayerMovementParams {
  bodyRef: RefObject<RapierRigidBody | null>;
  modelRef: RefObject<Group | null>;
}

/**
 * 키 입력 → 이동·달리기·점프. 속도와 방향은 치비 뷰어처럼 목표값으로 보간해 부드럽게 바뀐다.
 * 이동 방향은 화면(카메라) 기준이 아니라 월드 축 기준 (카메라가 고정 각도라 동일하게 느껴짐).
 */
export function usePlayerMovement({ bodyRef, modelRef }: UsePlayerMovementParams) {
  /** 물리 스텝 직후·카메라 직전에 위치 동기화 — 카메라가 이번 프레임 위치를 그대로 따라가게 */
  useFrame(() => {
    const body = bodyRef.current;
    if (!body) return;
    const t = body.translation();
    if (t.y < FALL_THRESHOLD) {
      // 낙하 복구
      body.setTranslation({ x: SPAWN_POS[0], y: SPAWN_POS[1], z: SPAWN_POS[2] }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
    playerPosition.current.set(t.x, t.y, t.z);
  }, FRAME_PRIORITY.SYNC);

  /** 입력 → 다음 물리 스텝에 쓸 속도, 모델 회전 */
  useFrame((_, delta) => {
    const body = bodyRef.current;
    if (!body) return;

    const vel = body.linvel();
    const isGrounded = Math.abs(vel.y) < GROUNDED_EPS;
    playerAnimSignals.isAirborne = !isGrounded;
    const isAttacking = Date.now() < playerAnimSignals.attackUntil;

    // 목표 속도 (공격 중이면 정지)
    let vx = 0;
    let vz = 0;
    if (!isAttacking) {
      vx = Number(isPressed("right")) - Number(isPressed("left"));
      vz = Number(isPressed("down")) - Number(isPressed("up"));
      if (vx !== 0 || vz !== 0) {
        const speed = isPressed("run") ? RUN_SPEED : WALK_SPEED;
        const len = Math.hypot(vx, vz); // 대각선 속도 보정
        vx = (vx / len) * speed;
        vz = (vz / len) * speed;
        playerFacing.current.set(vx, 0, vz).normalize();
      }
    }

    // 가속·감속 보간 + 착지 상태에서만 점프
    const k = Math.min(1, delta * ACCEL_RATE);
    const vy = isGrounded && !isAttacking && isPressed("jump") ? JUMP_VELOCITY : vel.y;
    body.setLinvel({ x: vel.x + (vx - vel.x) * k, y: vy, z: vel.z + (vz - vel.z) * k }, true);

    // 바라보는 방향으로 최단 각도 회전 보간
    const model = modelRef.current;
    if (model) {
      const f = playerFacing.current;
      const diff = Math.atan2(f.x, f.z) - model.rotation.y;
      model.rotation.y +=
        Math.atan2(Math.sin(diff), Math.cos(diff)) * Math.min(1, delta * TURN_RATE);
    }
  });
}
