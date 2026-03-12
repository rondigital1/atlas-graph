import { PlanningContextSchema, TripPlanSchema, TripRequestSchema } from "@atlas-graph/core/schemas";
import type {
  DestinationSummary,
  PlaceCandidate,
  PlanningContext,
  TripPlan,
  TripRequest,
  WeatherSummary,
} from "@atlas-graph/core/types";
import { describe, expect, it, vi } from "vitest";

import {
  PlannerChain,
  PlannerModelResponseError,
  PlannerOutputParseError,
  PlannerOutputValidationError,
} from "./index";
import type { PlannerModel } from "./planner-types";

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
    dailyNotes: ["Carry a light layer for evenings."],
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
    },
    {
      id: "place-2",
      name: "Tsukiji Outer Market",
      category: "restaurant",
      source: "test-provider",
      summary: "A lively market for seafood and snacks.",
    },
  ];
}

function createPlanningContext(): PlanningContext {
  return PlanningContextSchema.parse({
    request: createTripRequest(),
    destinationSummary: createDestinationSummary(),
    weatherSummary: createWeatherSummary(),
    placeCandidates: createPlaceCandidates(),
  });
}

function createTripPlan(): TripPlan {
  return TripPlanSchema.parse({
    destinationSummary: "Tokyo offers varied neighborhoods, food, and culture.",
    tripStyleSummary: "A balanced city itinerary with food and cultural stops.",
    practicalNotes: ["Carry a light layer for the evenings."],
    days: [
      {
        dayNumber: 1,
        date: "2026-04-10",
        theme: "Shrines and west-side neighborhoods",
        morning: [
          {
            title: "Visit Meiji Shrine",
            placeId: "place-1",
            description: "Start with a calm walk through the shrine grounds.",
          },
        ],
        afternoon: [],
        evening: [],
      },
      {
        dayNumber: 2,
        date: "2026-04-11",
        theme: "Food markets and city walks",
        morning: [],
        afternoon: [
          {
            title: "Explore Tsukiji Outer Market",
            placeId: "place-2",
            description: "Browse snacks and casual seafood options.",
          },
        ],
        evening: [],
      },
      {
        dayNumber: 3,
        date: "2026-04-12",
        theme: "Flexible neighborhood exploration",
        morning: [
          {
            title: "Slow neighborhood cafe crawl",
            description: "Choose a walkable area and keep the schedule light.",
          },
        ],
        afternoon: [],
        evening: [],
      },
    ],
    topRecommendations: [
      {
        placeId: "place-1",
        name: "Meiji Shrine",
        reason: "It fits the user's culture interest and relaxed morning pacing.",
      },
    ],
    warnings: [],
    rationale: "The plan balances culture, food, and realistic pacing.",
  });
}

function createSpyPlannerModel(text: string) {
  const generate = vi.fn<PlannerModel["generate"]>(async () =>
    Promise.resolve({ text }),
  );

  const model: PlannerModel = {
    generate,
  };

  return { generate, model };
}

describe("PlannerChain", () => {
  it("returns a valid trip plan for successful planner output", async () => {
    const plan = createTripPlan();
    const fencedPlan = `\`\`\`json\n${JSON.stringify(plan)}\n\`\`\``;
    const { model } = createSpyPlannerModel(fencedPlan);
    const chain = new PlannerChain({ model });

    const result = await chain.run(createPlanningContext());

    expect(result).toEqual(plan);
  });

  it("throws PlannerOutputParseError for malformed JSON output", async () => {
    const { model } = createSpyPlannerModel('{"destinationSummary":');
    const chain = new PlannerChain({ model });

    try {
      await chain.run(createPlanningContext());
      throw new Error("Expected PlannerOutputParseError.");
    } catch (error) {
      expect(error).toBeInstanceOf(PlannerOutputParseError);

      if (error instanceof PlannerOutputParseError) {
        expect(error.rawText).toBe('{"destinationSummary":');
      }
    }
  });

  it("throws PlannerOutputValidationError for schema-invalid JSON output", async () => {
    const invalidPlan = JSON.stringify({
      destinationSummary: "Tokyo",
      warnings: [],
      rationale: "Too incomplete to be valid.",
    });
    const { model } = createSpyPlannerModel(invalidPlan);
    const chain = new PlannerChain({ model });

    try {
      await chain.run(createPlanningContext());
      throw new Error("Expected PlannerOutputValidationError.");
    } catch (error) {
      expect(error).toBeInstanceOf(PlannerOutputValidationError);

      if (error instanceof PlannerOutputValidationError) {
        expect(error.rawText).toBe(invalidPlan);
        expect(error.validationError.message.length).toBeGreaterThan(0);
      }
    }
  });

  it("throws PlannerModelResponseError for empty model output", async () => {
    const { model } = createSpyPlannerModel("");
    const chain = new PlannerChain({ model });

    await expect(chain.run(createPlanningContext())).rejects.toBeInstanceOf(
      PlannerModelResponseError
    );
  });

  it("throws PlannerModelResponseError for whitespace-only model output", async () => {
    const { model } = createSpyPlannerModel("   \n\t  ");
    const chain = new PlannerChain({ model });

    await expect(chain.run(createPlanningContext())).rejects.toBeInstanceOf(
      PlannerModelResponseError
    );
  });

  it("passes both systemPrompt and userPrompt to the planner model", async () => {
    const plan = createTripPlan();
    const { generate, model } = createSpyPlannerModel(JSON.stringify(plan));
    const chain = new PlannerChain({ model });

    await chain.run(createPlanningContext());

    expect(generate).toHaveBeenCalledTimes(1);

    const invocation = generate.mock.calls[0]?.[0];

    expect(invocation?.systemPrompt).toContain("Return valid JSON only.");
    expect(invocation?.userPrompt).toContain("- destination: Tokyo");
    expect(invocation?.userPrompt).toContain("- budget: medium");
    expect(invocation?.userPrompt).toContain("- travelStyle: balanced");
  });
});
