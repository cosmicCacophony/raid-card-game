// src/types/boss.ts

export type Boss = {
  id: string;
  name: string;
  description: string;
  traits: string[];
  hp: number;
  attack: number;
  behavior: (laneIndex: number, creeps: number) => string[];
};
