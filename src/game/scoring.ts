import { buildItemById } from "../data/buildItems";
import type { BuildEffects, GameStats, Tile } from "./types";

export const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export const applyEffects = (
  stats: GameStats,
  effects: BuildEffects,
  cost = 0,
): GameStats => ({
  budget: stats.budget - cost,
  understanding: clampScore(stats.understanding + (effects.understanding ?? 0)),
  flow: clampScore(stats.flow + (effects.flow ?? 0)),
  heritage: clampScore(stats.heritage + (effects.heritage ?? 0)),
  happiness: clampScore(stats.happiness + (effects.happiness ?? 0)),
  beauty: clampScore(stats.beauty + (effects.beauty ?? 0)),
  visitorsServed: stats.visitorsServed,
});

export const countBuilt = (tiles: Tile[], itemId: string) =>
  tiles.filter((tile) => tile.placedObject?.itemId === itemId).length;

export const findBuiltPosition = (tiles: Tile[], itemId: string) => {
  const tile = tiles.find((candidate) => candidate.placedObject?.itemId === itemId);
  return tile ? { x: tile.x, y: tile.y } : undefined;
};

export const isDestination = (tile: Tile) => {
  if (!tile.placedObject) {
    return false;
  }

  return Boolean(buildItemById[tile.placedObject.itemId]?.destination);
};

export const recalculateDerivedScores = (tiles: Tile[], stats: GameStats): GameStats => {
  const pathTiles = tiles.filter((tile) => tile.pathType).length;
  const destinationTiles = tiles.filter(isDestination).length;
  const parks = countBuilt(tiles, "park");
  const fountains = countBuilt(tiles, "fountain");
  const boulevards = countBuilt(tiles, "boulevard");

  return {
    ...stats,
    flow: clampScore(stats.flow + Math.min(6, Math.floor(pathTiles / 20))),
    beauty: clampScore(stats.beauty + parks * 2 + fountains + Math.floor(boulevards / 3)),
    understanding: clampScore(stats.understanding + Math.min(5, destinationTiles)),
  };
};
