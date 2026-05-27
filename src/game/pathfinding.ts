import { GRID_SIZE } from "./constants";
import type { Position, Tile } from "./types";

const keyOf = (position: Position) => `${position.x},${position.y}`;

export const neighborsOf = ({ x, y }: Position): Position[] =>
  [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ].filter(
    (position) =>
      position.x >= 0 &&
      position.x < GRID_SIZE &&
      position.y >= 0 &&
      position.y < GRID_SIZE,
  );

export const tileAt = (tiles: Tile[], position: Position) =>
  tiles.find((tile) => tile.x === position.x && tile.y === position.y);

export const isTraversable = (tile?: Tile) => Boolean(tile?.pathType);

export const getAdjacentTraversable = (
  tiles: Tile[],
  position: Position,
): Position[] =>
  neighborsOf(position).filter((neighbor) => isTraversable(tileAt(tiles, neighbor)));

export const findPath = (
  tiles: Tile[],
  start: Position,
  goal: Position,
): Position[] => {
  if (!isTraversable(tileAt(tiles, start)) || !isTraversable(tileAt(tiles, goal))) {
    return [];
  }

  const queue: Position[] = [start];
  const visited = new Set<string>([keyOf(start)]);
  const cameFrom = new Map<string, Position>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.x === goal.x && current.y === goal.y) {
      const path = [goal];
      let cursor = keyOf(goal);

      while (cameFrom.has(cursor)) {
        const previous = cameFrom.get(cursor)!;
        path.push(previous);
        cursor = keyOf(previous);
      }

      return path.reverse();
    }

    for (const neighbor of neighborsOf(current)) {
      const neighborKey = keyOf(neighbor);
      if (visited.has(neighborKey) || !isTraversable(tileAt(tiles, neighbor))) {
        continue;
      }

      visited.add(neighborKey);
      cameFrom.set(neighborKey, current);
      queue.push(neighbor);
    }
  }

  return [];
};

export const areDestinationsConnected = (
  tiles: Tile[],
  destinationPositions: Position[],
): boolean => {
  const accessPoints = destinationPositions
    .map((position) => getAdjacentTraversable(tiles, position)[0])
    .filter(Boolean) as Position[];

  if (accessPoints.length !== destinationPositions.length || accessPoints.length < 2) {
    return false;
  }

  return accessPoints
    .slice(1)
    .every((accessPoint) => findPath(tiles, accessPoints[0], accessPoint).length > 0);
};

export const connectedDestinationCount = (tiles: Tile[]): number => {
  const destinations = tiles.filter((tile) => tile.placedObject && !tile.pathType);
  return destinations.filter((tile) => getAdjacentTraversable(tiles, tile).length > 0)
    .length;
};
