import { eras } from "../data/eras";
import { useGameStore } from "../game/store";

export default function InsightModal() {
  const activeInsight = useGameStore((state) => state.activeInsight);
  const dismissInsight = useGameStore((state) => state.dismissInsight);

  if (!activeInsight) {
    return null;
  }

  const era = eras.find((candidate) => candidate.id === activeInsight.era);

  return (
    <div className="modal-backdrop">
      <article className="modal insight-modal">
        <span className="eyebrow">Paris Insight · {era?.name}</span>
        <h2>{activeInsight.title}</h2>
        <p>{activeInsight.text}</p>
        <button className="primary" onClick={dismissInsight}>
          Got it
        </button>
      </article>
    </div>
  );
}
