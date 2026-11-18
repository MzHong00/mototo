export const CHIBI_ASSET_BASE = "/chibi/"; // chibi.glb·parts·thumbs 위치 (public/chibi, scripts/sync_game.sh 로 동기화)
export const CHIBI_SCALE = 0.8; // 게임 월드 기준 치비 크기 (키 ≈ 2)
export const CHIBI_Y_OFFSET = -0.6; // 콜라이더 바닥에 발을 맞추는 오프셋
export const CHIBI_ANIM = {
  IDLE: "Idle",
  WALK: "Walk",
  RUN: "Run",
  JUMP: "Jump",
} as const;
export type ChibiAnim = (typeof CHIBI_ANIM)[keyof typeof CHIBI_ANIM];
export const CHIBI_ANIM_LABEL: Record<ChibiAnim, string> = {
  Idle: "대기",
  Walk: "걷기",
  Run: "달리기",
  Jump: "점프",
}; // 꾸미기 화면 모션 미리보기 버튼
export const ANIM_FADE_SEC = 0.18; // 애니메이션 전환 페이드
