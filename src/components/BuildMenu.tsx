import { buildItemById } from "../data/buildItems";
import { useGameStore, currentBuildItems } from "../game/store";
import type { BuildCategory } from "../game/types";

const categories: { id: BuildCategory; label: string }[] = [
  { id: "paths", label: "Paths" },
  { id: "connections", label: "Connections" },
  { id: "landmarks", label: "Landmarks" },
  { id: "services", label: "Services" },
];

export default function BuildMenu() {
  const currentEra = useGameStore((state) => state.currentEra);
  const unlockedEras = useGameStore((state) => state.unlockedEras);
  const selectedBuildItemId = useGameStore((state) => state.selectedBuildItemId);
  const selectBuildItem = useGameStore((state) => state.selectBuildItem);
  const tiles = useGameStore((state) => state.tiles);
  const stats = useGameStore((state) => state.stats);
  const items = currentBuildItems(currentEra, unlockedEras);
  const selected = selectedBuildItemId ? buildItemById[selectedBuildItemId] : undefined;

  return (
    <aside className="panel build-menu">
      <div className="panel-heading">
        <span>Build</span>
        <button className="ghost" onClick={() => selectBuildItem(undefined)}>
          Inspect
        </button>
      </div>

      {categories.map((category) => {
        const categoryItems = items.filter((item) => item.category === category.id);
        return (
          <section key={category.id} className="build-category">
            <h3>{category.label}</h3>
            <div className="build-grid">
              {categoryItems.map((item) => {
                const alreadyBuilt =
                  item.unique && tiles.some((tile) => tile.placedObject?.itemId === item.id);
                const disabled = alreadyBuilt || stats.budget < item.cost;
                return (
                  <button
                    key={item.id}
                    disabled={disabled}
                    className={selectedBuildItemId === item.id ? "build-button active" : "build-button"}
                    onClick={() => selectBuildItem(item.id)}
                  >
                    <span>{item.name}</span>
                    <strong>{item.cost === 0 ? "Placed" : `$${item.cost}`}</strong>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="selected-card">
        <h3>{selected ? selected.name : "Inspect mode"}</h3>
        {selected ? (
          <>
            <p>{selected.description}</p>
            <dl>
              <div>
                <dt>Era</dt>
                <dd>{selected.eraRequired}</dd>
              </div>
              <div>
                <dt>Terrain</dt>
                <dd>{selected.allowedTerrain.join(", ")}</dd>
              </div>
              <div>
                <dt>Effects</dt>
                <dd>
                  {Object.entries(selected.effects)
                    .map(([key, value]) => `${value && value > 0 ? "+" : ""}${value} ${key}`)
                    .join(", ") || "Spatial layer"}
                </dd>
              </div>
            </dl>
          </>
        ) : (
          <p>Click tiles or visitors to inspect them without building.</p>
        )}
      </div>
    </aside>
  );
}
