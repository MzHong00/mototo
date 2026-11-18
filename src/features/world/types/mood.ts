import type { TileMapData } from "@/features/world/types/terrain";

export type ParticleKind = "motes";

/** 떠다니는 입자 — 햇살 속 꽃가루·먼지 (플레이어 주변 상자 안에서 반복) */
export interface MoodParticles {
  kind: ParticleKind;
  color: string;
  count: number;
  size: number; // 입자 크기 (m 근사)
}

/** 맵 분위기 — 하늘·안개·빛·입자 */
export interface MapMood {
  sky: string; // 배경(하늘) 색
  fog: { color: string; near: number; far: number };
  hemi: { sky: string; ground: string; intensity: number }; // 하늘빛·땅 반사빛
  sun: { color: string; intensity: number; offset: [number, number, number] }; // 해 색·세기·플레이어 기준 위치
  particles?: MoodParticles;
}

/** 무게를 둔 종류 고르기 (나무 섞기) */
export interface WeightedType {
  type: string;
  weight: number;
}

/** 칸 위 작은 장식 (꽃·풀 등, 충돌 없음) */
export interface DecorRule {
  type: string;
  density: number; // 칸당 확률
  on?: "g" | "s"; // 놓일 바닥 (기본 풀)
}

/** 맵 식생 — 나무 섞기 + 바닥 장식 */
export interface MapFlora {
  trees: WeightedType[];
  decor: DecorRule[];
}

/** 맵 테마 — 분위기 + 지형 색 + 식생을 한 묶음으로 (맵 설계도는 모양만, 테마는 느낌만) */
export interface MapTheme {
  mood: MapMood;
  colors?: TileMapData["colors"]; // 지형 색 덮어쓰기
  flora: MapFlora;
}
