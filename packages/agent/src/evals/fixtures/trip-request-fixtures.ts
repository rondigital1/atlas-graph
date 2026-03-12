import { TripRequestSchema } from "@atlas-graph/core/schemas";
import type { TripRequest } from "@atlas-graph/core/types";

export interface PlannerEvalFixtureSignals {
  budgetKeywords: string[];
  styleKeywords: string[];
}

export interface PlannerEvalFixture {
  id: string;
  name: string;
  description: string;
  input: TripRequest;
  expectedSignals: PlannerEvalFixtureSignals;
}

function createPlannerEvalFixture(input: PlannerEvalFixture): PlannerEvalFixture {
  return {
    ...input,
    input: TripRequestSchema.parse(input.input),
  };
}

export const plannerEvalFixtures: PlannerEvalFixture[] = [
  createPlannerEvalFixture({
    id: "paris-medium-balanced",
    name: "Paris medium balanced",
    description:
      "Checks a mainstream Europe city-break case with medium budget tradeoffs and balanced pacing.",
    input: {
      destination: "Paris",
      startDate: "2026-04-10",
      endDate: "2026-04-13",
      budget: "medium",
      interests: ["art", "food", "culture"],
      travelStyle: "balanced",
      groupType: "couple",
    },
    expectedSignals: {
      budgetKeywords: ["balanced", "mix", "mid-range", "moderate"],
      styleKeywords: ["balanced", "mix", "varied"],
    },
  }),
  createPlannerEvalFixture({
    id: "tokyo-high-packed",
    name: "Tokyo high packed",
    description:
      "Covers a dense big-city itinerary where the planner should signal ambitious pacing and higher-end spend.",
    input: {
      destination: "Tokyo",
      startDate: "2026-04-10",
      endDate: "2026-04-14",
      budget: "high",
      interests: ["food", "culture", "nightlife"],
      travelStyle: "packed",
      groupType: "friends",
    },
    expectedSignals: {
      budgetKeywords: ["premium", "upscale", "splurge", "high-end"],
      styleKeywords: ["packed", "ambitious", "full", "maximize"],
    },
  }),
  createPlannerEvalFixture({
    id: "barcelona-low-relaxed",
    name: "Barcelona low relaxed",
    description:
      "Checks whether a lower-budget, slower-paced city trip keeps the tone lighter and more affordable.",
    input: {
      destination: "Barcelona",
      startDate: "2026-05-03",
      endDate: "2026-05-06",
      budget: "low",
      interests: ["architecture", "food", "walking"],
      travelStyle: "relaxed",
      groupType: "solo",
    },
    expectedSignals: {
      budgetKeywords: ["budget", "affordable", "value", "low-cost"],
      styleKeywords: ["relaxed", "slow", "easy", "light"],
    },
  }),
  createPlannerEvalFixture({
    id: "new-york-medium-balanced",
    name: "New York medium balanced",
    description:
      "Exercises a familiar urban itinerary where neighborhood grouping and moderate spend should come through.",
    input: {
      destination: "New York City",
      startDate: "2026-06-01",
      endDate: "2026-06-04",
      budget: "medium",
      interests: ["culture", "food", "parks"],
      travelStyle: "balanced",
      groupType: "family",
    },
    expectedSignals: {
      budgetKeywords: ["balanced", "mix", "mid-range", "moderate"],
      styleKeywords: ["balanced", "mix", "varied"],
    },
  }),
  createPlannerEvalFixture({
    id: "lisbon-fallback-balanced",
    name: "Lisbon fallback balanced",
    description:
      "Uses an unknown-destination fallback case to keep fixture coverage beyond the named mock destination catalog.",
    input: {
      destination: "Lisbon",
      startDate: "2026-07-08",
      endDate: "2026-07-10",
      budget: "medium",
      interests: ["architecture", "food"],
      travelStyle: "balanced",
      groupType: "friends",
    },
    expectedSignals: {
      budgetKeywords: ["balanced", "mix", "mid-range", "moderate"],
      styleKeywords: ["balanced", "mix", "varied"],
    },
  }),
];
