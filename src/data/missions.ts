import type { Mission } from "../game/types";

export const missions: Mission[] = [
  {
    eraId: "medieval",
    title: "The River City",
    text: "Connect the island, market, and learning quarter so visitors can understand how the Seine shaped early Paris.",
    reward: 500,
    objectives: [
      { id: "bridge-to-island", label: "Build at least one bridge to Ile de la Cite" },
      {
        id: "connect-medieval-sites",
        label: "Connect Notre-Dame, Market Square, and University Quarter with paths",
      },
      { id: "understanding-40", label: "Reach Understanding Score of 40" },
      { id: "budget-positive", label: "Keep Budget above 0" },
    ],
  },
  {
    eraId: "haussmann",
    title: "Modernize with Memory",
    text: "Modernize Paris while protecting its historical memory.",
    reward: 700,
    objectives: [
      { id: "five-boulevards", label: "Build at least 5 boulevard tiles" },
      { id: "one-park", label: "Add at least one park" },
      { id: "flow-60", label: "Improve Flow Score to 60" },
      { id: "heritage-40", label: "Do not reduce Heritage Score below 40" },
      { id: "understanding-65", label: "Reach Understanding Score of 65" },
    ],
  },
  {
    eraId: "belle-epoque",
    title: "World-Stage Paris",
    text: "Turn Paris into a world-stage city while keeping it navigable and meaningful.",
    objectives: [
      { id: "place-eiffel", label: "Place Eiffel Tower landmark" },
      { id: "one-metro", label: "Build one metro station" },
      {
        id: "connect-world-stage",
        label: "Connect Eiffel Tower, Exhibition Hall, Cafe, and Notre-Dame",
      },
      { id: "attract-30", label: "Attract 30 visitors" },
      { id: "understanding-80", label: "Reach Understanding Score of 80" },
    ],
  },
];

export const missionByEra = Object.fromEntries(
  missions.map((mission) => [mission.eraId, mission]),
) as Record<string, Mission>;
