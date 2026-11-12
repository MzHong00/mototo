import { useRef } from "react";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";

import { useChibiCharacter } from "@/hooks/useChibiCharacter";
import { useChibiAnimations } from "@/hooks/useChibiAnimations";
import { useCharacterAnimation } from "@/hooks/useCharacterAnimation";
import { usePlayerMovement } from "@/hooks/usePlayerMovement";
import { CHIBI_SCALE, CHIBI_Y_OFFSET } from "@/constants/assets/chibi";
import { PLAYER_HALF_HEIGHT, PLAYER_RADIUS, SPAWN_POS } from "@/constants/game/movement";

import type { Group } from "three";
import type { RapierRigidBody } from "@react-three/rapier";
import type { ChibiState } from "@/engine/chibi/character";

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
      ccd // 프레임이 길어져도 얇은 지형 충돌면을 뚫고 빠지지 않게
    >
      <CapsuleCollider args={[PLAYER_HALF_HEIGHT, PLAYER_RADIUS]} />
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
