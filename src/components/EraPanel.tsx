import { eras } from "../data/eras";
import { missionByEra } from "../data/missions";
import { ERA_ORDER } from "../game/constants";
import { missionCompleteForEra, objectiveComplete, useGameStore } from "../game/store";
import MissionPanel from "./MissionPanel";

export default function EraPanel() {
  const currentEra = useGameStore((state) => state.currentEra);
  const unlockedEras = useGameStore((state) => state.unlockedEras);
  const tiles = useGameStore((state) => state.tiles);
  const stats = useGameStore((state) => state.stats);
  const advanceEra = useGameStore((state) => state.advanceEra);
  const resetGame = useGameStore((state) => state.resetGame);
  const current = eras.find((era) => era.id === currentEra)!;
  const mission = missionByEra[currentEra];
  const completedObjectives = mission.objectives.filter((objective) =>
    objectiveComplete(objective.id, tiles, stats),
  ).length;
  const progress = Math.round((completedObjectives / mission.objectives.length) * 100);
  const canAdvance = missionCompleteForEra(currentEra, tiles, stats);

  return (
    <aside className="panel era-panel">
      <div className="panel-heading">
        <span>Time Machine</span>
        <button
          className="ghost"
          onClick={() => window.dispatchEvent(new Event("reset-paris-camera"))}
        >
          Reset camera
        </button>
      </div>

      <div className="era-card">
        <small>{current.yearRange}</small>
        <h2>{current.name}</h2>
        <p>{current.description}</p>
      </div>

      <div className="era-track">
        {ERA_ORDER.map((eraId) => {
          const era = eras.find((candidate) => candidate.id === eraId)!;
          const unlocked = unlockedEras.includes(eraId);
          const active = currentEra === eraId;
          return (
            <div key={era.id} className={`era-step ${unlocked ? "unlocked" : "locked"} ${active ? "active" : ""}`}>
              <span>{unlocked ? "●" : "○"}</span>
              <div>
                <strong>{era.name}</strong>
                <small>{unlocked ? era.yearRange : era.unlockRequirement}</small>
              </div>
            </div>
          );
        })}
      </div>

      <div className="progress">
        <div>
          <span>Progress to next era</span>
          <strong>{progress}%</strong>
        </div>
        <meter min={0} max={100} value={progress} />
      </div>

      <MissionPanel />

      <button className="primary wide" disabled={!canAdvance} onClick={advanceEra}>
        {currentEra === "belle-epoque" ? "Complete Paris Story" : "Advance Era"}
      </button>
      <button className="ghost wide" onClick={resetGame}>
        New Game / Reset
      </button>
    </aside>
  );
}
