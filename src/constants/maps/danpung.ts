import type { MapSpec } from "@/types/world";

/** 단풍골 마을 128×160 — 붉은 단풍 산골. 북쪽으로 3층까지 오르는 산길. 동 에버그린 · 북 구름 고원 · 서쪽 산비탈에 바위 협곡 */
export const DANPUNG: MapSpec = {
  id: "danpung",
  name: "단풍골 마을",
  kind: "main",
  dungeonId: "rock-canyon",
  exits: [
    { mark: "B", to: { map: "evergreen", entry: "3" }, mode: "walk", label: "에버그린 마을 →" },
    { mark: "A", to: { map: "cloudhill", entry: "1" }, mode: "walk", label: "↑ 구름 고원" },
    { mark: "D", to: { map: "rock-canyon/r0", entry: "1" }, mode: "dungeon", label: "⚔ 바위 협곡" },
  ],
  blueprint: {
    id: "danpung",
    width: 128,
    depth: 160,
    seed: 37,
    coast: 0.85,
    paints: [
      { area: { rect: [24, 0, 80, 60] }, level: 1, kind: "g" },
      { area: { rect: [34, 0, 60, 50] }, level: 2 },
      { area: { rect: [46, 0, 36, 40] }, level: 3 },
      { area: { circle: [30, 112, 8] }, kind: "w" },
      { area: { rect: [52, 68, 25, 25] }, kind: "r" },
    ],
    paths: [
      {
        points: [
          [64, 80],
          [64, 0],
        ],
        width: 3,
      },
      {
        points: [
          [64, 80],
          [127, 80],
        ],
        width: 3,
      },
      {
        points: [
          [64, 24],
          [38, 24],
        ],
        width: 3,
      },
    ],
    marks: [
      { area: { rect: [64, 80, 1, 1] }, mark: "@" },
      { area: { rect: [126, 79, 2, 3] }, mark: "B" },
      { area: { rect: [120, 80, 1, 1] }, mark: "1" },
      { area: { rect: [63, 0, 3, 2] }, mark: "A" },
      { area: { rect: [64, 7, 1, 1] }, mark: "2" },
      { area: { rect: [36, 23, 3, 3] }, mark: "D" },
      { area: { rect: [41, 24, 1, 1] }, mark: "4" },
    ],
    forests: [{ circle: [96, 120, 16] }, { circle: [44, 44, 10] }, { circle: [86, 30, 9] }],
    props: [{ type: "gate", at: [35, 24], rot: Math.PI / 2 }],
    colors: { g: "#c3cf86" },
    treeType: "tree-maple",
  },
};
