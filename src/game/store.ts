import { create } from "zustand";
import { buildItemById, buildItems } from "../data/buildItems";
import { eras } from "../data/eras";
import { insightById } from "../data/insights";
import { missionByEra } from "../data/missions";
import { visitorProfileByType } from "../data/visitors";
import { ERA_ORDER, GRID_SIZE, INITIAL_STATS, SAVE_KEY } from "./constants";
import {
  areDestinationsConnected,
  connectedDestinationCount,
  getAdjacentTraversable,
  isTraversable,
} from "./pathfinding";
import { applyEffects, clampScore, countBuilt, findBuiltPosition } from "./scoring";
import { advanceVisitors, createVisitor } from "./simulation";
import type {
  BuildItem,
  EraId,
  FloatingText,
  GameStats,
  InsightCard,
  Position,
  SelectedTileInfo,
  Tile,
  TimeSpeed,
  Visitor,
} from "./types";

interface SaveShape {
  tiles: Tile[];
  currentEra: EraId;
  unlockedEras: EraId[];
  stats: GameStats;
  unlockedInsights: string[];
  missionRewardsClaimed: EraId[];
  victory: boolean;
}

interface GameState {
  tiles: Tile[];
  currentEra: EraId;
  unlockedEras: EraId[];
  selectedBuildItemId?: string;
  selectedTile?: SelectedTileInfo;
  selectedVisitorId?: string;
  stats: GameStats;
  visitors: Visitor[];
  timeSpeed: TimeSpeed;
  unlockedInsights: string[];
  activeInsight?: InsightCard;
  missionRewardsClaimed: EraId[];
  floatingTexts: FloatingText[];
  placementMessage?: string;
  transitionMessage?: string;
  victory: boolean;
  spawnCounter: number;
  tickAccumulator: number;
  selectBuildItem: (itemId?: string) => void;
  selectTile: (x: number, y: number) => void;
  selectVisitor: (visitorId?: string) => void;
  placeOnTile: (x: number, y: number) => void;
  dismissInsight: () => void;
  setTimeSpeed: (speed: TimeSpeed) => void;
  advanceEra: () => void;
  tick: (deltaSeconds: number) => void;
  resetGame: () => void;
  clearTransition: () => void;
}

const eraRank = (era: EraId) => ERA_ORDER.indexOf(era);

export const generateInitialTiles = (): Tile[] => {
  const tiles: Tile[] = [];

  for (let x = 0; x < GRID_SIZE; x += 1) {
    for (let y = 0; y < GRID_SIZE; y += 1) {
      const riverCenter = 15.5 + Math.sin(x * 0.33) * 1.4 + (x - 16) * 0.055;
      const isRiver = Math.abs(y - riverCenter) <= 1.35;
      const island =
        x >= 14 &&
        x <= 18 &&
        y >= 14 &&
        y <= 17 &&
        Math.abs(x - 16) + Math.abs(y - 15.5) < 4.2;
      const terrain = island ? "island" : isRiver ? "river" : "land";

      tiles.push({
        x,
        y,
        terrain,
        buildable: terrain !== "river",
        historicalLayer: terrain === "island" ? "medieval" : undefined,
      });
    }
  }

  const notreDame = tiles.find((tile) => tile.x === 16 && tile.y === 15);
  if (notreDame) {
    notreDame.placedObject = {
      id: "notre-dame-anchor",
      itemId: "notre-dame",
      era: "medieval",
      placedAt: Date.now(),
    };
    notreDame.historicalLayer = "medieval";
  }

  return tiles;
};

const createInitialState = (): SaveShape => ({
  tiles: generateInitialTiles(),
  currentEra: "medieval",
  unlockedEras: ["medieval"],
  stats: { ...INITIAL_STATS },
  unlockedInsights: [],
  missionRewardsClaimed: [],
  victory: false,
});

const loadSavedState = (): SaveShape => {
  if (typeof window === "undefined") {
    return createInitialState();
  }

  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return createInitialState();
    }

    return { ...createInitialState(), ...JSON.parse(raw) };
  } catch {
    return createInitialState();
  }
};

const persist = (state: GameState) => {
  if (typeof window === "undefined") {
    return;
  }

  const save: SaveShape = {
    tiles: state.tiles,
    currentEra: state.currentEra,
    unlockedEras: state.unlockedEras,
    stats: state.stats,
    unlockedInsights: state.unlockedInsights,
    missionRewardsClaimed: state.missionRewardsClaimed,
    victory: state.victory,
  };
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
};

const addFloatingText = (
  position: Position,
  text: string,
  kind: FloatingText["kind"] = "good",
): FloatingText => ({
  id: `float-${Date.now()}-${Math.random()}`,
  position,
  text,
  kind,
  createdAt: Date.now(),
});

