import { ROOM_GRAPH } from "@/constants/game/dungeon";

import type { DungeonDef } from "@/types/world";

/** 마을마다 하나씩 있는 전투맵 — 방 그래프는 MVP에선 모두 같고 색·이름만 다름 */
export const DUNGEONS: DungeonDef[] = [
  {
    id: "acorn-hollow",
    name: "도토리 숲굴",
    village: "evergreen",
    returnTo: { map: "evergreen", entry: "4" },
    colors: { r: "#b9a27e", x: "#5f7f4f", cliff: "#7a5d40" },
    rooms: ROOM_GRAPH,
  },
  {
    id: "wave-cave",
    name: "파도 동굴",
    village: "bluecove",
    returnTo: { map: "bluecove", entry: "4" },
    colors: { r: "#a9c3c9", x: "#4f7f95", cliff: "#3f6274" },
    rooms: ROOM_GRAPH,
  },
  {
    id: "rock-canyon",
    name: "바위 협곡",
    village: "danpung",
    returnTo: { map: "danpung", entry: "4" },
    colors: { r: "#c9a888", x: "#9a6a4a", cliff: "#7c5038" },
    rooms: ROOM_GRAPH,
  },
  {
    id: "wind-tower",
    name: "바람 탑",
    village: "cloudhill",
    returnTo: { map: "cloudhill", entry: "4" },
    colors: { r: "#d7d9e0", x: "#8a96b0", cliff: "#6a7690" },
    rooms: ROOM_GRAPH,
  },
  {
    id: "sunken-temple",
    name: "잠긴 사원",
    village: "moonlake",
    returnTo: { map: "moonlake", entry: "4" },
    colors: { r: "#b7b3cf", x: "#6c6497", cliff: "#504878" },
    rooms: ROOM_GRAPH,
  },
];
