import type { MapSpec } from "@/types/world";

/** 블루 코브 항구 160×128 — 바닷바람 항구. 서 에버그린 · 북 달빛 호숫가 · 동쪽 절벽에 파도 동굴 */
export const BLUECOVE: MapSpec = {
  id: "bluecove",
  name: "블루 코브 항구",
  kind: "main",
  dungeonId: "wave-cave",
  exits: [
    { mark: "C", to: { map: "evergreen", entry: "2" }, mode: "walk", label: "← 에버그린 마을" },
    { mark: "A", to: { map: "moonlake", entry: "1" }, mode: "walk", label: "↑ 달빛 호숫가" },
    { mark: "D", to: { map: "wave-cave/r0", entry: "1" }, mode: "dungeon", label: "⚔ 파도 동굴" },
  ],
  blueprint: {
    id: "bluecove",
    width: 160,
    depth: 128,
    seed: 23,
    coast: 0.85,
    paints: [
      { area: { rect: [108, 36, 40, 56] }, level: 1 },
      { area: { rect: [124, 44, 20, 40] }, level: 2 },
      { area: { rect: [24, 92, 104, 14] }, kind: "s" },
      { area: { rect: [86, 100, 14, 30] }, kind: "w" },
      { area: { rect: [68, 52, 25, 25] }, kind: "r" },
    ],
    paths: [
      {
        points: [
          [80, 64],
          [0, 64],
        ],
        width: 3,
      },
      {
        points: [
          [80, 64],
          [80, 0],
        ],
        width: 3,
      },
      {
        points: [
          [80, 64],
          [136, 64],
        ],
        width: 3,
      },
      {
        points: [
          [80, 76],
          [80, 100],
        ],
        width: 3,
      },
    ],
    marks: [
      { area: { rect: [80, 64, 1, 1] }, mark: "@" },
      { area: { rect: [0, 63, 2, 3] }, mark: "C" },
      { area: { rect: [7, 64, 1, 1] }, mark: "1" },
      { area: { rect: [79, 0, 3, 2] }, mark: "A" },
      { area: { rect: [80, 7, 1, 1] }, mark: "2" },
      { area: { rect: [137, 63, 3, 3] }, mark: "D" },
      { area: { rect: [130, 64, 1, 1] }, mark: "4" },
    ],
    forests: [{ circle: [40, 40, 14] }],
    props: [{ type: "gate", at: [140, 64], rot: -Math.PI / 2 }],
    colors: { s: "#f6e6b8" },
    treeType: "tree-palm",
  },
};
