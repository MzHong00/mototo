import type { MonsterConfig } from "@/types/monster";

export type TerrainMaterial = "grass" | "stone" | "dirt" | "wood" | "sand";
export type TreeVariant = "pine" | "oak" | "dead";
export type PortalType = "town" | "field" | "boss";

export interface TerrainBlock {
  pos: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
  material: TerrainMaterial;
  rounded?: boolean;
}

export interface TreeObject {
  pos: [number, number];
  variant: TreeVariant;
}

export interface WallBlock {
  pos: [number, number, number];
  size: [number, number, number];
}

export interface PortalObject {
  pos: [number, number, number];
  label: string;
  type: PortalType;
  dest: MapId;
  spawnPos: [number, number, number];
}

export interface NpcObject {
  id: string;
  pos: [number, number, number];
}

export interface MapObjects {
  size?: [number, number]; // [width, depth]
  terrain: TerrainBlock[];
  trees: TreeObject[];
  walls: WallBlock[];
  portals: PortalObject[];
  spawns: MonsterConfig[];
  npcs: NpcObject[];
}

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
