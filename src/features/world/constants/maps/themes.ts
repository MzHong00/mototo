import type { MapTheme } from "@/features/world/types/mood";

/** 중립 테마 — 맑은 낮. 역 맵 테마가 생기기 전까지 모든 맵이 함께 씀 */
export const NEUTRAL_THEME: MapTheme = {
  mood: {
    sky: "#d4ecf7",
    fog: { color: "#d4ecf7", near: 20, far: 55 },
    hemi: { sky: "#ffffff", ground: "#8899aa", intensity: 1.6 },
    sun: { color: "#fff6e4", intensity: 2.2, offset: [5, 10, 6] },
    particles: { kind: "motes", color: "#ffffff", count: 60, size: 0.08 },
  },
  flora: {
    trees: [
      { type: "tree", weight: 3 },
      { type: "tree-oak", weight: 2 },
      { type: "tree-pine", weight: 1 },
    ],
    decor: [
      { type: "grass-tuft", density: 0.04 },
      { type: "flower-yellow", density: 0.01 },
      { type: "flower-white", density: 0.01 },
      { type: "bush", density: 0.01 },
    ],
  },
};
