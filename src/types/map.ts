export type MapId =
  | "evergreenVillage"
  | "evergreenMeadow"
  | "evergreenForest"
  | "evergreenSwamp"
  | "evergreenRuins"
  | "twilightWasteland"
  | "kingBearChamber";

export type MapType = "village" | "field" | "boss";

export interface MapConfig {
  id: MapId;
  type: MapType;
  label: string;
  flashColor: string;
}
