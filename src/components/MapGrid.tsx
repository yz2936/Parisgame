import { Html } from "@react-three/drei";
import { GRID_SIZE } from "../game/constants";
import { useGameStore } from "../game/store";
import { gridToWorld } from "../game/simulation";
import Tile from "./Tile";
import VisitorAgent from "./objects/VisitorAgent";

export default function MapGrid() {
  const tiles = useGameStore((state) => state.tiles);
  const visitors = useGameStore((state) => state.visitors);
  const floatingTexts = useGameStore((state) => state.floatingTexts);
  const currentEra = useGameStore((state) => state.currentEra);

  const fogColor =
    currentEra === "medieval"
      ? "#f5d9ad"
      : currentEra === "haussmann"
        ? "#ddd5c8"
        : "#d9e8f2";

  return (
    <group>
      <color attach="background" args={[fogColor]} />
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[GRID_SIZE + 1.5, 0.08, GRID_SIZE + 1.5]} />
        <meshStandardMaterial color="#9e7b50" />
      </mesh>

      {tiles.map((tile) => {
        const world = gridToWorld(tile);
        return <Tile key={`${tile.x}-${tile.y}`} tile={tile} worldX={world.x} worldZ={world.z} />;
      })}

      {visitors.map((visitor) => (
        <VisitorAgent key={visitor.id} visitor={visitor} />
      ))}

      {floatingTexts.map((floatingText) => {
        const world = gridToWorld(floatingText.position);
        return (
          <Html
            key={floatingText.id}
            center
            position={[world.x, 1.1, world.z]}
            className={`floating-score ${floatingText.kind}`}
          >
            {floatingText.text}
          </Html>
        );
      })}
    </group>
  );
}
