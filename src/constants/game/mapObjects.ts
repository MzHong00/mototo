// 맵 물체 모양 — 에셋이 생기기 전 단순 도형 조합. 같은 종류·부분은 인스턴싱으로 한 번에 그림

export type PartShape = "box" | "cylinder" | "cone" | "sphere" | "ico";

export interface ObjectPart {
  shape: PartShape;
  args: number[]; // 도형 크기 인자 (three.js 지오메트리 인자 순서)
  offset: [number, number, number]; // 물체 원점 기준 위치 (회전 따라 돎)
  color: string;
}

export interface ObjectModel {
  parts: ObjectPart[];
  collider?: { radius: number; height: number }; // 원기둥 충돌체 (없으면 통과)
  isVaried?: boolean; // 위치마다 크기를 조금씩 다르게 (나무·바위)
}

const TRUNK = "#9a6b45";

export const MAP_OBJECTS: Record<string, ObjectModel> = {
  tree: {
    parts: [
      { shape: "cylinder", args: [0.12, 0.18, 1, 6], offset: [0, 0.5, 0], color: TRUNK },
      { shape: "cone", args: [0.9, 1.9, 7], offset: [0, 1.85, 0], color: "#6fae5a" },
    ],
    collider: { radius: 0.3, height: 2 },
    isVaried: true,
  },
  "tree-maple": {
    parts: [
      { shape: "cylinder", args: [0.12, 0.18, 1.1, 6], offset: [0, 0.55, 0], color: TRUNK },
      { shape: "ico", args: [0.95, 0], offset: [0, 1.75, 0], color: "#e27b4b" },
    ],
    collider: { radius: 0.3, height: 2 },
    isVaried: true,
  },
  "tree-palm": {
    parts: [
      { shape: "cylinder", args: [0.1, 0.16, 2.2, 6], offset: [0, 1.1, 0], color: "#b08a5c" },
      { shape: "cone", args: [1.2, 0.6, 6], offset: [0, 2.35, 0], color: "#5fae6b" },
    ],
    collider: { radius: 0.25, height: 2.4 },
    isVaried: true,
  },
  "tree-pine": {
    parts: [
      { shape: "cylinder", args: [0.12, 0.16, 0.8, 6], offset: [0, 0.4, 0], color: TRUNK },
      { shape: "cone", args: [0.7, 2.4, 7], offset: [0, 1.9, 0], color: "#4f8a5c" },
    ],
    collider: { radius: 0.3, height: 2 },
    isVaried: true,
  },
  rock: {
    parts: [{ shape: "ico", args: [0.5, 0], offset: [0, 0.25, 0], color: "#aaa79e" }],
    collider: { radius: 0.45, height: 0.6 },
    isVaried: true,
  },
  gate: {
    parts: [
      { shape: "box", args: [0.6, 3.2, 0.6], offset: [-1.9, 1.6, 0], color: "#5b4a6b" },
      { shape: "box", args: [0.6, 3.2, 0.6], offset: [1.9, 1.6, 0], color: "#5b4a6b" },
      { shape: "box", args: [4.6, 0.6, 0.8], offset: [0, 3.3, 0], color: "#6d5a80" },
    ],
  },
  slime: {
    parts: [{ shape: "sphere", args: [0.45, 12, 8], offset: [0, 0.3, 0], color: "#8fd07a" }],
  },
  elite: {
    parts: [{ shape: "sphere", args: [0.9, 14, 10], offset: [0, 0.7, 0], color: "#9a6ad0" }],
  },
  boss: {
    parts: [
      { shape: "sphere", args: [1.8, 16, 12], offset: [0, 1.4, 0], color: "#d0506a" },
      { shape: "cone", args: [0.7, 0.9, 5], offset: [0, 3.4, 0], color: "#f2c94c" },
    ],
  },
  chest: {
    parts: [{ shape: "box", args: [1, 0.7, 0.7], offset: [0, 0.35, 0], color: "#b07a3c" }],
  },
  ore: {
    parts: [{ shape: "ico", args: [0.55, 0], offset: [0, 0.3, 0], color: "#8a90b8" }],
  },
  campfire: {
    parts: [{ shape: "cone", args: [0.4, 0.8, 6], offset: [0, 0.4, 0], color: "#ff9a3c" }],
  },
};

export const OBJECT_SCALE_VARIATION = 0.3; // 크기 차이 폭 (±15%)
export const EXIT_LABEL_HEIGHT = 2.6; // 출구 이름표 높이 (m)
