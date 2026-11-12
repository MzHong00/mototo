// 조작 키 (치비 뷰어와 동일 — WASD/방향키 이동, Shift 달리기, Space 점프, J 공격) + M 지도. 키 설정 화면 전 임시 기본값
export const KEY_BINDINGS = {
  up: ["KeyW", "ArrowUp"],
  down: ["KeyS", "ArrowDown"],
  left: ["KeyA", "ArrowLeft"],
  right: ["KeyD", "ArrowRight"],
  run: ["ShiftLeft", "ShiftRight"],
  jump: ["Space"],
  attack: ["KeyJ"],
  map: ["KeyM"],
} as const;
export const CLOSE_KEY = "Escape"; // 열린 창 닫기 (고정)

export type KeyAction = keyof typeof KEY_BINDINGS;

export const CONTROL_HINTS: { keys: string; label: string }[] = [
  { keys: "WASD / ←↑↓→", label: "이동" },
  { keys: "Shift", label: "달리기" },
  { keys: "Space", label: "점프" },
  { keys: "J", label: "공격" },
  { keys: "M", label: "지도" },
];
