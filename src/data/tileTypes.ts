import type { TerrainType } from "../game/types";

export const tileTypes: Record<
  TerrainType,
  { label: string; buildable: boolean; description: string }
> = {
  land: {
    label: "Paris Land",
    buildable: true,
    description: "Buildable city fabric along the Seine.",
  },
  river: {
    label: "Seine River",
    buildable: false,
    description: "A water corridor that requires bridges to cross.",
  },
  island: {
    label: "Ile de la Cite",
    buildable: true,
    description: "The early symbolic center of Paris.",
  },
};
