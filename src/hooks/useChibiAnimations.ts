import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { Character } from "@/engine/chibi/character";

/**
 * 치비 애니메이션 믹서를 만들고 매 프레임 갱신한다.
 * 믹서 갱신 뒤 character.update 로 눈 깜빡임·머리 흔들림을 이어서 처리한다.
 */
export function useChibiAnimations(character: Character | null) {
  /** 클립 이름 → 액션 맵 (캐릭터가 바뀔 때만 재생성) */
  const { mixer, actions } = useMemo(() => {
    if (!character) return { mixer: null, actions: {} as Record<string, THREE.AnimationAction> };
    const m = new THREE.AnimationMixer(character.root);
    const map = Object.fromEntries(
      character.animations.map((c) => {
        const a = m.clipAction(c);
        a.clampWhenFinished = true; // 1회성 클립(공격·점프)은 끝난 자세 유지
        return [c.name, a];
      }),
    );
    return { mixer: m, actions: map as Record<string, THREE.AnimationAction> };
  }, [character]);

  useFrame((_, dt) => {
    if (!mixer || !character) return;
    mixer.update(dt);
    character.update(dt);
  });

  return actions;
}
