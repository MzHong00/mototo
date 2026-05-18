import { useRef, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { playerAnimSignals } from "@/stores/worldRefs";
import { KEYS } from "@/utils/keyState";
import { getControlsState } from "@/stores/controlsStore";

import type { AnimationAction } from "three";
import type { JobClass } from "@/types/job";

const HIT_ANIM_MS = 700;

// 직업별 공격 애니메이션 이름·재생 시간·배속
// timeScale = 원본 클립 길이(ms) / 원하는 재생 시간(ms)
const ATTACK_ANIM: Record<JobClass, { name: string; ms: number; timeScale: number }> = {
  warrior: { name: "Slash", ms: 500, timeScale: 2 }, // 1500ms 클립 → 500ms에 완주
  archer: { name: "Throw", ms: 500, timeScale: 1 },
  mage: { name: "Throw", ms: 500, timeScale: 1 },
  rogue: { name: "Throw", ms: 500, timeScale: 1 },
};

type AnimActions = Record<string, AnimationAction | null>;

interface UseCharacterAnimationParams {
  actions: AnimActions;
  isDead: boolean;
  jobClass: JobClass | null;
}

export function useCharacterAnimation({ actions, isDead, jobClass }: UseCharacterAnimationParams) {
  const curAnim = useRef("");
  const prevHitCount = useRef(playerAnimSignals.hitCount);
  const prevAttackCount = useRef(playerAnimSignals.attackCount);
  const hitUntil = useRef(0);
  const attackUntil = useRef(0);

  useEffect(() => {
    const attackName = jobClass ? ATTACK_ANIM[jobClass].name : "Throw";
    const ONCE_ANIMS = ["Death_A", "Hit_A", attackName];
    ONCE_ANIMS.forEach((name) => {
      const a = actions[name];
      if (a) a.clampWhenFinished = true;
    });
  }, [actions, jobClass]);

  // useCallback으로 감싸 매 렌더마다 함수 재생성 방지
  const playLoop = useCallback(
    (name: string) => {
      if (curAnim.current === name) return;
      actions[curAnim.current]?.fadeOut(0.15);
      const a = actions[name];
      if (!a) return;
      a.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.15).play();
      curAnim.current = name;
    },
    [actions],
  );

  const playOnce = useCallback(
    (name: string, timeScale = 1) => {
      actions[curAnim.current]?.fadeOut(0.1);
      const a = actions[name];
      if (!a) return;
      a.reset().setLoop(THREE.LoopOnce, 1).setEffectiveTimeScale(timeScale).fadeIn(0.1).play();
      curAnim.current = name;
    },
    [actions],
  );

  useFrame(() => {
    if (!actions.Idle_A) return;

    if (isDead) {
      if (curAnim.current !== "Death_A") playOnce("Death_A");
      return;
    }

    if (playerAnimSignals.hitCount > prevHitCount.current) {
      prevHitCount.current = playerAnimSignals.hitCount;
      if (Date.now() >= attackUntil.current) {
        hitUntil.current = Date.now() + HIT_ANIM_MS;
        playOnce("Hit_A");
        return;
      }
    }
    if (Date.now() < hitUntil.current) return;

    if (playerAnimSignals.attackCount > prevAttackCount.current) {
      prevAttackCount.current = playerAnimSignals.attackCount;
      const atk = jobClass ? ATTACK_ANIM[jobClass] : ATTACK_ANIM.archer;
      attackUntil.current = Date.now() + atk.ms;
      playOnce(atk.name, atk.timeScale);
      return;
    }
    if (Date.now() < attackUntil.current) return;

    const b = getControlsState().bindings;
    const moving =
      KEYS.has(b.moveUp) || KEYS.has(b.moveDown) || KEYS.has(b.moveLeft) || KEYS.has(b.moveRight);
    const dashing = Date.now() < playerAnimSignals.dashUntil;

    if (dashing) playLoop("Running_A");
    else if (moving) playLoop("Walking_A");
    else playLoop("Idle_A");
  });
}
