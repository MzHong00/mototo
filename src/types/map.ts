export type MapId = "evergreenMeadow" | "twilightWasteland" | "redGuardianChamber";
export type MapType = "normal" | "boss";

export interface MapConfig {
  id: MapId;
  type: MapType;
  label: string;
  flashColor: string;
}