const triggerInsight = (
  insightId: string,
  unlockedInsights: string[],
): { unlockedInsights: string[]; activeInsight?: InsightCard } => {
  if (unlockedInsights.includes(insightId)) {
    return { unlockedInsights };
  }

  return {
    unlockedInsights: [...unlockedInsights, insightId],
    activeInsight: insightById[insightId],
  };
};

const getTile = (tiles: Tile[], x: number, y: number) =>
  tiles.find((tile) => tile.x === x && tile.y === y);

const validatePlacement = (
  state: GameState,
  item: BuildItem,
  tile: Tile,
): { ok: true; heritagePenalty: number } | { ok: false; message: string } => {
  if (!state.unlockedEras.includes(item.eraRequired)) {
    return { ok: false, message: `${item.name} unlocks in ${item.eraRequired}.` };
  }

  if (eraRank(item.eraRequired) > eraRank(state.currentEra)) {
    return { ok: false, message: `${item.name} belongs to a later era.` };
  }

  if (state.stats.budget < item.cost) {
    return { ok: false, message: "Not enough budget for this build." };
  }

  if (!item.allowedTerrain.includes(tile.terrain)) {
    return { ok: false, message: `${item.name} cannot be placed on ${tile.terrain}.` };
  }

  if (item.unique && state.tiles.some((candidate) => candidate.placedObject?.itemId === item.id)) {
    return { ok: false, message: `${item.name} is already present in Paris.` };
  }

  const existingItemId = tile.placedObject?.itemId;
  const existing = existingItemId ? buildItemById[existingItemId] : undefined;
  const replacingOldBuilding =
    item.id === "boulevard" &&
    existing &&
    !existing.pathLike &&
    tile.placedObject?.era === "medieval";

  if (tile.placedObject && !tile.pathType && !replacingOldBuilding) {
    return { ok: false, message: "That tile already has a protected city layer." };
  }

  return { ok: true, heritagePenalty: replacingOldBuilding ? -12 : 0 };
};

const destinationPositions = (tiles: Tile[], itemIds: string[]) =>
  itemIds
    .map((itemId) => findBuiltPosition(tiles, itemId))
    .filter(Boolean) as Position[];

export const objectiveComplete = (
  objectiveId: string,
  tiles: Tile[],
  stats: GameStats,
): boolean => {
  switch (objectiveId) {
    case "bridge-to-island":
      return countBuilt(tiles, "wooden-bridge") >= 1;
    case "connect-medieval-sites": {
      const positions = destinationPositions(tiles, ["notre-dame", "market", "university"]);
      return positions.length === 3 && areDestinationsConnected(tiles, positions);
    }
    case "understanding-40":
      return stats.understanding >= 40;
    case "budget-positive":
      return stats.budget > 0;
    case "five-boulevards":
      return countBuilt(tiles, "boulevard") >= 5;
    case "one-park":
      return countBuilt(tiles, "park") >= 1;
    case "flow-60":
      return stats.flow >= 60;
    case "heritage-40":
      return stats.heritage >= 40;
    case "understanding-65":
      return stats.understanding >= 65;
    case "place-eiffel":
      return countBuilt(tiles, "eiffel") >= 1;
    case "one-metro":
      return countBuilt(tiles, "metro-station") >= 1;
    case "connect-world-stage": {
      const positions = destinationPositions(tiles, [
        "eiffel",
        "exhibition",
        "cafe",
        "notre-dame",
      ]);
      return positions.length === 4 && areDestinationsConnected(tiles, positions);
    }
    case "attract-30":
      return stats.visitorsServed >= 30;
    case "understanding-80":
      return stats.understanding >= 80;
    default:
      return false;
  }
};

export const missionCompleteForEra = (eraId: EraId, tiles: Tile[], stats: GameStats) => {
  const mission = missionByEra[eraId];
  return mission.objectives.every((objective) =>
    objectiveComplete(objective.id, tiles, stats),
  );
};

const maybeMissionUnderstandingBonus = (tiles: Tile[], stats: GameStats): GameStats => {
  const connected = connectedDestinationCount(tiles);
  if (connected < 3) {
    return stats;
  }

  return {
    ...stats,
    understanding: clampScore(stats.understanding + Math.min(4, Math.floor(connected / 2))),
    flow: clampScore(stats.flow + Math.min(3, Math.floor(connected / 3))),
  };
};

const saved = loadSavedState();

