import type { MapSpec } from "@/types/world";

/** 구름 고원 마을 144×144 — 바람 부는 고원. 바다 위 낭떠러지 대지. 남 단풍골 · 동 달빛 호숫가 · 북쪽 끝에 바람 탑 */
export const CLOUDHILL: MapSpec = {
  id: "cloudhill",
  name: "구름 고원 마을",
  kind: "main",
  dungeonId: "wind-tower",
  exits: [
    { mark: "E", to: { map: "danpung", entry: "2" }, mode: "walk", label: "↓ 단풍골 마을" },
    { mark: "B", to: { map: "moonlake", entry: "2" }, mode: "walk", label: "달빛 호숫가 →" },
    { mark: "D", to: { map: "wind-tower/r0", entry: "1" }, mode: "dungeon", label: "⚔ 바람 탑" },
  ],
  blueprint: {
    id: "cloudhill",
    width: 144,
    depth: 144,
    seed: 41,
    coast: 0.9,
    paints: [
      { area: { rect: [16, 16, 112, 112] }, level: 1 },
      { area: { rect: [40, 40, 64, 64] }, level: 2 },
      { area: { rect: [96, 26, 16, 12] }, level: 3 },
      { area: { rect: [60, 60, 25, 25] }, kind: "r" },
    ],
    paths: [
      {
        points: [
          [72, 72],
          [72, 143],
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
          [72, 20],
        ],
        width: 3,
      },
    ],
    marks: [
      { area: { rect: [72, 72, 1, 1] }, mark: "@" },
      { area: { rect: [71, 142, 3, 2] }, mark: "E" },
      { area: { rect: [72, 136, 1, 1] }, mark: "1" },
      { area: { rect: [142, 71, 2, 3] }, mark: "B" },
      { area: { rect: [136, 72, 1, 1] }, mark: "2" },
      { area: { rect: [71, 17, 3, 3] }, mark: "D" },
      { area: { rect: [72, 25, 1, 1] }, mark: "4" },
    ],
    forests: [{ circle: [36, 108, 12] }, { circle: [112, 112, 10] }],
    props: [{ type: "gate", at: [72, 16], rot: 0 }],
    colors: { g: "#acd8a0" },
    treeType: "tree-pine",
  },
};
