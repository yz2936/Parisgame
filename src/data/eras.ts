import type { Era } from "../game/types";

export const eras: Era[] = [
  {
    id: "medieval",
    name: "Medieval Paris",
    yearRange: "1100-1400",
    description:
      "A river city grows around Ile de la Cite, faith, markets, and learning.",
    unlockedByDefault: true,
  },
  {
    id: "haussmann",
    name: "Haussmann Paris",
    yearRange: "1853-1870",
    description:
      "Boulevards, parks, sanitation, and circulation reshape the capital.",
    unlockedByDefault: false,
    unlockRequirement: "Complete the Medieval Paris mission.",
  },
  {
    id: "belle-epoque",
    name: "Belle Epoque / World Exhibition Paris",
    yearRange: "1889-1900",
    description:
      "Metro entrances, cafes, exhibitions, and global spectacle layer onto older Paris.",
    unlockedByDefault: false,
    unlockRequirement: "Complete the Haussmann Paris mission.",
  },
];
