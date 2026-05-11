export type MapId =
  | "evergreenVillage"
  | "evergreenMeadow"
  | "evergreenForest"
  | "evergreenSwamp"
  | "evergreenRuins"
  | "twilightWasteland"
  | "kingBearChamber";

export type MapType = "village" | "field" | "boss";

export type MarkerType = "npc" | "portal_forward" | "portal_back" | "portal_boss";

export interface MapMarker {
  x: number;
  z: number;
  type: MarkerType;
}

export interface MapConfig {
  id: MapId;
  type: MapType;
  label: string;
  flashColor: string;
  spawnPos: [number, number, number];
}
