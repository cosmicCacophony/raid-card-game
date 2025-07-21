// src/data/bosses.ts
import type { Boss } from "../types/boss";

export const bosses: Boss[] = [
  {
    id: "green",
    name: "Rotroot Hydra",
    description: "Spawns regenerative creeps across all lanes.",
    traits: ["regeneration"],
    hp: 30,
    attack: 5,
    behavior: (laneIndex, creeps) => [
      `Lane ${laneIndex + 1}: ${creeps} creeps regenerate slightly.`,
      `Rotroot Hydra lashes out for 5 damage.`,
    ],
  },
];
