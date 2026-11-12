import { useEffect, useMemo, useRef } from "react";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";

import { useChibiCharacter } from "@/hooks/useChibiCharacter";
import { useChibiAnimations } from "@/hooks/useChibiAnimations";
import { useCharacterAnimation } from "@/hooks/useCharacterAnimation";
import { usePlayerMovement } from "@/hooks/usePlayerMovement";
import { getWorldState, useWorldStore } from "@/stores/worldStore";
import { spawnPoint } from "@/utils/maps";
import { CHIBI_SCALE, CHIBI_Y_OFFSET } from "@/constants/assets/chibi";
import { PLAYER_HALF_HEIGHT, PLAYER_RADIUS } from "@/constants/game/movement";

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
  const spawnCount = useWorldStore((st) => st.spawnCount);
  const initialPos = useMemo(() => spawnPoint(getWorldState().location), []); // 처음 놓일 자리 (이후 이동은 아래 effect)
  const { character } = useChibiCharacter(appearance);
  const actions = useChibiAnimations(character);

  usePlayerMovement({ bodyRef, modelRef });
  useCharacterAnimation(actions);

  // 맵에 도착할 때마다 도착 위치로 옮기고 속도 0
  useEffect(() => {
    const body = bodyRef.current;
    if (!body || spawnCount === 0) return;
    const [x, y, z] = spawnPoint(getWorldState().location);
    body.setTranslation({ x, y, z }, true);
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
  }, [spawnCount]);

  return (
    <RigidBody
      ref={bodyRef}
      position={initialPos}
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
