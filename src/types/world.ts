import type { TileMapData } from "@/types/terrain";

export type Dir = "n" | "e" | "s" | "w";
export type RoomKind = "entry" | "combat" | "elite" | "treasure" | "gather" | "rest" | "boss";
export type ExitMode = "walk" | "boat" | "dungeon"; // walk=밟으면 이동 · 나머지는 확인창

/** 이동 목적지 — 맵 + 그 맵의 도착점 글자 */
export interface TravelTarget {
  map: string; // 맵 id
  entry: string; // 도착점 표시 글자 (1~9, @)
}

/** 출구 — 같은 표시 글자 칸들을 밟으면 이동 */
export interface MapExit {
  mark: string; // 출구 표시 글자 (A~H)
  to: TravelTarget;
  mode: ExitMode;
  label: string; // 확인창·문 위에 보일 목적지 이름
}

/** 게임에서 쓰는 맵 하나 */
export interface MapDef {
  id: string; // 'evergreen' · 'acorn-hollow/r3'
  name: string; // 화면에 보일 이름
  kind: "start" | "main" | "room";
  tiles: TileMapData;
  exits: MapExit[];
  dungeonId?: string; // 전투맵 방이면 소속 전투맵
  roomKind?: RoomKind; // 전투맵 방 종류
}

/** 설계도로 만드는 맵 (첫 섬·본 맵) */
export interface MapSpec {
  id: string;
  name: string;
  kind: "start" | "main";
  blueprint: MapBlueprint;
  exits: MapExit[];
  dungeonId?: string; // 이 마을의 전투맵
}

/** 칸 지도 설계도의 영역 — 사각형 [x, z, 가로, 세로] 또는 원 [cx, cz, 반지름] */
export type BlueprintArea =
  | { rect: [number, number, number, number] }
  | { circle: [number, number, number] };

/** 설계도 칠하기 한 번 — 영역의 층·바닥을 바꿈 */
export interface BlueprintPaint {
  area: BlueprintArea;
  level?: number; // 층 (경사로가 생기려면 사각형으로)
  kind?: "g" | "s" | "w" | "r" | "x" | "p";
}

/** 설계도 길 — 꺾은선(가로·세로 구간). 층 경계를 지나면 경사로가 자동으로 생김 */
export interface BlueprintPath {
  points: [number, number][]; // 칸 좌표
  width: number; // 길 폭 (홀수)
}

/** 설계도 표시 — 영역 칸들에 표시 글자를 찍음 */
export interface BlueprintMark {
  area: BlueprintArea;
  mark: string;
}

/** 맵 설계도 — 큰 맵을 글자 대신 도형으로 적고 불러올 때 칸 지도로 바꿈 */
export interface MapBlueprint {
  id: string;
  width: number;
  depth: number;
  seed: number; // 해안선·나무 배치 난수 씨앗
  coast: number; // 섬 크기 (0~1, 지도 대비 반지름)
  paints: BlueprintPaint[];
  paths: BlueprintPath[];
  marks: BlueprintMark[];
  forests: BlueprintArea[]; // 나무 빽빽한 곳 (그 밖은 드문드문)
  props: { type: string; at: [number, number]; rot?: number }[]; // 고정 물체 (전투맵 입구 문 등)
  colors?: TileMapData["colors"];
  treeType?: string; // 나무 물체 종류 (기본 'tree')
}

/** 노선도 역 */
export interface WorldNode {
  id: string; // 맵 id 또는 전투맵 id
  label: string;
  kind: "start" | "village" | "dungeon";
  grid: [number, number]; // 노선도 격자 좌표
  fastTravel?: TravelTarget; // 빠른 이동 도착점 (마을)
}

/** 노선도 노선 — 인접 역 사이는 가로·세로·45°만 */
export interface WorldLine {
  id: string;
  color: string;
  stops: string[]; // 역 id 순서
}

/** 전투맵 방 */
export interface DungeonRoom {
  id: string; // 'r3'
  kind: RoomKind;
  next: string[]; // 다음 방 id (북·동·서 문 순서로 배치)
}

/** 마을 전투맵 — 방 그래프 */
export interface DungeonDef {
  id: string; // 'acorn-hollow'
  name: string;
  village: string; // 소속 마을 맵 id
  returnTo: TravelTarget; // 나가면 돌아갈 곳 (마을 입구 앞)
  colors: TileMapData["colors"]; // 방 바닥(r)·벽 윗면(x)·벽 옆면(cliff) 색
  rooms: DungeonRoom[]; // 첫 방 = 입구방
}