export const useGameStore = create<GameState>((set, get) => ({
  ...saved,
  selectedBuildItemId: "dirt-path",
  visitors: [],
  timeSpeed: 1,
  activeInsight: undefined,
  floatingTexts: [],
  spawnCounter: 0,
  tickAccumulator: 0,
  selectBuildItem: (itemId) => set({ selectedBuildItemId: itemId, placementMessage: undefined }),
  selectTile: (x, y) => {
    const tile = getTile(get().tiles, x, y);
    if (!tile) {
      return;
    }
    const objectName = tile.placedObject
      ? buildItemById[tile.placedObject.itemId]?.name
      : undefined;
    set({ selectedTile: { tile, objectName }, selectedVisitorId: undefined });
  },
  selectVisitor: (visitorId) => set({ selectedVisitorId: visitorId, selectedTile: undefined }),
  setTimeSpeed: (speed) => set({ timeSpeed: speed }),
  dismissInsight: () => set({ activeInsight: undefined }),
  clearTransition: () => set({ transitionMessage: undefined }),
  resetGame: () => {
    const fresh = createInitialState();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SAVE_KEY);
    }
    set({
      ...fresh,
      selectedBuildItemId: "dirt-path",
      selectedTile: undefined,
      selectedVisitorId: undefined,
      visitors: [],
      timeSpeed: 1,
      activeInsight: undefined,
      floatingTexts: [],
      placementMessage: undefined,
      transitionMessage: undefined,
      spawnCounter: 0,
      tickAccumulator: 0,
    });
  },
  placeOnTile: (x, y) => {
    const state = get();
    const item = buildItemById[state.selectedBuildItemId ?? ""];
    const tile = getTile(state.tiles, x, y);

    if (!item || !tile) {
      set({ placementMessage: "Select a build item first." });
      return;
    }

    const validation = validatePlacement(state, item, tile);
    if (!validation.ok) {
      set({
        placementMessage: validation.message,
        selectedTile: { tile, objectName: tile.placedObject ? buildItemById[tile.placedObject.itemId]?.name : undefined },
        floatingTexts: [
          ...state.floatingTexts,
          addFloatingText(tile, "Invalid", "bad"),
        ].slice(-8),
      });
      return;
    }

    const placedObject = {
      id: `${item.id}-${Date.now()}-${x}-${y}`,
      itemId: item.id,
      era: state.currentEra,
      placedAt: Date.now(),
    };

    const tiles = state.tiles.map((candidate) =>
      candidate.x === x && candidate.y === y
        ? {
            ...candidate,
            placedObject,
            pathType: item.pathLike ? item.id : undefined,
            historicalLayer: candidate.historicalLayer ?? state.currentEra,
          }
        : candidate,
    );

    let stats = applyEffects(state.stats, item.effects, item.cost);
    let placementMessage = `${item.name} placed.`;
    const floatingTexts = [
      ...state.floatingTexts,
      addFloatingText(tile, item.effects.understanding ? "+Understanding" : item.effects.flow ? "+Flow" : "+City"),
    ];
    let unlockedInsights = state.unlockedInsights;
    let activeInsight = state.activeInsight;

    if (validation.heritagePenalty < 0) {
      stats = {
        ...stats,
        heritage: clampScore(stats.heritage + validation.heritagePenalty),
      };
      placementMessage = "A boulevard replaced an older layer. Heritage fell.";
      floatingTexts.push(addFloatingText(tile, "-Heritage", "bad"));
      const insight = triggerInsight("heritage-warning", unlockedInsights);
      unlockedInsights = insight.unlockedInsights;
      activeInsight = insight.activeInsight;
    }

    if (item.id === "wooden-bridge") {
      const insight = triggerInsight("first-bridge", unlockedInsights);
      unlockedInsights = insight.unlockedInsights;
      activeInsight = activeInsight ?? insight.activeInsight;
    }

    if (item.id === "boulevard") {
      const insight = triggerInsight("haussmann-tradeoff", unlockedInsights);
      unlockedInsights = insight.unlockedInsights;
      activeInsight = activeInsight ?? insight.activeInsight;
    }

    if (item.id === "eiffel") {
      const insight = triggerInsight("eiffel-arrives", unlockedInsights);
      unlockedInsights = insight.unlockedInsights;
      activeInsight = activeInsight ?? insight.activeInsight;
    }

    if (item.id === "metro-station") {
      const insight = triggerInsight("metro-network", unlockedInsights);
      unlockedInsights = insight.unlockedInsights;
      activeInsight = activeInsight ?? insight.activeInsight;
    }

    const medievalPositions = destinationPositions(tiles, ["notre-dame", "market", "university"]);
    if (medievalPositions.length >= 2 && areDestinationsConnected(tiles, medievalPositions)) {
      const insight = triggerInsight("seine-spine", unlockedInsights);
      unlockedInsights = insight.unlockedInsights;
      activeInsight = activeInsight ?? insight.activeInsight;
      stats = { ...stats, understanding: clampScore(stats.understanding + 5) };
    }

    stats = maybeMissionUnderstandingBonus(tiles, stats);

    set({
      tiles,
      stats,
      unlockedInsights,
      activeInsight,
      selectedTile: { tile: getTile(tiles, x, y)!, objectName: item.name },
      placementMessage,
      floatingTexts: floatingTexts.slice(-10),
    });
    persist(get());
  },
  advanceEra: () => {
    const state = get();
    if (!missionCompleteForEra(state.currentEra, state.tiles, state.stats)) {
      set({ placementMessage: "Complete the current mission before advancing." });
      return;
    }

    const currentIndex = ERA_ORDER.indexOf(state.currentEra);
    const nextEra = ERA_ORDER[currentIndex + 1];
    const mission = missionByEra[state.currentEra];
    const rewardAlreadyClaimed = state.missionRewardsClaimed.includes(state.currentEra);
    const stats = {
      ...state.stats,
      budget:
        state.stats.budget +
        (!rewardAlreadyClaimed && mission.reward ? mission.reward : 0),
    };

    if (!nextEra) {
      set({
        stats,
        victory: true,
        missionRewardsClaimed: rewardAlreadyClaimed
          ? state.missionRewardsClaimed
          : [...state.missionRewardsClaimed, state.currentEra],
      });
      persist(get());
      return;
    }

    const unlockedEras = Array.from(new Set([...state.unlockedEras, nextEra]));
    set({
      currentEra: nextEra,
      unlockedEras,
      stats,
      missionRewardsClaimed: rewardAlreadyClaimed
        ? state.missionRewardsClaimed
        : [...state.missionRewardsClaimed, state.currentEra],
      transitionMessage: "Paris changes again... New priorities emerge.",
      placementMessage: `${eras.find((era) => era.id === nextEra)?.name} unlocked.`,
    });
    persist(get());
  },
  tick: (deltaSeconds) => {
    const state = get();
    if (state.timeSpeed === 0 || state.victory) {
      return;
    }

    const scaledDelta = deltaSeconds * state.timeSpeed;
    const advanced = advanceVisitors(state.visitors, scaledDelta, state.timeSpeed);
    let stats = { ...state.stats };
    let unlockedInsights = state.unlockedInsights;
    let activeInsight = state.activeInsight;
    const floatingTexts = state.floatingTexts.filter(
      (text) => Date.now() - text.createdAt < 2200,
    );

    if (advanced.arrivals.length > 0) {
      const income = advanced.arrivals.length * 5;
      const multiStopBonus = advanced.arrivals.filter((visitor) => visitor.visited.length >= 2).length * 15;
      stats = {
        ...stats,
        budget: stats.budget + income + multiStopBonus,
        visitorsServed: stats.visitorsServed + advanced.arrivals.length,
        understanding: clampScore(stats.understanding + advanced.arrivals.length),
        flow: clampScore(stats.flow + Math.ceil(advanced.arrivals.length / 2)),
        happiness: clampScore(stats.happiness + advanced.arrivals.length),
      };
    }

    if (advanced.lost.length > 0) {
      stats = {
        ...stats,
        happiness: clampScore(stats.happiness - 1),
        flow: clampScore(stats.flow - 1),
      };
    }

    const tickAccumulator = state.tickAccumulator + scaledDelta;
    let visitors = advanced.visitors;
    let spawnCounter = state.spawnCounter;

    if (tickAccumulator >= 2.8 && visitors.length < 36) {
      const visitor = createVisitor(state.tiles, spawnCounter);
      spawnCounter += 1;
      if (visitor) {
        visitors = [...visitors, visitor];
        if (visitor.status === "lost") {
          floatingTexts.push(addFloatingText(visitor.position, "Lost", "bad"));
        }
      }
    }

    const belleComplete = missionCompleteForEra("belle-epoque", state.tiles, stats);
    set({
      visitors,
      stats,
      spawnCounter,
      tickAccumulator: tickAccumulator >= 2.8 ? 0 : tickAccumulator,
      floatingTexts: floatingTexts.slice(-12),
      unlockedInsights,
      activeInsight,
      victory: state.victory || belleComplete,
    });
    persist(get());
  },
}));

export const currentBuildItems = (currentEra: EraId, unlockedEras: EraId[]) =>
  buildItems.filter(
    (item) => unlockedEras.includes(item.eraRequired) && eraRank(item.eraRequired) <= eraRank(currentEra),
  );

export const selectedVisitor = (state: GameState) =>
  state.visitors.find((visitor) => visitor.id === state.selectedVisitorId);

export const visitorLabel = (visitor: Visitor) => visitorProfileByType[visitor.type].label;
