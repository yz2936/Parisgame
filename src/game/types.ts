export type EraId = "medieval" | "haussmann" | "belle-epoque";

export type TerrainType = "land" | "river" | "island";

export type BuildCategory = "paths" | "connections" | "landmarks" | "services";

export type ModelType =
  | "dirt-path"
  | "stone-road"
  | "boulevard"
  | "garden-path"
  | "wooden-bridge"
  | "market"
  | "chapel"
  | "university"
  | "well"
  | "park"
  | "fountain"
  | "apartment"
  | "sanitation"
  | "metro"
  | "exhibition"
  | "eiffel"
  | "cafe"
  | "kiosk"
  | "notre-dame";

export type VisitorType = "tourist" | "student" | "resident" | "historian";

export type VisitorStatus = "walking" | "lost" | "visiting" | "leaving";

export interface Position {
  x: number;
  y: number;
}

export interface Era {
  id: EraId;
  name: string;
  yearRange: string;
  description: string;
  unlockedByDefault: boolean;
  unlockRequirement?: string;
}

export interface BuildEffects {
  understanding?: number;
  flow?: number;
  heritage?: number;
  happiness?: number;
  beauty?: number;
}

export interface BuildItem {
  id: string;
  name: string;
  category: BuildCategory;
  eraRequired: EraId;
  cost: number;
  modelType: ModelType;
  allowedTerrain: TerrainType[];
  pathLike?: boolean;
  destination?: boolean;
  unique?: boolean;
  effects: BuildEffects;
  description: string;
}

export interface PlacedObject {
  id: string;
  itemId: string;
  era: EraId;
  placedAt: number;
}

export interface Tile {
  x: number;
  y: number;
  terrain: TerrainType;
  buildable: boolean;
  placedObject?: PlacedObject;
  pathType?: string;
  historicalLayer?: EraId;
}

export interface MissionObjective {
  id: string;
  label: string;
}

export interface Mission {
  eraId: EraId;
  title: string;
  text: string;
  reward?: number;
  objectives: MissionObjective[];
}

export interface InsightCard {
  id: string;
  title: string;
  text: string;
  era: EraId;
}

export interface VisitorProfile {
  type: VisitorType;
  label: string;
  color: string;
  speed: number;
  interests: string[];
}

export interface Visitor {
  id: string;
  type: VisitorType;
  position: Position;
  visualPosition: { x: number; z: number };
  target?: Position;
  path: Position[];
  pathIndex: number;
  happiness: number;
  status: VisitorStatus;
  visited: string[];
}

export interface GameStats {
  budget: number;
  understanding: number;
  flow: number;
  heritage: number;
  happiness: number;
  beauty: number;
  visitorsServed: number;
}

export interface FloatingText {
  id: string;
  position: Position;
  text: string;
  kind: "good" | "bad" | "neutral";
  createdAt: number;
}

export interface SelectedTileInfo {
  tile: Tile;
  objectName?: string;
}

export type TimeSpeed = 0 | 1 | 2 | 3;
