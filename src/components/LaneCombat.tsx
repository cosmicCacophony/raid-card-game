// src/components/LaneCombat.tsx

import React, { useState } from "react";
import { PortalFiendEncounter } from "../types/EncounterType";

const LaneCombat = () => {
  const [log, setLog] = useState<string[]>([]);
  const [enemyHP, setEnemyHP] = useState(
    PortalFiendEncounter.baseEnemyStats.health
  );
  const [playerHP, setPlayerHP] = useState(20);

  const handleNextRound = () => {
    const laneState = {
      units: [
        {
          id: "fighter1",
          name: "Fighter",
          hp: 10,
          attack: 3,
          abilities: ["cleave"],
          traits: [],
        },
      ],
      enemy: {
        name: PortalFiendEncounter.name,
        hp: enemyHP,
        traits: ["adds"],
        behaviors: PortalFiendEncounter.behaviors,
      },
      laneIndex: 0,
    };

    const playerActions = {
      itemsUsed: [],
      spellsCast: [],
    };

    const result = PortalFiendEncounter.roundLogic(laneState, playerActions);

    setEnemyHP((prev) => Math.max(0, prev - result.damageDealt));
    setPlayerHP((prev) => Math.max(0, prev - result.damageTaken));
    setLog((prev) => [...prev, ...result.logs]);
  };

  return (
    <div>
      <h2>Lane Combat</h2>
      <p>
        <strong>Enemy HP:</strong> {enemyHP}
      </p>
      <p>
        <strong>Player HP:</strong> {playerHP}
      </p>
      <button onClick={handleNextRound}>Next Round</button>
      <div style={{ marginTop: "20px" }}>
        <h3>Combat Log:</h3>
        <ul>
          {log.map((entry, idx) => (
            <li key={idx}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LaneCombat;
