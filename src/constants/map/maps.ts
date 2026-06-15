import type { MapId, MapType, MapConfig, MapMarker, TreeVariant } from "@/types/map";

export interface MapTheme {
  ground: string;
  wire: string;
}

export const MAP_THEMES: Record<MapId, MapTheme> = {
  evergreenVillage: { ground: "#99DD66", wire: "#88CC55" },
  evergreenMeadow: { ground: "#88CC55", wire: "#77BB44" },
  evergreenForest: { ground: "#66AA44", wire: "#558833" },
  evergreenSwamp: { ground: "#667744", wire: "#556633" },
  evergreenRuins: { ground: "#9B9B8A", wire: "#7A7A6A" },
  twilightWasteland: { ground: "#AA8855", wire: "#997744" },
  kingBearChamber: { ground: "#AA8855", wire: "#997744" },
};

export const TREE_COLORS: Record<TreeVariant, { trunk: string; mid: string; top: string }> = {
  pine: { trunk: "#8B5E3C", mid: "#225522", top: "#336633" },
  oak: { trunk: "#7A4E2D", mid: "#33661A", top: "#448822" },
  dead: { trunk: "#554433", mid: "#443322", top: "#332211" },
};

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

export const MAP_MARKERS: Partial<Record<MapId, MapMarker[]>> = {
  evergreenVillage: [
    { x: 0, z: -8, type: "npc" },
    { x: 13, z: 5, type: "portal_forward" },
  ],
  evergreenMeadow: [
    { x: -13, z: -5, type: "portal_back" },
    { x: 13, z: 5, type: "portal_forward" },
  ],
  evergreenForest: [
    { x: -13, z: -5, type: "portal_back" },
    { x: 13, z: 5, type: "portal_forward" },
  ],
  evergreenSwamp: [
    { x: -13, z: -5, type: "portal_back" },
    { x: 13, z: 5, type: "portal_forward" },
  ],
  evergreenRuins: [
    { x: -13, z: -5, type: "portal_back" },
    { x: 15, z: 0, type: "portal_boss" },
  ],
};

export const MAPS: Record<MapId, MapConfig> = {
  [MAP_ID.EVERGREEN_VILLAGE]: {
    id: MAP_ID.EVERGREEN_VILLAGE,
    type: MAP_TYPE.VILLAGE,
    label: "🌳 에버그린 마을",
    flashColor: "rgba(100,200,80,0.45)",
    spawnPos: [0, 1, 0],
  },
  [MAP_ID.EVERGREEN_MEADOW]: {
    id: MAP_ID.EVERGREEN_MEADOW,
    type: MAP_TYPE.FIELD,
    label: "🌿 에버그린 초원",
    flashColor: "rgba(91,163,255,0.55)",
    spawnPos: [0, 1, 0],
  },
  [MAP_ID.EVERGREEN_FOREST]: {
    id: MAP_ID.EVERGREEN_FOREST,
    type: MAP_TYPE.FIELD,
    label: "🌲 에버그린 숲",
    flashColor: "rgba(50,150,50,0.55)",
    spawnPos: [0, 1, 0],
  },
  [MAP_ID.EVERGREEN_SWAMP]: {
    id: MAP_ID.EVERGREEN_SWAMP,
    type: MAP_TYPE.FIELD,
    label: "🌾 에버그린 늪지",
    flashColor: "rgba(80,120,60,0.55)",
    spawnPos: [0, 1, 0],
  },
  [MAP_ID.EVERGREEN_RUINS]: {
    id: MAP_ID.EVERGREEN_RUINS,
    type: MAP_TYPE.FIELD,
    label: "🏚 에버그린 유적",
    flashColor: "rgba(120,110,80,0.55)",
    spawnPos: [0, 1, 0],
  },
  [MAP_ID.TWILIGHT_WASTELAND]: {
    id: MAP_ID.TWILIGHT_WASTELAND,
    type: MAP_TYPE.FIELD,
    label: "🔥 황혼의 황야",
    flashColor: "rgba(255,100,0,0.45)",
    spawnPos: [0, 1, 0],
  },
  [MAP_ID.KING_BEAR_CHAMBER]: {
    id: MAP_ID.KING_BEAR_CHAMBER,
    type: MAP_TYPE.BOSS,
    label: "🐻 왕 곰의 굴",
    flashColor: "rgba(139,69,19,0.45)",
    spawnPos: [0, 2, 8],
  },
};
