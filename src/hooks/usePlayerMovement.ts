import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useRapier } from "@react-three/rapier";

import {
  isPressed,
  playerAnimSignals,
  playerFacing,
  playerInput,
  playerPosition,
} from "@/engine/runtime/frameState";
import {
  ACCEL_RATE,
  FALL_THRESHOLD,
  GROUND_PROBE,
  JUMP_VELOCITY,
  PLAYER_HALF_HEIGHT,
  PLAYER_RADIUS,
  RISING_EPS,
  RUN_SPEED,
  SPAWN_POS,
  TURN_RATE,
  WALK_SPEED,
} from "@/constants/game/movement";
import { FRAME_PRIORITY } from "@/constants/game/frame";

import type { RefObject } from "react";
import type { Group } from "three";
import type { RapierRigidBody } from "@react-three/rapier";
import type { Ray } from "@dimforge/rapier3d-compat";

interface UsePlayerMovementParams {
  bodyRef: RefObject<RapierRigidBody | null>;
  modelRef: RefObject<Group | null>;
}

/**
 * 키 입력 → 이동·달리기·점프. 속도와 방향은 치비 뷰어처럼 목표값으로 보간해 부드럽게 바뀐다.
 * 이동 방향은 화면(카메라) 기준이 아니라 월드 축 기준 (카메라가 고정 각도라 동일하게 느껴짐).
 */
export function usePlayerMovement({ bodyRef, modelRef }: UsePlayerMovementParams) {
  const { world, rapier } = useRapier();
  const footRayRef = useRef<Ray | null>(null); // 발밑 착지 판정용 광선 (재사용, 시작점만 갱신)

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
    // 착지 판정: 발밑으로 짧은 광선을 쏴서 바닥이 닿는지 (점프 꼭대기에서 속도 0이어도 공중으로 판정)
    const t = body.translation();
    footRayRef.current ??= new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 });
    const footRay = footRayRef.current;
    footRay.origin = { x: t.x, y: t.y, z: t.z };
    const groundHit = world.castRay(
      footRay,
      PLAYER_HALF_HEIGHT + PLAYER_RADIUS + GROUND_PROBE,
      true,
      undefined,
      undefined,
      undefined,
      body,
    );
    const isGrounded = groundHit !== null && vel.y < RISING_EPS;
    playerAnimSignals.isAirborne = !isGrounded;
    const isAttacking = Date.now() < playerAnimSignals.attackUntil;

    // 목표 속도 (공격 중이면 정지)
    let vx = 0;
    let vz = 0;
    if (isAttacking) {
      playerAnimSignals.isMoving = false;
      playerAnimSignals.isRunning = false;
    } else {
      vx = Number(isPressed("right")) - Number(isPressed("left"));
      vz = Number(isPressed("down")) - Number(isPressed("up"));
      playerAnimSignals.isMoving = vx !== 0 || vz !== 0; // 반대 키 동시 입력이면 0 → 정지
      playerAnimSignals.isRunning = playerAnimSignals.isMoving && isPressed("run");
      if (playerAnimSignals.isMoving) {
        const speed = playerAnimSignals.isRunning ? RUN_SPEED : WALK_SPEED;
        const len = Math.hypot(vx, vz); // 대각선 속도 보정
        vx = (vx / len) * speed;
        vz = (vz / len) * speed;
        playerFacing.current.set(vx, 0, vz).normalize();
      }
    }

    // 가속·감속 보간 + 새로 누른 점프는 착지 상태에서만 1회 (공중에서 누른 건 버림)
    const k = Math.min(1, delta * ACCEL_RATE);
    const isJumping = playerInput.isJumpQueued && isGrounded && !isAttacking;
    playerInput.isJumpQueued = false;
    const vy = isJumping ? JUMP_VELOCITY : vel.y;
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
