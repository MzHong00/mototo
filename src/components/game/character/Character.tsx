import { useRef, useEffect, Suspense, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useGLTF, useAnimations, Billboard, Text } from "@react-three/drei";
import * as THREE from "three";

import { CHARACTER_MODELS, WEAPON_MODELS, CHARACTER_ANIMATIONS } from "@/constants/assets/assets";
import { useGameStore } from "@/stores/gameStore";
import { useCharacterAnimation } from "@/hooks/useCharacterAnimation";
import { useCharacterPhysics } from "@/hooks/useCharacterPhysics";
import { Weapon } from "./Weapon";

import type { RapierRigidBody } from "@react-three/rapier";
import type { Class } from "@/types/class";
import type { DmgEntry } from "@/hooks/useCharacterPhysics";

const MODEL_SCALE = 0.6;
const MODEL_Y_OFFSET = -0.6;
// Three.js는 CSS 변수 미지원이므로 파일 내 상수로 추출
const COLOR_FALLBACK_CHAR = "#5BA3FF";
const COLOR_SHIELD = "#4488FF";
const COLOR_DMG_TEXT = "#FF3333";
const COLOR_DMG_OUTLINE = "#000000";

Object.values(CHARACTER_MODELS).forEach((p) => useGLTF.preload(p));
Object.values(CHARACTER_ANIMATIONS).forEach((p) => useGLTF.preload(p));
Object.values(WEAPON_MODELS).forEach(({ mainHand, offHand }) => {
  useGLTF.preload(mainHand);
  if (offHand) useGLTF.preload(offHand);
});

interface CharacterModelProps {
  cls: Class | null;
  groupRef: React.RefObject<THREE.Group | null>;
  isDead: boolean;
}

// ── CharacterModel ───────────────────────────────────────────────
// GLB 모델 렌더링 + 애니메이션 상태 머신. 물리는 부모 Character가 담당.
function CharacterModel({ cls, groupRef, isDead }: CharacterModelProps) {
  const path = cls ? CHARACTER_MODELS[cls] : CHARACTER_MODELS.warrior;
  const { scene } = useGLTF(path);
  const { animations: generalAnims } = useGLTF(CHARACTER_ANIMATIONS.general);
  const { animations: movementAnims } = useGLTF(CHARACTER_ANIMATIONS.movement);
  const { animations: warriorSlashAnims } = useGLTF(CHARACTER_ANIMATIONS.warriorAttack);

  const clips = useMemo(() => {
    // Mixamo GLB의 클립명 "mixamo.com" → "Slash"로 rename해서 병합
    const slashClips = warriorSlashAnims.map((c) => {
      const renamed = c.clone();
      renamed.name = "Slash";
      return renamed;
    });
    return [...generalAnims, ...movementAnims, ...slashClips];
  }, [generalAnims, movementAnims, warriorSlashAnims]);

  const { actions } = useAnimations(clips, groupRef);

  // 애니메이션 상태 머신 — useFrame 구독 포함
  useCharacterAnimation({ actions, isDead, cls });

  const weaponCfg = cls ? WEAPON_MODELS[cls] : null;
  return (
    <>
      <primitive object={scene} scale={MODEL_SCALE} position={[0, MODEL_Y_OFFSET, 0]} />
      {weaponCfg && (
        <Weapon charScene={scene} weaponPath={weaponCfg.mainHand} boneName="handslotr" />
      )}
      {weaponCfg?.offHand && (
        <Weapon charScene={scene} weaponPath={weaponCfg.offHand} boneName="handslotl" />
      )}
    </>
  );
}

// ── Character ────────────────────────────────────────────────────
// 물리 RigidBody 루트. 이동·데미지 수치는 useCharacterPhysics에 위임.
// 실드는 Three.js 직접 조작이므로 로컬 useFrame에서 처리.
export function Character() {
  const bodyRef = useRef<RapierRigidBody>(null);
  const modelGroupRef = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Mesh>(null);
  const shieldMat = useRef<THREE.MeshBasicMaterial>(null);

  const { isDead, cls, isShielded, tickShield } = useGameStore((s) => ({
    isDead: s.isDead,
    cls: s.character.cls,
    isShielded: s.isShielded,
    tickShield: s.tickShield,
  }));

  // useFrame 클로저 stale 방지 — isShielded를 ref로 추적
  const isShieldedRef = useRef(isShielded);
  useEffect(() => {
    isShieldedRef.current = isShielded;
  }, [isShielded]);

  // 물리·이동·데미지 수치 로직 — useFrame 구독 포함
  const { damages } = useCharacterPhysics({ bodyRef, modelGroupRef });

  // 실드 이펙트 — Three.js 직접 조작이므로 props ref 변이 lint 우회를 위해 로컬 유지
  useFrame(({ clock }) => {
    const shield = shieldRef.current;
    const mat = shieldMat.current;
    if (!shield || !mat) return;
    const shielded = isShieldedRef.current;
    shield.visible = shielded;
    if (shielded) {
      mat.opacity = 0.3 + Math.sin(clock.elapsedTime * 4) * 0.1;
      shield.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.04);
      tickShield();
    }
  });

  return (
    <RigidBody
      ref={bodyRef}
      position={[0, 1, 0]}
      enabledRotations={[false, false, false]}
      colliders={false}
    >
      <CuboidCollider args={[0.3, 0.6, 0.3]} />
      <group ref={modelGroupRef}>
        <Suspense
          fallback={
            <mesh castShadow>
              <boxGeometry args={[0.6, 1.2, 0.6]} />
              <meshStandardMaterial color={COLOR_FALLBACK_CHAR} />
            </mesh>
          }
        >
          <CharacterModel cls={cls} groupRef={modelGroupRef} isDead={isDead} />
        </Suspense>
      </group>

      {/* ── 피격 데미지 수치 (3D Billboard) ─────────────────────
           RigidBody 좌표계 기준 y 오프셋으로 렌더링.
           Billboard로 카메라를 항상 향하므로 어떤 각도에서도 잘 보임. */}
      {damages.map((d: DmgEntry) => (
        <Billboard key={d.id} position={[0, d.y, 0]}>
          <Text
            fontSize={0.32}
            color={COLOR_DMG_TEXT}
            outlineWidth={0.05}
            outlineColor={COLOR_DMG_OUTLINE}
            anchorX="center"
            anchorY="middle"
            fillOpacity={d.opacity}
          >
            -{d.amount}
          </Text>
        </Billboard>
      ))}

      {/* ── 실드 이펙트 메시 ───────────────────────────────────── */}
      <mesh ref={shieldRef} visible={false}>
        <sphereGeometry args={[0.9, 16, 12]} />
        <meshBasicMaterial
          ref={shieldMat}
          color={COLOR_SHIELD}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </RigidBody>
  );
}
