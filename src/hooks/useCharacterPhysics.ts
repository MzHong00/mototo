import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import {
  playerPositionRef,
  playerFacingRef,
  playerScreenPos,
  playerDamageEvents,
  respawnTrigger,
  bossEnterTrigger,
  portalTravelTrigger,
  dashTrigger,
  playerAnimSignals,
} from "@/stores/worldRefs";
import { KEYS } from "@/utils/keyState";
import { getControlsState } from "@/stores/controlsStore";
import { useGameStore } from "@/stores/gameStore";
import { MAPS } from "@/constants/maps";

import type { RefObject } from "react";
import type { RapierRigidBody } from "@react-three/rapier";

const SPEED = 5;
const DASH_SPEED = 24;
const DASH_DURATION_MS = 220;
const DMG_FLOAT_SPEED = 0.025;
const DMG_FADE_SPEED = 0.022;
const DMG_Y_START = 1.8;
const FALL_THRESHOLD = -3; // 이 y 이하로 떨어지면 현재 맵 스폰 좌표로 복구

/** 화면에 표시 중인 피격 데미지 수치 1개 (KingBearBoss와 동일한 구조) */
export interface DmgEntry {
  id: number;
  amount: number;
  y: number;
  opacity: number;
}

interface UseCharacterPhysicsParams {
  bodyRef: RefObject<RapierRigidBody | null>;
  modelGroupRef: RefObject<THREE.Group | null>;
}

export function useCharacterPhysics({ bodyRef, modelGroupRef }: UseCharacterPhysicsParams) {
  const dashUntil = useRef(0);
  const [damages, setDamages] = useState<DmgEntry[]>([]);
  const hasDamages = useRef(false);

  const isDead = useGameStore((s) => s.isDead);
  const currentMapId = useGameStore((s) => s.currentMapId);

  // useFrame 클로저 stale 방지 — currentMapId를 ref로 추적
  const currentMapIdRef = useRef(currentMapId);
  useEffect(() => {
    currentMapIdRef.current = currentMapId;
  }, [currentMapId]);

  useFrame(({ camera, size }) => {
    const body = bodyRef.current;
    if (!body) return;

    // ── 트리거 처리 ────────────────────────────────────────────
    if (respawnTrigger.pending) {
      const [px, py, pz] = MAPS[currentMapIdRef.current].spawnPos;
      body.setTranslation({ x: px, y: py, z: pz }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      respawnTrigger.pending = false;
    }
    if (bossEnterTrigger.pending) {
      const [px, py, pz] = MAPS.kingBearChamber.spawnPos;
      body.setTranslation({ x: px, y: py, z: pz }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      bossEnterTrigger.pending = false;
    }
    if (portalTravelTrigger.pending) {
      const [px, py, pz] = portalTravelTrigger.spawnPos;
      body.setTranslation({ x: px, y: py, z: pz }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      portalTravelTrigger.pending = false;
    }
    if (dashTrigger.pending) {
      const until = Date.now() + DASH_DURATION_MS;
      dashUntil.current = until;
      playerAnimSignals.dashUntil = until;
      dashTrigger.pending = false;
    }

    // ── 낙하 복구 — 현재 맵 스폰 좌표로 이동 ─────────────────
    const pos = body.translation();
    if (pos.y < FALL_THRESHOLD) {
      const [px, py, pz] = MAPS[currentMapIdRef.current].spawnPos;
      body.setTranslation({ x: px, y: py, z: pz }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    // ── 위치 갱신 (isDead 무관 — miniMap 등 위치 의존 UI 대응) ──
    const t = body.translation();
    playerPositionRef.current.set(t.x, t.y, t.z);
    // playerScreenPos: 픽셀 단위 (size.width/height 기준) — UI 위치 계산용
    const projected = playerPositionRef.current.clone().project(camera);
    playerScreenPos.x = (projected.x * 0.5 + 0.5) * size.width;
    playerScreenPos.y = (-projected.y * 0.5 + 0.5) * size.height;

    if (isDead) return;

    // ── 이동 ───────────────────────────────────────────────────
    const vel = body.linvel();
    const now = Date.now();
    const isDashing = now < dashUntil.current;
    const isAttacking = now < playerAnimSignals.attackUntil;

    if (isDashing) {
      const f = playerFacingRef.current;
      body.setLinvel({ x: f.x * DASH_SPEED, y: vel.y, z: f.z * DASH_SPEED }, true);
    } else if (isAttacking) {
      body.setLinvel({ x: 0, y: vel.y, z: 0 }, true);
    } else {
      const b = getControlsState().bindings;
      let vx = 0,
        vz = 0;
      if (KEYS.has(b.moveUp)) vz -= SPEED;
      if (KEYS.has(b.moveDown)) vz += SPEED;
      if (KEYS.has(b.moveLeft)) vx -= SPEED;
      if (KEYS.has(b.moveRight)) vx += SPEED;

      body.setLinvel({ x: vx, y: vel.y, z: vz }, true);

      if (vx !== 0 || vz !== 0) {
        playerFacingRef.current.set(vx, 0, vz).normalize();
        if (modelGroupRef.current) modelGroupRef.current.rotation.y = Math.atan2(vx, vz);
      }
    }

    // ── 피격 이벤트 소비 + 데미지 수치 페이드 (단일 setState) ──
    // newEntries 추가와 페이드 업데이트를 합쳐 동일 프레임 이중 렌더 방지.
    const hasNewEvents = playerDamageEvents.length > 0;
    const hasExisting = hasDamages.current;
    if (hasNewEvents || hasExisting) {
      setDamages((prev) => {
        const incoming: DmgEntry[] = [];
        while (playerDamageEvents.length > 0) {
          const e = playerDamageEvents.shift()!;
          incoming.push({ id: e.id, amount: e.amount, y: DMG_Y_START, opacity: 1 });
        }
        const next = [
          ...prev
            .map((d) => ({ ...d, y: d.y + DMG_FLOAT_SPEED, opacity: d.opacity - DMG_FADE_SPEED }))
            .filter((d) => d.opacity > 0),
          ...incoming,
        ];
        hasDamages.current = next.length > 0;
        return incoming.length === 0 && next.length === 0 ? prev : next;
      });
    }
  });

  return { damages };
}
