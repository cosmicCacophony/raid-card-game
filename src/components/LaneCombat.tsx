// src/components/LaneCombat.tsx

import React, { useState } from "react";
import { bosses } from "../data/bosses";
import { heroes } from "../data/heroes";

interface LaneUnit {
  id: string;
  name: string;
  hp: number;
  attack: number;
  role: string;
}

interface LaneState {
  units: LaneUnit[];
  enemy: {
    name: string;
    hp: number;
    traits: string[];
    regenPerTurn?: number;
  };
}

const LaneCombat = () => {
  const greenBoss = bosses.find((b) => b.id === "green")!;
  const [round, setRound] = useState(1);
  const [log, setLog] = useState<string[]>([]);
  const [enemyHP, setEnemyHP] = useState(20);
  const [playerHP, setPlayerHP] = useState(20);
  const [gold, setGold] = useState(3);
  const [selectedHeroes, setSelectedHeroes] = useState<LaneUnit[]>([]);

  const [laneState, setLaneState] = useState<LaneState>({
    units: [],
    enemy: {
      name: greenBoss.name,
      hp: 20,
      traits: greenBoss.specialAbilities,
      regenPerTurn: 2,
    },
  });

  const handleHeroSelect = (hero: LaneUnit) => {
    if (selectedHeroes.length < round) {
      const newTeam = [...selectedHeroes, hero];
      setSelectedHeroes(newTeam);
      setLaneState({ ...laneState, units: newTeam });
    }
  };

  const handleNextRound = () => {
    if (selectedHeroes.length < round) return;

    let damageDealt = laneState.units.reduce(
      (sum, unit) => sum + unit.attack,
      0
    );
    let regen = laneState.enemy.regenPerTurn || 0;
    let logs: string[] = [];

    logs.push(`Your team dealt ${damageDealt} damage.`);
    logs.push(`${laneState.enemy.name} regenerated ${regen} HP.`);

    const effectiveDamage = Math.max(0, damageDealt - regen);
    setEnemyHP((prev) => Math.max(0, prev - effectiveDamage));

    const enemyCounter = 5;
    logs.push(`${laneState.enemy.name} attacks for ${enemyCounter} damage.`);
    setPlayerHP((prev) => Math.max(0, prev - enemyCounter));

    const goldEarned = 1 + (gold < 6 ? 2 : 0); // simulate interest mechanic
    setGold((prev) => prev + goldEarned);
    logs.push(`You gained ${goldEarned} gold.`);

    setLog((prev) => [...prev, ...logs]);
    setRound((prev) => prev + 1);
  };

  return (
    <div>
      <h2>Lane Combat - {laneState.enemy.name}</h2>
      <p>
        <strong>Round:</strong> {round}
      </p>
      <p>
        <strong>Enemy HP:</strong> {enemyHP}
      </p>
      <p>
        <strong>Player HP:</strong> {playerHP}
      </p>
      <p>
        <strong>Gold:</strong> {gold}
      </p>

      {selectedHeroes.length < round ? (
        <div>
          <h3>Select a Hero</h3>
          {heroes.map((hero) => (
            <button
              key={hero.name}
              onClick={() =>
                handleHeroSelect({
                  id: `${hero.name.toLowerCase()}-${round}`,
                  name: hero.name,
                  hp: hero.hp,
                  attack: hero.attack,
                  role: hero.role,
                })
              }
            >
              {hero.name}
            </button>
          ))}
        </div>
      ) : (
        <button onClick={handleNextRound}>Next Round</button>
      )}

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
