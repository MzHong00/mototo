import { useRef } from "react";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";

import { useChibiCharacter } from "@/hooks/useChibiCharacter";
import { useChibiAnimations } from "@/hooks/useChibiAnimations";
import { useCharacterAnimation } from "@/hooks/useCharacterAnimation";
import { usePlayerMovement } from "@/hooks/usePlayerMovement";
import { CHIBI_SCALE, CHIBI_Y_OFFSET } from "@/constants/assets/chibi";
import { SPAWN_POS } from "@/constants/game/movement";

import type { Group } from "three";
import type { RapierRigidBody } from "@react-three/rapier";
import type { ChibiState } from "@/engine/chibi/character";

const COLLIDER_HALF_HEIGHT = 0.35; // 캡슐 원통부 절반 높이
const COLLIDER_RADIUS = 0.25; // 캡슐 반지름

interface PlayerCharacterProps {
  appearance: ChibiState;
}

/** 내 치비 캐릭터 — 물리 몸체 + 모델 + 애니메이션 */
export function PlayerCharacter({ appearance }: PlayerCharacterProps) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const modelRef = useRef<Group>(null);
  const { character } = useChibiCharacter(appearance);
  const actions = useChibiAnimations(character);

  usePlayerMovement({ bodyRef, modelRef });
  useCharacterAnimation(actions);

  return (
    <RigidBody
      ref={bodyRef}
      position={SPAWN_POS}
      enabledRotations={[false, false, false]}
      colliders={false}
    >
      <CapsuleCollider args={[COLLIDER_HALF_HEIGHT, COLLIDER_RADIUS]} />
      <group ref={modelRef}>
        {character && (
          <primitive
            object={character.root}
            scale={CHIBI_SCALE}
            position={[0, CHIBI_Y_OFFSET, 0]}
          />
        )}
      </group>
    </RigidBody>
  );
}
