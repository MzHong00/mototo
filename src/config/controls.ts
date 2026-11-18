// 조작 키 (치비 뷰어와 동일 — WASD/방향키 이동, Shift 달리기, Space 점프) + N 맵 전체 보기. 키 설정 화면 전 임시 기본값
export const KEY_BINDINGS = {
  up: ["KeyW", "ArrowUp"],
  down: ["KeyS", "ArrowDown"],
  left: ["KeyA", "ArrowLeft"],
  right: ["KeyD", "ArrowRight"],
  run: ["ShiftLeft", "ShiftRight"],
  jump: ["Space"],
  areaMap: ["KeyN"],
} as const;
export const CLOSE_KEY = "Escape"; // 열린 창 닫기 (고정)
export const EXPRESSION_KEYS = ["F1", "F2", "F3", "F4"]; // 순서대로 EXPRESSION_CATALOG 표정 (언제 나올지 정하기 전 임시)
export const EXPRESSION_SEC = 2.5; // 표정 유지 시간 (초)

export type KeyAction = keyof typeof KEY_BINDINGS;

export const CONTROL_HINTS: { keys: string; label: string }[] = [
  { keys: "WASD / ←↑↓→", label: "이동" },
  { keys: "Shift", label: "달리기" },
  { keys: "Space", label: "점프" },
  { keys: "N", label: "맵 전체" },
  { keys: "F1~F4", label: "표정" },
];
