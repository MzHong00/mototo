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
import { getWorldState } from "@/stores/worldStore";
import { spawnPoint } from "@/utils/maps";
import {
  ACCEL_RATE,
  FOOT_REACH,
  AIR_GRACE_SEC,
  FALL_THRESHOLD,
  GROUND_PROBE,
  JUMP_VELOCITY,
  MAX_SNAP_SPEED,
  MIN_GROUND_NORMAL_Y,
  PLAYER_HALF_HEIGHT,
  PLAYER_RADIUS,
  RUN_SPEED,
  SNAP_DISTANCE,
  STEP_HEIGHT,
  STEP_LIFT_SEC,
  STEP_MIN,
  STEP_PROBE,
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
  const isJumpRisingRef = useRef(false); // 점프로 올라가는 중 (경사로를 오를 때 올라가는 속도와 구분)
  const airTimeRef = useRef(0); // 연속으로 떠 있던 시간 (초)
  const wasGroundedRef = useRef(false); // 지난 프레임 착지 여부 — 땅에 붙어 다니기(스냅) 판단용
  const stepRayRef = useRef<Ray | null>(null); // 앞쪽 턱 높이 측정용 광선 (재사용)

  /** 물리 스텝 직후·카메라 직전에 위치 동기화 — 카메라가 이번 프레임 위치를 그대로 따라가게 */
  useFrame(() => {
    const body = bodyRef.current;
    if (!body) return;
    const t = body.translation();
    if (t.y < FALL_THRESHOLD) {
      // 낙하 복구 — 지금 맵의 도착 자리로
      const [x, y, z] = spawnPoint(getWorldState().location);
      body.setTranslation({ x, y, z }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
    playerPosition.current.set(t.x, t.y, t.z);
  }, FRAME_PRIORITY.SYNC);

  /** 입력 → 다음 물리 스텝에 쓸 속도, 모델 회전 */
  useFrame((_, delta) => {
    const body = bodyRef.current;
    if (!body) return;

    const vel = body.linvel();
    // 착지 판정: 발밑으로 광선을 쏴서 바닥까지 거리·기울기를 잰다 (점프 꼭대기에서 속도 0이어도 공중으로 판정)
    const t = body.translation();
    footRayRef.current ??= new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 });
    const footRay = footRayRef.current;
    footRay.origin = { x: t.x, y: t.y, z: t.z };
    const groundHit = world.castRayAndGetNormal(
      footRay,
      PLAYER_HALF_HEIGHT + PLAYER_RADIUS + SNAP_DISTANCE,
      true,
      undefined,
      undefined,
      undefined,
      body,
    );
    if (vel.y <= 0) isJumpRisingRef.current = false; // 꼭대기를 지나면 점프 상승 끝
    const n = groundHit?.normal;
    const isWalkable = groundHit !== null && n !== undefined && n.y > MIN_GROUND_NORMAL_Y;
    // 바닥에서 떠 있는 틈 (경사면에선 캡슐 둥근 바닥 때문에 서 있는 높이가 조금 더 높음)
    const gap = isWalkable
      ? groundHit.timeOfImpact - (PLAYER_HALF_HEIGHT + PLAYER_RADIUS / n.y)
      : 0;
    // 바닥 바로 위거나, 방금까지 땅이었고 아직 가까우면(경사 끝·턱) 착지 — 점프 상승 중은 제외
    const isGrounded =
      isWalkable && !isJumpRisingRef.current && (gap <= GROUND_PROBE || wasGroundedRef.current);
    wasGroundedRef.current = isGrounded;
    // 공중 모션은 점프했거나 잠깐 이상 떠 있을 때만 — 칸 턱·경사 끝에서 순간 뜨는 건 무시
    airTimeRef.current = isGrounded ? 0 : airTimeRef.current + delta;
    playerAnimSignals.isAirborne = isJumpRisingRef.current || airTimeRef.current > AIR_GRACE_SEC;
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
    if (isJumping) isJumpRisingRef.current = true;
    const nextVx = vel.x + (vx - vel.x) * k;
    const nextVz = vel.z + (vz - vel.z) * k;
    // 땅 위에선 바닥 기울기를 따라 이동 + 뜬 틈만큼 끌어내림 — 경사로 꼭대기에서 튀어 오르거나 붕 뜨지 않게
    let vy = vel.y;
    if (isJumping) vy = JUMP_VELOCITY;
    else if (isGrounded && n) {
      const snap = Math.min(Math.max(gap, 0) / delta, MAX_SNAP_SPEED);
      vy = -(n.x * nextVx + n.z * nextVz) / n.y - snap;
    }

    // 낮은 턱 올라서기: 가려는데 막혀 있으면 바로 앞 바닥 높이를 재서 STEP_HEIGHT 이하면 들어 올린다
    const wantSpeed = Math.hypot(vx, vz);
    const isBlocked = isGrounded && wantSpeed > 0 && Math.hypot(vel.x, vel.z) < wantSpeed * 0.5;
    if (isBlocked) {
      const footY = t.y - PLAYER_HALF_HEIGHT - PLAYER_RADIUS;
      const ahead = PLAYER_RADIUS + STEP_PROBE;
      stepRayRef.current ??= new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 });
      const stepRay = stepRayRef.current;
      stepRay.origin = {
        x: t.x + (vx / wantSpeed) * ahead,
        y: footY + STEP_HEIGHT,
        z: t.z + (vz / wantSpeed) * ahead,
      };
      const stepHit = world.castRayAndGetNormal(
        stepRay,
        STEP_HEIGHT,
        true,
        undefined,
        undefined,
        undefined,
        body,
      );
      const rise = stepHit ? STEP_HEIGHT - stepHit.timeOfImpact : 0; // 앞 바닥이 발보다 높은 정도
      if (stepHit && stepHit.normal.y > MIN_GROUND_NORMAL_Y && rise > STEP_MIN) {
        vy = Math.min(rise / STEP_LIFT_SEC, MAX_SNAP_SPEED);
      }
    }
    body.setLinvel({ x: nextVx, y: vy, z: nextVz }, true);

    // 바라보는 방향으로 최단 각도 회전 보간
    const model = modelRef.current;
    if (model) {
      const f = playerFacing.current;
      const diff = Math.atan2(f.x, f.z) - model.rotation.y;
      model.rotation.y +=
        Math.atan2(Math.sin(diff), Math.cos(diff)) * Math.min(1, delta * TURN_RATE);
      // 경사면에선 모델을 살짝 들어 앞발 끝이 비탈에 묻히지 않게 (경사 tan × 발 길이)
      const slopeLift = isGrounded && n ? (FOOT_REACH * Math.sqrt(1 - n.y * n.y)) / n.y : 0;
      model.position.y += (slopeLift - model.position.y) * k;
    }
  });
}
