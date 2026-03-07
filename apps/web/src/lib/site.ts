import { PROJECT_NAME } from "@atlas-graph/core/domain";

export const siteMetadata = {
  name: PROJECT_NAME,
  description:
    "Monorepo foundation for a future travel planner with a thin web surface and shared packages.",
} as const;

export const travelPlannerPlaceholders = [
  {
    label: "Future Surface 01",
    title: "Traveler Brief",
    description:
      "Placeholder for the future intake experience where trip constraints, preferences, and timing will be collected.",
  },
  {
    label: "Future Surface 02",
    title: "Itinerary Canvas",
    description:
      "Placeholder for the eventual trip draft UI that will assemble routes, stays, and activities once the planner exists.",
  },
  {
    label: "Future Surface 03",
    title: "Operational Sidebar",
    description:
      "Placeholder for validation, tool status, and system feedback once agent, API, and database modules are implemented.",
  },
] as const;
