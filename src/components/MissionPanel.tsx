import { missionByEra } from "../data/missions";
import { objectiveComplete, useGameStore } from "../game/store";

export default function MissionPanel() {
  const currentEra = useGameStore((state) => state.currentEra);
  const tiles = useGameStore((state) => state.tiles);
  const stats = useGameStore((state) => state.stats);
  const mission = missionByEra[currentEra];

  return (
    <section className="mission-card">
      <h3>{mission.title}</h3>
      <p>{mission.text}</p>
      <ul className="objectives">
        {mission.objectives.map((objective) => {
          const complete = objectiveComplete(objective.id, tiles, stats);
          return (
            <li key={objective.id} className={complete ? "complete" : ""}>
              <span>{complete ? "✓" : "○"}</span>
              {objective.label}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
