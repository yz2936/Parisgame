import { useGameStore } from "../game/store";
import TimeControls from "./TimeControls";

export default function TopBar() {
  const stats = useGameStore((state) => state.stats);
  const visitorCount = useGameStore((state) => state.visitors.length);

  const statItems = [
    ["Budget", `$${stats.budget}`],
    ["Understanding", stats.understanding],
    ["Flow", stats.flow],
    ["Heritage", stats.heritage],
    ["Happiness", stats.happiness],
    ["Beauty", stats.beauty],
    ["Visitors", visitorCount],
  ];

  return (
    <header className="top-bar">
      <div className="brand">
        <span className="brand-mark">PTM</span>
        <div>
          <strong>Paris Time Machine</strong>
          <small>Educational city-building MVP</small>
        </div>
      </div>
      <div className="stats-strip">
        {statItems.map(([label, value]) => (
          <div className="stat-pill" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <TimeControls />
    </header>
  );
}
