import type { MapSpec } from "@/types/world";

/** 에버그린 마을 144×144 — 따뜻한 숲 마을. 북 선착장 · 동 블루 코브 · 서 단풍골 · 북서 숲에 도토리 숲굴 */
export const EVERGREEN: MapSpec = {
  id: "evergreen",
  name: "에버그린 마을",
  kind: "main",
  dungeonId: "acorn-hollow",
  exits: [
    { mark: "A", to: { map: "start-island", entry: "1" }, mode: "boat", label: "⛵ 첫걸음 섬" },
    { mark: "B", to: { map: "bluecove", entry: "1" }, mode: "walk", label: "블루 코브 항구 →" },
    { mark: "C", to: { map: "danpung", entry: "1" }, mode: "walk", label: "← 단풍골 마을" },
    {
      mark: "D",
      to: { map: "acorn-hollow/r0", entry: "1" },
      mode: "dungeon",
      label: "⚔ 도토리 숲굴",
    },
  ],
  blueprint: {
    id: "evergreen",
    width: 144,
    depth: 144,
    seed: 11,
    coast: 0.85,
    paints: [
      { area: { rect: [14, 22, 30, 30] }, level: 1 },
      { area: { rect: [94, 18, 36, 34] }, level: 1 },
      { area: { rect: [112, 24, 14, 12] }, level: 2 },
      { area: { circle: [106, 104, 10] }, kind: "w" },
      { area: { circle: [40, 104, 6] }, kind: "w" },
      { area: { rect: [60, 60, 25, 25] }, kind: "r" },
    ],
    paths: [
      {
        points: [
          [72, 72],
          [72, 0],
        ],
        width: 3,
      },
      {
        points: [
          [72, 72],
          [143, 72],
        ],
        width: 3,
      },
      {
        points: [
          [72, 72],
          [0, 72],
        ],
        width: 3,
      },
      {
        points: [
          [72, 36],
          [30, 36],
        ],
        width: 3,
      },
      {
        points: [
          [100, 72],
          [100, 38],
        ],
        width: 3,
      },
    ],
    marks: [
      { area: { rect: [72, 72, 1, 1] }, mark: "@" },
      { area: { rect: [71, 0, 3, 2] }, mark: "A" },
      { area: { rect: [72, 7, 1, 1] }, mark: "1" },
      { area: { rect: [142, 71, 2, 3] }, mark: "B" },
      { area: { rect: [136, 72, 1, 1] }, mark: "2" },
      { area: { rect: [0, 71, 2, 3] }, mark: "C" },
      { area: { rect: [7, 72, 1, 1] }, mark: "3" },
      { area: { rect: [28, 35, 3, 3] }, mark: "D" },
      { area: { rect: [36, 36, 1, 1] }, mark: "4" },
    ],
    forests: [{ circle: [28, 36, 15] }, { circle: [44, 112, 14] }, { rect: [96, 86, 30, 8] }],
    props: [{ type: "gate", at: [27, 36], rot: Math.PI / 2 }],
  },
};
