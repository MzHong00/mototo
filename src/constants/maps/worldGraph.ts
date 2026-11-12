import type { WorldLine, WorldNode } from "@/types/world";

/** 노선도 역 — 격자 좌표는 정수, 이웃 역 사이는 가로·세로·45°만 */
export const WORLD_NODES: WorldNode[] = [
  {
    id: "start-island",
    label: "첫걸음 섬",
    kind: "start",
    grid: [0, 6],
    fastTravel: { map: "start-island", entry: "@" },
  },
  {
    id: "evergreen",
    label: "에버그린",
    kind: "village",
    grid: [2, 4],
    fastTravel: { map: "evergreen", entry: "@" },
  },
  {
    id: "bluecove",
    label: "블루 코브",
    kind: "village",
    grid: [6, 4],
    fastTravel: { map: "bluecove", entry: "@" },
  },
  {
    id: "moonlake",
    label: "달빛 호숫가",
    kind: "village",
    grid: [6, 0],
    fastTravel: { map: "moonlake", entry: "@" },
  },
  {
    id: "cloudhill",
    label: "구름 고원",
    kind: "village",
    grid: [2, 0],
    fastTravel: { map: "cloudhill", entry: "@" },
  },
  {
    id: "danpung",
    label: "단풍골",
    kind: "village",
    grid: [2, 2],
    fastTravel: { map: "danpung", entry: "@" },
  },
  { id: "acorn-hollow", label: "도토리 숲굴", kind: "dungeon", grid: [3, 5] },
  { id: "wave-cave", label: "파도 동굴", kind: "dungeon", grid: [7, 5] },
  { id: "sunken-temple", label: "잠긴 사원", kind: "dungeon", grid: [7, -1] },
  { id: "wind-tower", label: "바람 탑", kind: "dungeon", grid: [1, -1] },
  { id: "rock-canyon", label: "바위 협곡", kind: "dungeon", grid: [1, 1] },
];

const DUNGEON_LINE = "#7b7b8c"; // 전투맵 가지선 색

/** 노선 — 한 길 = 한 색 */
export const WORLD_LINES: WorldLine[] = [
  { id: "forest", color: "#5fae6b", stops: ["start-island", "evergreen"] },
  { id: "sea", color: "#4f9fd6", stops: ["evergreen", "bluecove"] },
  { id: "lake", color: "#9b87d6", stops: ["bluecove", "moonlake"] },
  { id: "plateau", color: "#8ab8e8", stops: ["moonlake", "cloudhill"] },
  { id: "mountain", color: "#e08a4f", stops: ["cloudhill", "danpung", "evergreen"] },
  { id: "d-acorn", color: DUNGEON_LINE, stops: ["evergreen", "acorn-hollow"] },
  { id: "d-wave", color: DUNGEON_LINE, stops: ["bluecove", "wave-cave"] },
  { id: "d-sunken", color: DUNGEON_LINE, stops: ["moonlake", "sunken-temple"] },
  { id: "d-wind", color: DUNGEON_LINE, stops: ["cloudhill", "wind-tower"] },
  { id: "d-rock", color: DUNGEON_LINE, stops: ["danpung", "rock-canyon"] },
];
