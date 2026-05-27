import type { TerrainType } from "./types";

export const GRID_SIZE = 32;
export const TILE_SIZE = 1;
export const SAVE_KEY = "paris-time-machine-save-v1";

export const INITIAL_STATS = {
  budget: 1000,
  understanding: 12,
  flow: 12,
  heritage: 90,
  happiness: 50,
  beauty: 18,
  visitorsServed: 0,
};

export const TERRAIN_COLORS: Record<TerrainType, string> = {
  land: "#cda56f",
  river: "#3f92d2",
  island: "#d9bd83",
};

export const ERA_ORDER = ["medieval", "haussmann", "belle-epoque"] as const;
