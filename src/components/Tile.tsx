import { useMemo, useState } from "react";
import { buildItemById } from "../data/buildItems";
import { TERRAIN_COLORS } from "../game/constants";
import { useGameStore } from "../game/store";
import type { Tile as TileType } from "../game/types";
import BridgeModel from "./objects/BridgeModel";
import LandmarkModel from "./objects/LandmarkModel";
import ParkModel from "./objects/ParkModel";
import PathModel from "./objects/PathModel";
import RoadModel from "./objects/RoadModel";

interface TileProps {
  tile: TileType;
  worldX: number;
  worldZ: number;
}

export default function Tile({ tile, worldX, worldZ }: TileProps) {
  const [hovered, setHovered] = useState(false);
  const selectedBuildItemId = useGameStore((state) => state.selectedBuildItemId);
  const placeOnTile = useGameStore((state) => state.placeOnTile);
  const selectTile = useGameStore((state) => state.selectTile);
  const selectedItem = selectedBuildItemId ? buildItemById[selectedBuildItemId] : undefined;
  const canPlace = selectedItem?.allowedTerrain.includes(tile.terrain) ?? false;

  const baseColor = useMemo(() => {
    if (hovered && selectedItem) {
      return canPlace ? "#f7e7a3" : "#d96767";
    }

    return TERRAIN_COLORS[tile.terrain];
  }, [canPlace, hovered, selectedItem, tile.terrain]);

  const placedItem = tile.placedObject ? buildItemById[tile.placedObject.itemId] : undefined;

  return (
    <group position={[worldX, 0, worldZ]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onPointerEnter={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerLeave={(event) => {
          event.stopPropagation();
          setHovered(false);
        }}
        onClick={(event) => {
          event.stopPropagation();
          if (selectedItem) {
            placeOnTile(tile.x, tile.y);
          } else {
            selectTile(tile.x, tile.y);
          }
        }}
        onContextMenu={(event) => {
          event.stopPropagation();
          selectTile(tile.x, tile.y);
        }}
      >
        <planeGeometry args={[0.96, 0.96]} />
        <meshStandardMaterial color={baseColor} roughness={0.95} />
      </mesh>

      {tile.pathType === "wooden-bridge" && <BridgeModel />}
      {tile.pathType === "boulevard" && <RoadModel />}
      {tile.pathType && tile.pathType !== "wooden-bridge" && tile.pathType !== "boulevard" && (
        <PathModel type={buildItemById[tile.pathType]?.modelType ?? "dirt-path"} />
      )}

      {placedItem?.modelType === "park" && <ParkModel />}
      {placedItem && placedItem.modelType !== "park" && placedItem.modelType !== "dirt-path" && placedItem.modelType !== "stone-road" && placedItem.modelType !== "garden-path" && placedItem.modelType !== "boulevard" && placedItem.modelType !== "wooden-bridge" && (
        <LandmarkModel type={placedItem.modelType} label={placedItem.name} />
      )}
    </group>
  );
}
