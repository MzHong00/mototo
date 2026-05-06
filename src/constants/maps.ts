import type { MapId, MapType, MapConfig } from "@/types/map";

export const MAP_ID = {
  EVERGREEN_VILLAGE: "evergreenVillage",
  EVERGREEN_MEADOW: "evergreenMeadow",
  EVERGREEN_FOREST: "evergreenForest",
  EVERGREEN_SWAMP: "evergreenSwamp",
  EVERGREEN_RUINS: "evergreenRuins",
  TWILIGHT_WASTELAND: "twilightWasteland",
  KING_BEAR_CHAMBER: "kingBearChamber",
} as const satisfies Record<string, MapId>;

export const MAP_TYPE = {
  VILLAGE: "village",
  FIELD: "field",
  BOSS: "boss",
} as const satisfies Record<string, MapType>;

export const MAP_TYPE_LABEL: Record<MapType, string> = {
  [MAP_TYPE.VILLAGE]: "마을",
  [MAP_TYPE.FIELD]: "필드",
  [MAP_TYPE.BOSS]: "보스",
};

export const MAPS: Record<MapId, MapConfig> = {
  [MAP_ID.EVERGREEN_VILLAGE]: {
    id: MAP_ID.EVERGREEN_VILLAGE,
    type: MAP_TYPE.VILLAGE,
    label: "🌳 에버그린 마을",
    flashColor: "rgba(100,200,80,0.45)",
  },
  [MAP_ID.EVERGREEN_MEADOW]: {
    id: MAP_ID.EVERGREEN_MEADOW,
    type: MAP_TYPE.FIELD,
    label: "🌿 에버그린 초원",
    flashColor: "rgba(91,163,255,0.55)",
  },
  [MAP_ID.EVERGREEN_FOREST]: {
    id: MAP_ID.EVERGREEN_FOREST,
    type: MAP_TYPE.FIELD,
    label: "🌲 에버그린 숲",
    flashColor: "rgba(50,150,50,0.55)",
  },
  [MAP_ID.EVERGREEN_SWAMP]: {
    id: MAP_ID.EVERGREEN_SWAMP,
    type: MAP_TYPE.FIELD,
    label: "🌾 에버그린 늪지",
    flashColor: "rgba(80,120,60,0.55)",
  },
  [MAP_ID.EVERGREEN_RUINS]: {
    id: MAP_ID.EVERGREEN_RUINS,
    type: MAP_TYPE.FIELD,
    label: "🏚 에버그린 유적",
    flashColor: "rgba(120,110,80,0.55)",
  },
  [MAP_ID.TWILIGHT_WASTELAND]: {
    id: MAP_ID.TWILIGHT_WASTELAND,
    type: MAP_TYPE.FIELD,
    label: "🔥 황혼의 황야",
    flashColor: "rgba(255,100,0,0.45)",
  },
  [MAP_ID.KING_BEAR_CHAMBER]: {
    id: MAP_ID.KING_BEAR_CHAMBER,
    type: MAP_TYPE.BOSS,
    label: "🐻 왕 곰의 굴",
    flashColor: "rgba(139,69,19,0.45)",
  },
};
