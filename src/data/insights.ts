import type { InsightCard } from "../game/types";

export const insights: InsightCard[] = [
  {
    id: "seine-spine",
    title: "The Seine as Paris's Spine",
    text:
      "Paris grew around the Seine because the river supported trade, defense, movement, and identity. Ile de la Cite became one of the city's earliest symbolic and political centers.",
    era: "medieval",
  },
  {
    id: "first-bridge",
    title: "Bridges Made the City Legible",
    text:
      "A bridge is more than a crossing: it turns separate banks into one urban system. Medieval Paris depended on these links between island, market, church, and schools.",
    era: "medieval",
  },
  {
    id: "learning-quarter",
    title: "A City of Scholars",
    text:
      "The Latin Quarter and cathedral schools made Paris a center of learning. Connecting education to worship and commerce helps visitors see how medieval urban life overlapped.",
    era: "medieval",
  },
  {
    id: "haussmann-tradeoff",
    title: "Haussmann's Tradeoff",
    text:
      "The new boulevards made Paris easier to move through and helped create its iconic look. But modernization also displaced communities and erased parts of older Paris.",
    era: "haussmann",
  },
  {
    id: "heritage-warning",
    title: "Memory Can Be Fragile",
    text:
      "Modern systems can improve daily life while still damaging inherited places. Good planning asks what should change, what should remain, and how people remember both.",
    era: "haussmann",
  },
  {
    id: "eiffel-arrives",
    title: "Engineering as Spectacle",
    text:
      "The Eiffel Tower made iron structure itself a public event. Its meaning grew as visitors used it to imagine Paris as modern, experimental, and open to the world.",
    era: "belle-epoque",
  },
  {
    id: "metro-network",
    title: "The Metro Shrinks the City",
    text:
      "Metro stations change urban experience by making distant places feel connected. A navigable Paris depends on both memorable landmarks and everyday mobility.",
    era: "belle-epoque",
  },
];

export const insightById = Object.fromEntries(
  insights.map((insight) => [insight.id, insight]),
) as Record<string, InsightCard>;
