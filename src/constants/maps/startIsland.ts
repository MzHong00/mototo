import type { MapSpec } from "@/types/world";

/** 첫 섬 48×48 — 캐릭터를 만든 뒤 처음 서는 작은 섬. 남쪽 선착장에서 배로 에버그린 */
export const START_ISLAND: MapSpec = {
  id: "start-island",
  name: "첫걸음 섬",
  kind: "start",
  exits: [
    { mark: "E", to: { map: "evergreen", entry: "1" }, mode: "boat", label: "⛵ 에버그린 마을" },
  ],
  blueprint: {
    id: "start-island",
    width: 48,
    depth: 48,
    seed: 3,
    coast: 0.82,
    paints: [
      { area: { rect: [6, 8, 12, 12] }, level: 1 },
      { area: { rect: [9, 11, 5, 5] }, level: 2 },
      { area: { circle: [34, 31, 4] }, kind: "w" },
      { area: { rect: [21, 21, 7, 7] }, kind: "r" },
    ],
    paths: [
      {
        points: [
          [24, 24],
          [24, 47],
        ],
        width: 3,
      },
      {
        points: [
          [24, 24],
          [24, 14],
          [11, 14],
        ],
        width: 3,
      },
    ],
    marks: [
      { area: { rect: [24, 24, 1, 1] }, mark: "@" },
      { area: { rect: [23, 46, 3, 2] }, mark: "E" },
      { area: { rect: [24, 39, 1, 1] }, mark: "1" },
    ],
    forests: [{ circle: [12, 33, 7] }],
    props: [],
  },
};
