// Three.js 재질은 CSS 변수 미지원 — 치비 뷰어 톤에 맞춘 지형 색
export const TILE_SIZE = 1; // 칸 한 변 (m)
export const LEVEL_HEIGHT = 1.2; // 한 층 높이 — 점프(약 1m)로는 못 올라가 경사로로만 이동
export const WATER_DEPTH = 0.5; // 물 칸 바닥이 땅보다 낮은 정도
export const WATER_SURFACE_Y = -0.15; // 바다·연못 수면 높이 (0층 기준)
export const WATER_PLANE_SIZE = 400; // 수면 한 변 — 지도 바깥 바다까지 덮음
export const WATER_OPACITY = 0.82;
export const BLOCKER_HEIGHT = 3; // 물가 투명벽 높이 — 물에 못 들어가게
export const TRIMESH_FLAGS = 144; // rapier TriMeshFlags.FIX_INTERNAL_EDGES (꼭짓점 병합 포함) — 칸 이음매에서 튕기지 않게
export const SHADE_SCALE = 7; // 바닥 얼룩 크기 (m)
export const SHADE_AMOUNT = 0.05; // 바닥 얼룩 밝기 차이

export const TERRAIN_COLORS = {
  g: "#9fd18b", // 풀
  p: "#e3c99a", // 흙길
  s: "#f2e2b3", // 모래
  w: "#8fc9c4", // 물 바닥
  ramp: "#e3c99a", // 경사로 (흙길과 같음)
  cliff: "#b98f62", // 절벽
  bank: "#d9c48f", // 모래 물가 벽
  water: "#6ec3e0", // 수면
} as const;
