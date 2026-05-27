import { buildItemById } from "../data/buildItems";
import { tileTypes } from "../data/tileTypes";
import { selectedVisitor, useGameStore, visitorLabel } from "../game/store";

export default function SelectedInfoPanel() {
  const selectedTile = useGameStore((state) => state.selectedTile);
  const visitor = useGameStore(selectedVisitor);
  const placementMessage = useGameStore((state) => state.placementMessage);

  return (
    <div className="selected-info">
      {placementMessage && <strong className="message">{placementMessage}</strong>}
      {visitor ? (
        <div>
          <h3>{visitorLabel(visitor)}</h3>
          <p>
            Status: <strong>{visitor.status}</strong> · Happiness:{" "}
            <strong>{visitor.happiness}</strong>
          </p>
          <p>
            Target:{" "}
            {visitor.target
              ? `${visitor.target.x}, ${visitor.target.y}`
              : "choosing a meaningful destination"}
          </p>
        </div>
      ) : selectedTile ? (
        <div>
          <h3>
            Tile {selectedTile.tile.x}, {selectedTile.tile.y}
          </h3>
          <p>
            {tileTypes[selectedTile.tile.terrain].label}:{" "}
            {tileTypes[selectedTile.tile.terrain].description}
          </p>
          <p>
            Object:{" "}
            <strong>
              {selectedTile.objectName ??
                (selectedTile.tile.pathType
                  ? buildItemById[selectedTile.tile.pathType]?.name
                  : "Empty buildable layer")}
            </strong>
          </p>
        </div>
      ) : (
        <div>
          <h3>City notebook</h3>
          <p>Select a tile or visitor for details. Right-click a tile to inspect while building.</p>
        </div>
      )}
    </div>
  );
}
