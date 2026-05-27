import { useEffect } from "react";
import BuildMenu from "./components/BuildMenu";
import EraPanel from "./components/EraPanel";
import GameCanvas from "./components/GameCanvas";
import InsightModal from "./components/InsightModal";
import SelectedInfoPanel from "./components/SelectedInfoPanel";
import TopBar from "./components/TopBar";
import VictoryModal from "./components/VictoryModal";
import { useGameStore } from "./game/store";

export default function App() {
  const transitionMessage = useGameStore((state) => state.transitionMessage);
  const clearTransition = useGameStore((state) => state.clearTransition);

  useEffect(() => {
    if (!transitionMessage) {
      return;
    }

    const timeout = window.setTimeout(clearTransition, 2400);
    return () => window.clearTimeout(timeout);
  }, [clearTransition, transitionMessage]);

  return (
    <div className="app-shell">
      <TopBar />
      <main className="game-layout">
        <BuildMenu />
        <section className="viewport-card">
          <GameCanvas />
          <SelectedInfoPanel />
          {transitionMessage && <div className="transition-overlay">{transitionMessage}</div>}
        </section>
        <EraPanel />
      </main>
      <InsightModal />
      <VictoryModal />
    </div>
  );
}
