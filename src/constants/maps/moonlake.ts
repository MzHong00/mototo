import type { MapSpec } from "@/types/world";

/** 달빛 호숫가 마을 160×160 — 가운데 큰 호수, 다리로 잇는 호수 섬에 잠긴 사원. 남 블루 코브 · 서 구름 고원 */
export const MOONLAKE: MapSpec = {
  id: "moonlake",
  name: "달빛 호숫가 마을",
  kind: "main",
  dungeonId: "sunken-temple",
  exits: [
    { mark: "E", to: { map: "bluecove", entry: "2" }, mode: "walk", label: "↓ 블루 코브 항구" },
    { mark: "C", to: { map: "cloudhill", entry: "2" }, mode: "walk", label: "← 구름 고원" },
    {
      mark: "D",
      to: { map: "sunken-temple/r0", entry: "1" },
      mode: "dungeon",
      label: "⚔ 잠긴 사원",
    },
  ],
  blueprint: {
    id: "moonlake",
    width: 160,
    depth: 160,
    seed: 53,
    coast: 0.88,
    paints: [
      { area: { circle: [80, 72, 28] }, kind: "w" },
      { area: { circle: [80, 72, 7] }, kind: "g" },
      { area: { rect: [118, 24, 26, 50] }, level: 1 },
      { area: { rect: [68, 112, 25, 20] }, kind: "r" },
    ],
    paths: [
      {
        points: [
          [80, 122],
          [80, 74],
        ],
        width: 3,
      },
      {
        points: [
          [80, 122],
          [80, 159],
        ],
        width: 3,
      },
      {
        points: [
          [80, 122],
          [0, 122],
        ],
        width: 3,
      },
    ],
    marks: [
      { area: { rect: [80, 122, 1, 1] }, mark: "@" },
      { area: { rect: [79, 158, 3, 2] }, mark: "E" },
      { area: { rect: [80, 152, 1, 1] }, mark: "1" },
      { area: { rect: [0, 121, 2, 3] }, mark: "C" },
      { area: { rect: [7, 122, 1, 1] }, mark: "2" },
      { area: { rect: [79, 70, 3, 3] }, mark: "D" },
      { area: { rect: [80, 77, 1, 1] }, mark: "4" },
    ],
    forests: [{ circle: [40, 60, 14] }, { circle: [130, 120, 12] }],
    props: [{ type: "gate", at: [80, 69], rot: 0 }],
    colors: { g: "#9fcf9b" },
  },
};
