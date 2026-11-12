import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { useChibiCharacter } from "@/hooks/useChibiCharacter";
import { useChibiAnimations } from "@/hooks/useChibiAnimations";
import { CHIBI_ANIM } from "@/constants/assets/chibi";

import type { ChibiState } from "@/engine/chibi/character";

import s from "./ChibiPreview.module.scss";

// Three.js 조명은 CSS 변수 미지원 — 치비 뷰어와 같은 조명값
const SKY_COLOR = "#ffffff";
const GROUND_COLOR = "#8899aa";
const CAMERA_POS: [number, number, number] = [0.9, 1.6, 5.4];
const TARGET: [number, number, number] = [0, 1.2, 0];

interface ChibiPreviewProps {
  appearance: ChibiState;
  isRotatable?: boolean;
}

interface ChibiFigureProps {
  appearance: ChibiState;
}

/** 대기 모션으로 서 있는 치비 */
function ChibiFigure({ appearance }: ChibiFigureProps) {
  const { character } = useChibiCharacter(appearance);
  const actions = useChibiAnimations(character);

  /** 로드되면 대기 모션 재생 */
  useEffect(() => {
    actions[CHIBI_ANIM.IDLE]?.play();
  }, [actions]);

  return character && <primitive object={character.root} />;
}

/** 로비·캐릭터 생성용 치비 미리보기 캔버스 */
export function ChibiPreview({ appearance, isRotatable = false }: ChibiPreviewProps) {
  return (
    <Canvas className={s.canvas} flat camera={{ fov: 35, position: CAMERA_POS }}>
      <hemisphereLight args={[SKY_COLOR, GROUND_COLOR, 1.6]} />
      <directionalLight position={[3, 6, 6]} intensity={2.2} />
      <ChibiFigure appearance={appearance} />
      <OrbitControls
        target={TARGET}
        enabled={isRotatable}
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI * 0.53}
      />
    </Canvas>
  );
}
