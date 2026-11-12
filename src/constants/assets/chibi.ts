export const CHIBI_ASSET_BASE = "/chibi/"; // chibi.glb·parts·thumbs 위치 (public/chibi, scripts/sync_game.sh 로 동기화)
export const CHIBI_SCALE = 0.8; // 게임 월드 기준 치비 크기 (키 ≈ 2)
export const CHIBI_Y_OFFSET = -0.6; // 콜라이더 바닥에 발을 맞추는 오프셋
export const CHIBI_ANIM = {
  IDLE: "Idle",
  WALK: "Walk",
  RUN: "Run",
  JUMP: "Jump",
  ATTACK: "Attack",
} as const;
export const ANIM_FADE_SEC = 0.18; // 애니메이션 전환 페이드
