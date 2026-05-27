import { useGameStore } from "../game/store";

export default function VictoryModal() {
  const victory = useGameStore((state) => state.victory);
  const stats = useGameStore((state) => state.stats);
  const resetGame = useGameStore((state) => state.resetGame);

  if (!victory) {
    return null;
  }

  const finalScores = [
    ["Understanding", stats.understanding],
    ["Flow", stats.flow],
    ["Heritage", stats.heritage],
    ["Happiness", stats.happiness],
    ["Beauty", stats.beauty],
    ["Visitors served", stats.visitorsServed],
    ["Money remaining", `$${stats.budget}`],
  ];

  return (
    <div className="modal-backdrop">
      <article className="modal victory-modal">
        <span className="eyebrow">Victory</span>
        <h2>Paris is not one city but many layers.</h2>
        <p>
          You connected river, cathedral, boulevard, park, metro, spectacle, and memory
          into a living urban story.
        </p>
        <div className="final-score-grid">
          {finalScores.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <button className="primary" onClick={resetGame}>
          Restart Game
        </button>
      </article>
    </div>
  );
}
