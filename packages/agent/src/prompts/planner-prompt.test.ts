import { PlanningContextSchema, TripRequestSchema } from "@atlas-graph/core/schemas";
import type {
  DestinationSummary,
  PlaceCandidate,
  PlanningContext,
  TripRequest,
  WeatherSummary,
} from "@atlas-graph/core/types";
import { describe, expect, it } from "vitest";

import {
  buildPlannerPromptInput,
  PLANNER_PROMPT_VERSION,
  PLANNER_SYSTEM_PROMPT,
  promptRegistry,
  renderPlannerPlaceCandidates,
} from "./index";

function createTripRequest(overrides: Partial<TripRequest> = {}): TripRequest {
  return TripRequestSchema.parse({
    destination: "Tokyo",
    startDate: "2026-04-10",
    endDate: "2026-04-12",
    budget: "medium",
    interests: ["food", "culture"],
    travelStyle: "balanced",
    groupType: "friends",
    ...overrides,
  });
}

function createDestinationSummary(): DestinationSummary {
  return {
    destination: "Tokyo",
    country: "Japan",
    summary: "A dense city with strong neighborhood variety.",
    bestAreas: ["Shibuya", "Asakusa"],
    notes: ["Transit is efficient."],
  };
}

function createWeatherSummary(): WeatherSummary {
  return {
    destination: "Tokyo",
    summary: "Mild spring weather is typical.",
    dailyNotes: ["Pack a light layer for evenings."],
    averageHighC: 19,
    averageLowC: 11,
  };
}

function createPlaceCandidates(): PlaceCandidate[] {
  return [
    {
      id: "place-1",
      name: "Meiji Shrine",
      category: "attraction",
      source: "test-provider",
      summary: "A calm shrine and park complex.",
      rating: 4.7,
      address: "1-1 Yoyogikamizonocho, Shibuya City",
    },
    {
      id: "place-2",
      name: "Kappabashi Kitchen Street",
      category: "activity",
      source: "test-provider",
      summary: "A shopping street known for cookware and food models.",
      priceLevel: 2,
    },
  ];
}

function createPlanningContext(options: {
  destinationSummary?: DestinationSummary;
  placeCandidates?: PlaceCandidate[];
  requestOverrides?: Partial<TripRequest>;
  weatherSummary?: WeatherSummary;
} = {}): PlanningContext {
  const context: PlanningContext = {
    request: createTripRequest(options.requestOverrides),
    destinationSummary: createDestinationSummary(),
    weatherSummary: createWeatherSummary(),
    placeCandidates: createPlaceCandidates(),
  };

  if ("destinationSummary" in options) {
    context.destinationSummary = options.destinationSummary;
  }

  if ("weatherSummary" in options) {
    context.weatherSummary = options.weatherSummary;
  }

  if ("placeCandidates" in options) {
    context.placeCandidates = options.placeCandidates ?? [];
  }

  return PlanningContextSchema.parse(context);
}

describe("planner prompts", () => {
  it("exports a versioned planner prompt contract", () => {
    expect(PLANNER_PROMPT_VERSION).toBe("v1");
    expect(promptRegistry.planner.version).toBe("v1");
  });

  it("buildPlannerPromptInput includes destination, budget, travelStyle, and place data", () => {
    const promptInput = buildPlannerPromptInput(createPlanningContext());

    expect(promptInput).toContain("- destination: Tokyo");
    expect(promptInput).toContain("- budget: medium");
    expect(promptInput).toContain("- travelStyle: balanced");
    expect(promptInput).toContain("id: place-1");
    expect(promptInput).toContain("name: Meiji Shrine");
    expect(promptInput).toContain("category: attraction");
  });

  it("includes strict JSON-only instructions in the planner prompt assets", () => {
    expect(PLANNER_SYSTEM_PROMPT).toContain("Return valid JSON only.");
    expect(PLANNER_SYSTEM_PROMPT).toContain("Do not return markdown.");
    expect(PLANNER_SYSTEM_PROMPT).toContain("Do not use code fences.");
    expect(buildPlannerPromptInput(createPlanningContext())).toContain(
      "Return strict JSON only. No markdown, no code fences, no extra commentary."
    );
  });

  it("includes grounding and anti-hallucination rules", () => {
    expect(PLANNER_SYSTEM_PROMPT).toContain(
      "Do not invent named places, venues, neighborhoods, addresses, or factual claims"
    );
    expect(PLANNER_SYSTEM_PROMPT).toContain(
      "If no strong named recommendation exists for a slot, use a generic activity suggestion without inventing a specific place."
    );
    expect(PLANNER_SYSTEM_PROMPT).toContain(
      "When you use a supported named place, include its exact placeId."
    );
  });

  it("handles empty place-candidate sections safely", () => {
    const promptInput = buildPlannerPromptInput(
      createPlanningContext({ placeCandidates: [] })
    );

    expect(promptInput).toContain("Place candidates");
    expect(promptInput).toContain("- No named place candidates were provided.");
    expect(promptInput).not.toContain("undefined");
  });

  it("does not break when destination or weather summary is missing", () => {
    const promptInput = buildPlannerPromptInput(
      createPlanningContext({
        destinationSummary: undefined,
        weatherSummary: undefined,
      })
    );

    expect(promptInput).toContain("- No destination summary was provided.");
    expect(promptInput).toContain("- No weather summary was provided.");
    expect(promptInput).toContain(
      "- requiredDates: 2026-04-10, 2026-04-11, 2026-04-12"
    );
  });

  it("renders place candidates without empty-field noise", () => {
    const renderedCandidates = renderPlannerPlaceCandidates([
      {
        id: "place-3",
        name: "Tsukiji Outer Market",
        category: "restaurant",
        source: "test-provider",
      },
    ]);

    expect(renderedCandidates).toContain("Category: Restaurants");
    expect(renderedCandidates).toContain("id: place-3");
    expect(renderedCandidates).toContain("category: restaurant");
    expect(renderedCandidates).not.toContain("rating:");
    expect(renderedCandidates).not.toContain("address:");
    expect(renderedCandidates).not.toContain("summary:");
  });
});
