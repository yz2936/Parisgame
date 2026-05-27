import { useGameStore } from "../game/store";
import type { TimeSpeed } from "../game/types";

const speeds: { label: string; value: TimeSpeed }[] = [
  { label: "Pause", value: 0 },
  { label: "1x", value: 1 },
  { label: "2x", value: 2 },
  { label: "3x", value: 3 },
];

export default function TimeControls() {
  const timeSpeed = useGameStore((state) => state.timeSpeed);
  const setTimeSpeed = useGameStore((state) => state.setTimeSpeed);

  return (
    <div className="time-controls" aria-label="Time speed controls">
      {speeds.map((speed) => (
        <button
          key={speed.value}
          className={timeSpeed === speed.value ? "active" : ""}
          onClick={() => setTimeSpeed(speed.value)}
        >
          {speed.label}
        </button>
      ))}
    </div>
  );
}
