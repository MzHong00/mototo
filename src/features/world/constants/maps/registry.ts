import { TEMP_TOWN } from "@/features/world/constants/maps/tempTown";

import type { MapSpec, TravelTarget } from "@/features/world/types/world";

/** 설계도로 만드는 맵 전부 */
export const MAP_SPECS: Record<string, MapSpec> = Object.fromEntries(
  [TEMP_TOWN].map((m) => [m.id, m]),
);

export const START_TARGET: TravelTarget = { map: TEMP_TOWN.id, entry: "@" }; // 새 캐릭터 시작 위치
