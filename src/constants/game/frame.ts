// useFrame 실행 순서 (작을수록 먼저, 0 이하만 사용 — 양수는 R3F 자동 렌더를 끈다)
// 물리 1스텝 → 위치 동기화 → 카메라 → (기본 0) 입력·애니메이션 → 렌더
export const FRAME_PRIORITY = {
  PHYSICS: -50,
  SYNC: -10,
  MAP_EXITS: -8, // 위치 동기화 직후 — 이번 프레임 발밑 칸으로 출구 판정
  CAMERA: -5,
} as const;
