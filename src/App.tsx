// Project: Raid Card Game MVP
// Entry: src/App.tsx

import React, { useState } from "react";
import "./App.css";

// Types
interface Unit {
  id: string;
  name: string;
  type: "melee" | "mage" | "support" | "petmaster";
  hp: number;
  effects: string[];
  baseDamage: number;
  equipped?: Item | null;
}

interface Item {
  id: string;
  name: string;
  type: "equipment" | "spell" | "trap";
  requiresUnitType?: string;
  effect: string;
  cost: number;
}

interface Boss {
  id: string;
  name: string;
  hp: number;
  type: "evasive_magic" | "physical_tank" | "add_spawner";
  attackType: "magic" | "physical";
  adds?: number;
}

interface Lane {
  id: number;
  boss: Boss;
  units: Unit[];
  adds: number;
  log: string[];
}

interface GameState {
  gold: number;
  shop: Item[];
  lanes: Lane[];
  units: Unit[];
  turn: number;
  boughtThisRound: boolean;
}

// Units
const paladin: Unit = {
  id: "u1",
  name: "Paladin",
  type: "melee",
  hp: 12,
  effects: ["selfHeal", "tank"],
  baseDamage: 2,
  equipped: null,
};

const necromancer: Unit = {
  id: "u2",
  name: "Necromancer",
  type: "petmaster",
  hp: 6,
  effects: ["summonPet", "selfHeal"],
  baseDamage: 2,
  equipped: null,
};

const fighter: Unit = {
  id: "u3",
  name: "Fighter",
  type: "melee",
  hp: 8,
  effects: ["cleave"],
  baseDamage: 2,
  equipped: null,
};

const mockShop: Item[] = [
  {
    id: "i2",
    name: "Cleave Sword",
    type: "equipment",
    requiresUnitType: "melee",
    effect: "cleave",
    cost: 3,
  },
  {
    id: "i3",
    name: "Explosive Charges",
    type: "trap",
    effect: "delayExplode",
    cost: 2,
  },
];

const mockLanes: Lane[] = [
  {
    id: 1,
    boss: {
      id: "b1",
      name: "Shadow Wraith",
      hp: 12,
      type: "evasive_magic",
      attackType: "magic",
    },
    units: [necromancer],
    adds: 0,
    log: ["Necromancer placed into lane."],
  },
  {
    id: 2,
    boss: {
      id: "b2",
      name: "Iron Giant",
      hp: 20,
      type: "physical_tank",
      attackType: "physical",
    },
    units: [paladin],
    adds: 0,
    log: ["Paladin placed into lane."],
  },
  {
    id: 3,
    boss: {
      id: "b3",
      name: "Portal Fiend",
      hp: 15,
      type: "add_spawner",
      attackType: "physical",
      adds: 2,
    },
    units: [fighter],
    adds: 2,
    log: ["Fighter placed into lane."],
  },
];

function App() {
  const [state, setState] = useState<GameState>({
    gold: 5,
    shop: mockShop,
    lanes: mockLanes,
    units: [paladin, necromancer, fighter],
    turn: 1,
    boughtThisRound: false,
  });

  function handleBuy(item: Item) {
    if (state.gold < item.cost) return;

    const newUnits = state.units.map((unit) => {
      if (!unit.equipped && unit.type === item.requiresUnitType) {
        return { ...unit, equipped: item };
      }
      return unit;
    });

    const updatedLanes = state.lanes.map((lane) => {
      const updatedUnits = lane.units.map((unit) => {
        if (!unit.equipped && unit.type === item.requiresUnitType) {
          return { ...unit, equipped: item };
        }
        return unit;
      });
      return { ...lane, units: updatedUnits };
    });

    setState((prev) => ({
      ...prev,
      units: newUnits,
      lanes: updatedLanes,
      gold: prev.gold - item.cost,
      boughtThisRound: true,
      shop: prev.shop.filter((i) => i.id !== item.id),
    }));
  }

  function handleNextTurn() {
    const baseGold = 2;
    const bonusGold = state.boughtThisRound ? 0 : 2;
    const totalGold = baseGold + bonusGold;

    const updatedLanes = state.lanes.map((lane) => {
      const log: string[] = [...lane.log, `--- Turn ${state.turn} ---`];
      let adds = lane.adds;
      let bossHp = lane.boss.hp;

      lane.units.forEach((unit) => {
        bossHp = Math.max(0, bossHp - unit.baseDamage);
        log.push(
          `${unit.name} deals ${unit.baseDamage} damage to ${lane.boss.name}`
        );

        if (lane.boss.attackType === "physical") {
          unit.hp -= 2;
          log.push(`${unit.name} takes 2 damage from ${lane.boss.name}`);
        }
      });

      if (lane.id === 3) {
        const fighter = lane.units.find((u) => u.name === "Fighter");
        const hasCleave = fighter?.equipped?.effect === "cleave";

        if (hasCleave) {
          const killedAdds = Math.min(adds, 2);
          adds = Math.max(0, adds - killedAdds);
          bossHp = Math.max(0, bossHp - 3);

          log.push(
            `Fighter cleaves ${killedAdds} adds and deals 3 bonus damage to Portal Fiend.`
          );
          log.push(`Remaining adds: ${adds}`);
        } else {
          const predicted = adds * 2;
          log.push(
            `Without cleave, ${adds} adds become ${predicted} next turn.`
          );
          adds = predicted;
        }
      }

      return {
        ...lane,
        adds,
        boss: {
          ...lane.boss,
          hp: bossHp,
        },
        log,
      };
    });

    setState((prev) => ({
      ...prev,
      lanes: updatedLanes,
      turn: prev.turn + 1,
      gold: prev.gold + totalGold,
      boughtThisRound: false,
    }));
  }

  return (
    <div
      className="App"
      style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}
    >
      <h1>Raid Card Game MVP</h1>
      <h2>Turn: {state.turn}</h2>
      <h2>Gold: {state.gold}</h2>

      <div>
        <h3>Shop</h3>
        {state.shop.map((item) => (
          <div key={item.id}>
            {item.name} – {item.cost}g{" "}
            <button onClick={() => handleBuy(item)}>Buy</button>
          </div>
        ))}
      </div>

      <button onClick={handleNextTurn} style={{ marginTop: "20px" }}>
        Next Turn
      </button>

      <div>
        <h3>Lanes</h3>
        {state.lanes.map((lane) => (
          <div key={lane.id} style={{ marginBottom: "16px" }}>
            <strong>
              Lane {lane.id}: {lane.boss.name} (HP: {lane.boss.hp})
            </strong>
            <div>Adds: {lane.adds}</div>
            <div>Units:</div>
            <ul>
              {lane.units.map((unit) => (
                <li key={unit.id}>
                  {unit.name} (HP: {unit.hp}){" "}
                  {unit.equipped ? `– Equipped: ${unit.equipped.name}` : ""}
                </li>
              ))}
            </ul>
            <div>Log:</div>
            <ul>
              {lane.log.map((log, i) => (
                <li key={i}>{log}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
