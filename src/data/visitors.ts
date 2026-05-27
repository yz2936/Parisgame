import type { VisitorProfile } from "../game/types";

export const visitorProfiles: VisitorProfile[] = [
  {
    type: "tourist",
    label: "Tourist",
    color: "#ffcf5a",
    speed: 1.55,
    interests: ["eiffel", "notre-dame", "cafe", "exhibition", "market"],
  },
  {
    type: "student",
    label: "Student",
    color: "#7dd3fc",
    speed: 1.7,
    interests: ["university", "notre-dame", "market", "kiosk"],
  },
  {
    type: "resident",
    label: "Resident",
    color: "#86efac",
    speed: 1.45,
    interests: ["park", "market", "sanitation", "cafe", "fountain"],
  },
  {
    type: "historian",
    label: "Historian",
    color: "#d8b4fe",
    speed: 1.25,
    interests: ["notre-dame", "chapel", "university", "market"],
  },
];

export const visitorProfileByType = Object.fromEntries(
  visitorProfiles.map((profile) => [profile.type, profile]),
) as Record<string, VisitorProfile>;
