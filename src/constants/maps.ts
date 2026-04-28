import type { MapId, MapType, MapConfig } from "@/types/map";

export const MAP_ID = {
  EVERGREEN_MEADOW: "evergreenMeadow",
  TWILIGHT_WASTELAND: "twilightWasteland",
  RED_GUARDIAN_CHAMBER: "redGuardianChamber",
} as const satisfies Record<string, MapId>;

export const MAP_TYPE = {
  NORMAL: "normal",
  BOSS: "boss",
} as const satisfies Record<string, MapType>;

export const MAP_TYPE_LABEL: Record<MapType, string> = {
  [MAP_TYPE.NORMAL]: "일반",
  [MAP_TYPE.BOSS]: "보스",
};

export const MAPS: Record<MapId, MapConfig> = {
  [MAP_ID.EVERGREEN_MEADOW]: {
    id: MAP_ID.EVERGREEN_MEADOW,
    type: MAP_TYPE.NORMAL,
    label: "🌿 에버그린 초원",
    flashColor: "rgba(91,163,255,0.55)",
  },
  [MAP_ID.TWILIGHT_WASTELAND]: {
    id: MAP_ID.TWILIGHT_WASTELAND,
    type: MAP_TYPE.NORMAL,
    label: "🔥 황혼의 황야",
    flashColor: "rgba(255,100,0,0.45)",
  },
  [MAP_ID.RED_GUARDIAN_CHAMBER]: {
    id: MAP_ID.RED_GUARDIAN_CHAMBER,
    type: MAP_TYPE.BOSS,
    label: "⚔ 붉은 수호자의 방",
    flashColor: "rgba(204,34,34,0.45)",
  },
};
