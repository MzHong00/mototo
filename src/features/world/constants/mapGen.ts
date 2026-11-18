// 설계도 → 칸 지도 변환 수치
export const RAMP_LENGTH = 3; // 자동 경사로 길이 (칸) — 한 층(1.2m)을 3칸에 걸쳐 오름 (약 22°)
export const FOREST_DENSITY = 0.3; // 숲 안 칸당 나무 확률
export const SPARSE_TREE_DENSITY = 0.025; // 숲 밖 칸당 나무 확률
export const ROCK_DENSITY = 0.006; // 칸당 바위 확률
export const TREE_PATH_CLEARANCE = 2; // 길·표시에서 이만큼 떨어진 곳에만 나무
export const TREE_JITTER = 0.5; // 나무 위치 흔들림 (칸)
export const DECOR_JITTER = 0.6; // 바닥 장식 위치 흔들림 (칸)
export const DECOR_PROP_CLEARANCE = 2; // 고정 물체 주변 장식 비움 (칸)
