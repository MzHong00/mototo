import type { MapObjects } from "@/types/map";

// 맵 경계: ±60 (120x120)
export const EVERGREEN_VILLAGE_OBJECTS: MapObjects = {
  size: [120, 120],
  terrain: [],
  trees: [
    { pos: [-15, -10], variant: "pine" },
    { pos: [18, -20], variant: "oak" },
    { pos: [-25, 8], variant: "pine" },
    { pos: [20, 15], variant: "oak" },
    { pos: [-10, 22], variant: "pine" },
    { pos: [30, -8], variant: "oak" },
    { pos: [-35, -25], variant: "pine" },
    { pos: [10, -30], variant: "oak" },
    { pos: [-45, 20], variant: "pine" },
    { pos: [40, 30], variant: "oak" },
    { pos: [-20, -40], variant: "dead" },
    { pos: [50, -20], variant: "pine" },
  ],
  walls: [
    { pos: [0, 2, -60], size: [120, 4, 0.5] },
    { pos: [0, 2, 60], size: [120, 4, 0.5] },
    { pos: [-60, 2, 0], size: [0.5, 4, 120] },
    { pos: [60, 2, 0], size: [0.5, 4, 120] },
  ],
  portals: [
    {
      pos: [55, 0, 10],
      label: "에버그린 초원 →",
      type: "field",
      dest: "evergreenMeadow",
      spawnPos: [-10, 1, -3],
    },
  ],
  spawns: [],
  npcs: [{ id: "lucas", pos: [-30, 0, 5] }],
};
