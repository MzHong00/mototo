import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment } from "@react-three/drei";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

import { CHARACTER_MODELS, CHARACTER_ANIMATIONS, WEAPON_MODELS } from "@/constants/character";
import { Weapon } from "./Weapon";

import type { JobClass } from "@/types/job";

const PREVIEW_MODEL_SCALE = 0.55;
const PREVIEW_MODEL_Y_OFFSET = -0.8;
const CAMERA_POSITION: [number, number, number] = [0, 0, 3.5];
const CAMERA_FOV = 35;
// Three.js는 CSS 변수 미지원이므로 파일 내 상수로 추출
const COLOR_LIGHT_FILL = "#a0c8ff";
const COLOR_LIGHT_RIM = "#74b9e8";

interface PreviewModelProps {
  jobClass: JobClass;
  rotationRef: React.RefObject<number>;
  showWeapon: boolean;
}

function PreviewModel({ jobClass, rotationRef, showWeapon }: PreviewModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene: rawScene } = useGLTF(CHARACTER_MODELS[jobClass]);
  // SkeletonUtils.clone — 게임 씬과 GLB 공유 없이 독립 인스턴스 보장
  const charScene = useMemo(() => SkeletonUtils.clone(rawScene) as THREE.Group, [rawScene]);

  const { animations: generalAnims } = useGLTF(CHARACTER_ANIMATIONS.general);
  const { animations: movementAnims } = useGLTF(CHARACTER_ANIMATIONS.movement);
  const clips = useMemo(() => [...generalAnims, ...movementAnims], [generalAnims, movementAnims]);

  const { actions } = useAnimations(clips, groupRef);

  useEffect(() => {
    const idle = actions["Idle_A"];
    if (!idle) return;
    idle.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    return () => {
      idle.stop();
    };
  }, [actions]);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y = rotationRef.current;
  });

  const weaponCfg = showWeapon ? WEAPON_MODELS[jobClass] : null;

  return (
    <group ref={groupRef}>
      <primitive
        object={charScene}
        scale={PREVIEW_MODEL_SCALE}
        position={[0, PREVIEW_MODEL_Y_OFFSET, 0]}
      />
      {weaponCfg && (
        <Weapon charScene={charScene} weaponPath={weaponCfg.mainHand} boneName="handslotr" />
      )}
      {weaponCfg?.offHand && (
        <Weapon charScene={charScene} weaponPath={weaponCfg.offHand} boneName="handslotl" />
      )}
    </group>
  );
}

export interface CharacterPreviewProps {
  jobClass: JobClass;
  rotatable?: boolean;
  showWeapon?: boolean;
  onDragStart?: () => void;
}

export function CharacterPreview({
  jobClass,
  rotatable = true,
  showWeapon = true,
  onDragStart,
}: CharacterPreviewProps) {
  const rotationRef = useRef<number>(0);
  const dragRef = useRef<{ active: boolean; lastX: number }>({ active: false, lastX: 0 });

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!rotatable) return;
      dragRef.current = { active: true, lastX: e.clientX };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      onDragStart?.();
    },
    [rotatable, onDragStart],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!rotatable || !dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.lastX;
      dragRef.current.lastX = e.clientX;
      rotationRef.current += dx * 0.01;
    },
    [rotatable],
  );

  const onPointerUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  return (
    <div
      style={{ width: "100%", height: "100%", cursor: rotatable ? "grab" : "default" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <Canvas
        camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 3]} intensity={1.4} castShadow />
        <directionalLight position={[-2, 2, -2]} intensity={0.4} color={COLOR_LIGHT_FILL} />
        <pointLight position={[0, 3, 1]} intensity={0.8} color={COLOR_LIGHT_RIM} />
        <Suspense fallback={null}>
          {/* key={jobClass}: jobClass가 바뀌면 PreviewModel을 완전히 재마운트해서
              AnimationMixer가 새 skeleton의 bone을 올바르게 참조하도록 강제 */}
          <PreviewModel
            key={jobClass}
            jobClass={jobClass}
            rotationRef={rotationRef}
            showWeapon={showWeapon}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
