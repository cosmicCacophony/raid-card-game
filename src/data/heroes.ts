// src/data/heroes.ts

export interface Hero {
  id: string;
  name: string;
  role: "tank" | "dps" | "healer" | "support";
  description: string;
  strengths: string[];
  weaknesses: string[];
}

export const heroes: Hero[] = [
  {
    id: "bard",
    name: "Bard",
    role: "support",
    description: "Buffs allies or debuffs enemies depending on the situation.",
    strengths: ["enemy debuffs", "team buffs"],
    weaknesses: ["low damage"],
  },
  {
    id: "wizard",
    name: "Wizard",
    role: "dps",
    description:
      "High burst magic damage caster. Can reduce cooldowns with the right items.",
    strengths: ["burst damage", "combo potential"],
    weaknesses: ["fragile"],
  },
  {
    id: "cleric",
    name: "Cleric",
    role: "healer",
    description: "Focuses on restoring health and cleansing negative effects.",
    strengths: ["healing", "utility"],
    weaknesses: ["low offense"],
  },
  {
    id: "druid",
    name: "Druid",
    role: "healer",
    description: "Hybrid healer with situational buffs and utility.",
    strengths: ["healing", "utility", "adaptability"],
    weaknesses: ["jack-of-all-trades"],
  },
  {
    id: "warrior",
    name: "Warrior",
    role: "tank",
    description:
      "High survivability, can absorb damage and frontline effectively.",
    strengths: ["tanking", "soaking damage"],
    weaknesses: ["low utility"],
  },
  {
    id: "enchanter",
    name: "Enchanter",
    role: "support",
    description: "Controls the battlefield with crowd control effects.",
    strengths: ["crowd control", "tempo control"],
    weaknesses: ["low direct impact"],
  },
];
