import { useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { isPressed, playerAnimSignals } from "@/engine/runtime/frameState";
import { CHIBI_ANIM, ANIM_FADE_SEC } from "@/constants/assets/chibi";
import { ATTACK_LOCK_MS } from "@/constants/game/movement";

import type { AnimationAction } from "three";

const ATTACK_TIME_SCALE = 1.3; // 공격 클립 배속 (치비 뷰어와 동일)
const JUMP_TIME_SCALE = 0.95; // 점프 클립 배속 (치비 뷰어와 동일)

/**
 * 치비 애니메이션 상태 머신 — 공격 > 점프(공중) > 달리기 > 걷기 > 대기.
 */
export function useCharacterAnimation(actions: Record<string, AnimationAction>) {
  const curAnim = useRef(""); // 현재 재생 중인 클립
  const prevAttackCount = useRef(playerAnimSignals.attackCount); // 마지막으로 처리한 공격 신호
  const attackUntil = useRef(0); // 공격 모션 종료 timestamp

  /** 클립 전환 — loop=false 면 1회 재생 후 마지막 자세 유지 */
  const play = useCallback(
    (name: string, isLoop = true, timeScale = 1) => {
      if (isLoop && curAnim.current === name) return;
      actions[curAnim.current]?.fadeOut(ANIM_FADE_SEC);
      const a = actions[name];
      if (!a) return;
      a.reset()
        .setLoop(isLoop ? THREE.LoopRepeat : THREE.LoopOnce, isLoop ? Infinity : 1)
        .setEffectiveTimeScale(timeScale)
        .fadeIn(ANIM_FADE_SEC)
        .play();
      curAnim.current = name;
    },
    [actions],
  );

  useFrame(() => {
    if (!actions[CHIBI_ANIM.IDLE]) return;

    if (playerAnimSignals.attackCount > prevAttackCount.current) {
      prevAttackCount.current = playerAnimSignals.attackCount;
      attackUntil.current = Date.now() + ATTACK_LOCK_MS;
      play(CHIBI_ANIM.ATTACK, false, ATTACK_TIME_SCALE);
      return;
    }
    if (Date.now() < attackUntil.current) return;

    if (playerAnimSignals.isAirborne) {
      if (curAnim.current !== CHIBI_ANIM.JUMP) play(CHIBI_ANIM.JUMP, false, JUMP_TIME_SCALE);
      return;
    }

    const isMoving =
      isPressed("up") || isPressed("down") || isPressed("left") || isPressed("right");
    if (isMoving && isPressed("run")) play(CHIBI_ANIM.RUN);
    else if (isMoving) play(CHIBI_ANIM.WALK);
    else play(CHIBI_ANIM.IDLE);
  });
}
