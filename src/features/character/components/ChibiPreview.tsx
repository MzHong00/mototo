import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { useChibiCharacter } from "@/lib/chibi/useChibiCharacter";
import { useChibiAnimations } from "@/lib/chibi/useChibiAnimations";
import { ANIM_FADE_SEC, CHIBI_ANIM } from "@/lib/chibi/assets";

import type { ChibiState } from "@/lib/chibi/character";
import type { ChibiAnim } from "@/lib/chibi/assets";

import s from "./ChibiPreview.module.scss";

// Three.js 조명은 CSS 변수 미지원 — 치비 뷰어와 같은 조명값
const SKY_COLOR = "#ffffff";
const GROUND_COLOR = "#8899aa";
const CAMERA_POS: [number, number, number] = [0.9, 1.6, 5.4];
const TARGET: [number, number, number] = [0, 1.2, 0];
const ZOOM_MIN_DIST = 1.6; // 스크롤 확대 한계 (얼굴·손이 화면을 채우는 정도)
const ZOOM_MAX_DIST = 6.5; // 스크롤 축소 한계

interface ChibiPreviewProps {
  appearance: ChibiState;
  /** 드래그 회전·스크롤 확대 (꾸미기 화면) */
  isRotatable?: boolean;
  /** 반복 재생할 모션 (기본 대기) */
  anim?: ChibiAnim;
}

interface ChibiFigureProps {
  appearance: ChibiState;
  anim: ChibiAnim;
}

/** 고른 모션을 반복하는 치비 */
function ChibiFigure({ appearance, anim }: ChibiFigureProps) {
  const { character } = useChibiCharacter(appearance);
  const actions = useChibiAnimations(character);

  /** 모션이 바뀌면 이전 모션에서 부드럽게 넘어감 */
  useEffect(() => {
    const action = actions[anim];
    action?.reset().fadeIn(ANIM_FADE_SEC).play();
    return () => {
      action?.fadeOut(ANIM_FADE_SEC);
    };
  }, [actions, anim]);

  return character && <primitive object={character.root} />;
}

/** 로비·캐릭터 생성용 치비 미리보기 캔버스 */
export function ChibiPreview({
  appearance,
  isRotatable = false,
  anim = CHIBI_ANIM.IDLE,
}: ChibiPreviewProps) {
  return (
    <Canvas className={s.canvas} flat camera={{ fov: 35, position: CAMERA_POS }}>
      <hemisphereLight args={[SKY_COLOR, GROUND_COLOR, 1.6]} />
      <directionalLight position={[3, 6, 6]} intensity={2.2} />
      <ChibiFigure appearance={appearance} anim={anim} />
      <OrbitControls
        target={TARGET}
        enabled={isRotatable}
        enablePan={false}
        enableZoom={isRotatable}
        minDistance={ZOOM_MIN_DIST}
        maxDistance={ZOOM_MAX_DIST}
        maxPolarAngle={Math.PI * 0.53}
      />
    </Canvas>
  );
}
