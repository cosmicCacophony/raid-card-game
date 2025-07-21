import React, { useState } from "react";
import LaneCombat from "./components/LaneCombat";
import { bosses } from "./data/bosses";
import type { Boss } from "./types/boss";

function App() {
  const [currentRound, setCurrentRound] = useState(1);
  const [activeBoss, setActiveBoss] = useState<Boss>(
    bosses.find((b) => b.id === "green")!
  );

  const [laneCreeps, setLaneCreeps] = useState<number[]>(() => {
    const distribution = [0, 0, 0];
    let totalCreeps = 10;
    while (totalCreeps > 0) {
      const lane = Math.floor(Math.random() * 3);
      distribution[lane]++;
      totalCreeps--;
    }
    return distribution;
  });

  const handleNextRound = () => {
    setCurrentRound((prev) => prev + 1);
    setLaneCreeps((prev) => prev.map((count) => count + 2)); // Add 2 creeps to each lane
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Raid Card Game</h1>
      <p>Round {currentRound}</p>
      <p>Boss: {activeBoss.name}</p>
      <p>Creeps per Lane: {laneCreeps.join(", ")}</p>
      <button onClick={handleNextRound}>Next Round</button>
      <LaneCombat
        round={currentRound}
        activeBoss={activeBoss}
        laneCreeps={laneCreeps}
      />
    </div>
  );
}

export default App;
