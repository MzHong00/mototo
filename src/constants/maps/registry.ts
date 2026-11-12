import { BLUECOVE } from "@/constants/maps/bluecove";
import { CLOUDHILL } from "@/constants/maps/cloudhill";
import { DANPUNG } from "@/constants/maps/danpung";
import { EVERGREEN } from "@/constants/maps/evergreen";
import { MOONLAKE } from "@/constants/maps/moonlake";
import { START_ISLAND } from "@/constants/maps/startIsland";

import type { MapSpec, TravelTarget } from "@/types/world";

/** 설계도로 만드는 맵 전부 (첫 섬 + 본 맵 5개) */
export const MAP_SPECS: Record<string, MapSpec> = Object.fromEntries(
  [START_ISLAND, EVERGREEN, BLUECOVE, DANPUNG, CLOUDHILL, MOONLAKE].map((m) => [m.id, m]),
);

export const START_TARGET: TravelTarget = { map: "start-island", entry: "@" }; // 새 캐릭터 시작 위치
export const ROOM_ID_SEPARATOR = "/"; // 전투맵 방 맵 id = 전투맵id/방id
