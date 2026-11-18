import type { TileMapData } from "@/features/world/types/terrain";
import type { MapMood, MapTheme } from "@/features/world/types/mood";

export type Dir = "n" | "e" | "s" | "w";
export type ExitMode = "walk" | "confirm"; // walk=밟으면 이동 · confirm=확인창 (지하철 탑승 등)

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
  id: string; // 'temp-town'
  name: string; // 화면에 보일 이름
  tiles: TileMapData;
  mood: MapMood; // 하늘·빛·안개·입자
  exits: MapExit[];
}

/** 설계도로 만드는 맵 */
export interface MapSpec {
  id: string;
  name: string;
  blueprint: MapBlueprint;
  theme: MapTheme; // 분위기·지형 색·식생
  exits: MapExit[];
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
  seed: number; // 나무 배치 난수 씨앗
  paints: BlueprintPaint[];
  paths: BlueprintPath[];
  marks: BlueprintMark[];
  forests: BlueprintArea[]; // 나무 빽빽한 곳 (그 밖은 드문드문)
  props: { type: string; at: [number, number]; rot?: number }[]; // 고정 물체
}
