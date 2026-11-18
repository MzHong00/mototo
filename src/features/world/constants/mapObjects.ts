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

// 나무·바위 — 충돌 있음
const SOLID_OBJECTS: Record<string, ObjectModel> = {
  tree: {
    parts: [
      { shape: "cylinder", args: [0.12, 0.18, 1, 6], offset: [0, 0.5, 0], color: TRUNK },
      { shape: "cone", args: [0.9, 1.9, 7], offset: [0, 1.85, 0], color: "#6fae5a" },
    ],
    collider: { radius: 0.3, height: 2 },
    isVaried: true,
  },
  "tree-oak": {
    parts: [
      { shape: "cylinder", args: [0.14, 0.2, 1.1, 6], offset: [0, 0.55, 0], color: TRUNK },
      { shape: "ico", args: [1, 0], offset: [0, 1.75, 0], color: "#5f9e4a" },
      { shape: "ico", args: [0.6, 0], offset: [0.35, 2.3, 0.15], color: "#7dbb5e" },
    ],
    collider: { radius: 0.3, height: 2 },
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
};

/** 꽃 무더기 — 같은 모양에 색만 다르게 */
const flowers = (color: string): ObjectModel => ({
  parts: [
    { shape: "sphere", args: [0.08, 6, 4], offset: [0.12, 0.14, 0.05], color },
    { shape: "sphere", args: [0.08, 6, 4], offset: [-0.1, 0.1, 0.12], color },
    { shape: "sphere", args: [0.08, 6, 4], offset: [0.02, 0.12, -0.14], color },
    { shape: "cone", args: [0.18, 0.12, 5], offset: [0, 0.05, 0], color: "#5d9a4c" },
  ],
  isVaried: true,
});

// 바닥 장식 — 충돌 없음, 칸마다 확률로 뿌림
const DECOR: Record<string, ObjectModel> = {
  bush: {
    parts: [
      { shape: "ico", args: [0.42, 0], offset: [0, 0.3, 0], color: "#5c9a48" },
      { shape: "ico", args: [0.3, 0], offset: [0.3, 0.22, 0.1], color: "#6eae55" },
    ],
    isVaried: true,
  },
  "flower-yellow": flowers("#ffd84a"),
  "flower-white": flowers("#fbf7ee"),
  "grass-tuft": {
    parts: [
      { shape: "cone", args: [0.05, 0.45, 4], offset: [0, 0.22, 0], color: "#6aa857" },
      { shape: "cone", args: [0.04, 0.35, 4], offset: [0.1, 0.17, 0.06], color: "#6aa857" },
      { shape: "cone", args: [0.04, 0.32, 4], offset: [-0.08, 0.16, -0.07], color: "#6aa857" },
    ],
    isVaried: true,
  },
};

export const MAP_OBJECTS: Record<string, ObjectModel> = { ...SOLID_OBJECTS, ...DECOR };

export const OBJECT_SCALE_VARIATION = 0.3; // 크기 차이 폭 (±15%)
export const EXIT_LABEL_HEIGHT = 2.6; // 출구 이름표 높이 (m)
