import { buildItemById } from "../data/buildItems";
import { visitorProfiles } from "../data/visitors";
import { GRID_SIZE } from "./constants";
import { findPath, getAdjacentTraversable, isTraversable, tileAt } from "./pathfinding";
import type { Position, Tile, Visitor } from "./types";

export const gridToWorld = (position: Position) => ({
  x: position.x - GRID_SIZE / 2 + 0.5,
  z: position.y - GRID_SIZE / 2 + 0.5,
});

export const createVisitor = (tiles: Tile[], index: number): Visitor | undefined => {
  const traversableTiles = tiles.filter(isTraversable);
  if (traversableTiles.length === 0) {
    return undefined;
  }

  const metroTiles = tiles.filter((tile) => tile.placedObject?.itemId === "metro-station");
  const edgeTiles = traversableTiles.filter(
    (tile) => tile.x === 0 || tile.y === 0 || tile.x === GRID_SIZE - 1 || tile.y === GRID_SIZE - 1,
  );
  const spawnPool = metroTiles.length > 0 ? metroTiles : edgeTiles.length > 0 ? edgeTiles : traversableTiles;
  const spawn = spawnPool[Math.floor(Math.random() * spawnPool.length)];
  const profile = visitorProfiles[index % visitorProfiles.length];
  const target = chooseTargetForVisitor(tiles, profile.interests, spawn);
  const world = gridToWorld(spawn);

  if (!target) {
    return {
      id: `visitor-${Date.now()}-${index}`,
      type: profile.type,
      position: { x: spawn.x, y: spawn.y },
      visualPosition: world,
      path: [],
      pathIndex: 0,
      happiness: 35,
      status: "lost",
      visited: [],
    };
  }

  const start = isTraversable(spawn) ? spawn : getAdjacentTraversable(tiles, spawn)[0];
  const targetAccess = getAdjacentTraversable(tiles, target)[0] ?? target;
  const path = findPath(tiles, start, targetAccess);

  return {
    id: `visitor-${Date.now()}-${index}`,
    type: profile.type,
    position: { x: start.x, y: start.y },
    visualPosition: gridToWorld(start),
    target,
    path,
    pathIndex: 0,
    happiness: path.length > 0 ? 70 : 25,
    status: path.length > 0 ? "walking" : "lost",
    visited: [],
  };
};

export const chooseTargetForVisitor = (
  tiles: Tile[],
  interests: string[],
  spawn: Position,
): Position | undefined => {
  const destinations = tiles.filter((tile) => {
    const itemId = tile.placedObject?.itemId;
    return itemId && buildItemById[itemId]?.destination;
  });

  const preferred = destinations.filter((tile) =>
    interests.includes(tile.placedObject?.itemId ?? ""),
  );
  const pool = preferred.length > 0 ? preferred : destinations;
  const reachable = pool.filter((tile) => {
    const access = getAdjacentTraversable(tiles, tile)[0];
    if (!access) {
      return false;
    }

    const start = isTraversable(tileAt(tiles, spawn)) ? spawn : getAdjacentTraversable(tiles, spawn)[0];
    return Boolean(start && findPath(tiles, start, access).length > 0);
  });

  const chosenPool = reachable.length > 0 ? reachable : pool;
  const chosen = chosenPool[Math.floor(Math.random() * chosenPool.length)];
  return chosen ? { x: chosen.x, y: chosen.y } : undefined;
};

export const advanceVisitors = (
  visitors: Visitor[],
  deltaSeconds: number,
  speedMultiplier: number,
): {
  visitors: Visitor[];
  arrivals: Visitor[];
  lost: Visitor[];
} => {
  const arrivals: Visitor[] = [];
  const lost: Visitor[] = [];

  const updated = visitors
    .map((visitor) => {
      if (visitor.status === "lost") {
        lost.push(visitor);
        return visitor;
      }

      if (visitor.status !== "walking" || visitor.path.length === 0) {
        return visitor;
      }

      const nextIndex = Math.min(visitor.pathIndex + 1, visitor.path.length - 1);
      const next = visitor.path[nextIndex];
      const targetWorld = gridToWorld(next);
      const dx = targetWorld.x - visitor.visualPosition.x;
      const dz = targetWorld.z - visitor.visualPosition.z;
      const distance = Math.hypot(dx, dz);
      const step = deltaSeconds * speedMultiplier * 1.4;

      if (distance <= step || distance === 0) {
        const atEnd = nextIndex >= visitor.path.length - 1;
        const nextVisitor = {
          ...visitor,
          position: next,
          visualPosition: targetWorld,
          pathIndex: nextIndex,
          status: atEnd ? "visiting" : visitor.status,
          happiness: atEnd ? Math.min(100, visitor.happiness + 8) : visitor.happiness,
          visited: atEnd && visitor.target ? [...visitor.visited, `${visitor.target.x},${visitor.target.y}`] : visitor.visited,
        } satisfies Visitor;

        if (atEnd) {
          arrivals.push(nextVisitor);
        }

        return nextVisitor;
      }

      return {
        ...visitor,
        visualPosition: {
          x: visitor.visualPosition.x + (dx / distance) * step,
          z: visitor.visualPosition.z + (dz / distance) * step,
        },
      };
    })
    .filter((visitor) => visitor.status !== "visiting");

  return {
    visitors: updated.slice(-44),
    arrivals,
    lost,
  };
};
