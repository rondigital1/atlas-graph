import { describe, expect, it } from "vitest";

import { TripPlanSchema } from "../../schemas/trip-plan";
import {
  GENERATION_RUN_STATUS_VALUES,
  GenerationRunSchema,
  GenerationRunStatusSchema,
  ItineraryContentSchema,
  ItineraryVersionSchema,
} from "./index";

function createRepresentativeTripPlan() {
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

function createTravelPlanInput() {
  return {
    origin: "New York",
    destination: "Tokyo",
    startDate: "2026-04-10",
    endDate: "2026-04-15",
    travelers: 2,
    budgetUsd: 3500,
    preferences: ["food", "culture"],
  };
}

function createItineraryVersion() {
  return {
    id: "version-123",
    planId: "plan-123",
    versionNumber: 1,
    content: createRepresentativeTripPlan(),
    generatedAt: new Date("2026-03-05T14:00:00.000Z"),
    runId: "run-123",
    isCurrent: true,
  };
}

function createPendingGenerationRun() {
  return {
    id: "run-123",
    planId: "plan-123",
    status: "pending" as const,
    inputSnapshot: createTravelPlanInput(),
    durationMs: 0,
  };
}

describe("GenerationRunStatusSchema", () => {
  it.each(GENERATION_RUN_STATUS_VALUES)("accepts %s", (status) => {
    const result = GenerationRunStatusSchema.safeParse(status);

    expect(result.success).toBe(true);
  });
});

describe("ItineraryContentSchema", () => {
  it("accepts the same representative output as TripPlanSchema", () => {
    const output = createRepresentativeTripPlan();

    expect(ItineraryContentSchema.parse(output)).toEqual(TripPlanSchema.parse(output));
  });
});

describe("ItineraryVersionSchema", () => {
  it("parses a valid itinerary version", () => {
    const result = ItineraryVersionSchema.safeParse(createItineraryVersion());

    expect(result.success).toBe(true);
  });

  it("rejects an empty id", () => {
    const result = ItineraryVersionSchema.safeParse({
      ...createItineraryVersion(),
      id: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["id"]);
  });

  it("rejects an empty planId", () => {
    const result = ItineraryVersionSchema.safeParse({
      ...createItineraryVersion(),
      planId: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["planId"]);
  });

  it("rejects a non-positive versionNumber", () => {
    const result = ItineraryVersionSchema.safeParse({
      ...createItineraryVersion(),
      versionNumber: 0,
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["versionNumber"]);
  });

  it("rejects invalid content", () => {
    const result = ItineraryVersionSchema.safeParse({
      ...createItineraryVersion(),
      content: {
        destinationSummary: "Tokyo only",
      },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path[0]).toBe("content");
  });

  it("rejects a non-Date generatedAt", () => {
    const result = ItineraryVersionSchema.safeParse({
      ...createItineraryVersion(),
      generatedAt: "2026-03-05T14:00:00.000Z",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["generatedAt"]);
  });

  it("rejects an empty runId", () => {
    const result = ItineraryVersionSchema.safeParse({
      ...createItineraryVersion(),
      runId: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["runId"]);
  });

  it("rejects a non-boolean isCurrent", () => {
    const result = ItineraryVersionSchema.safeParse({
      ...createItineraryVersion(),
      isCurrent: "yes",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["isCurrent"]);
  });
});

describe("GenerationRunSchema", () => {
  it("parses a valid pending generation run", () => {
    const result = GenerationRunSchema.safeParse(createPendingGenerationRun());

    expect(result.success).toBe(true);
  });

  it("parses a valid done generation run with versionId", () => {
    const result = GenerationRunSchema.safeParse({
      ...createPendingGenerationRun(),
      status: "done",
      versionId: "version-123",
      durationMs: 2450,
      providerData: { provider: "mock", toolsUsed: 3 },
    });

    expect(result.success).toBe(true);
  });

  it("parses a valid error generation run with error", () => {
    const result = GenerationRunSchema.safeParse({
      ...createPendingGenerationRun(),
      status: "error",
      durationMs: 1800,
      error: "Planner output failed validation.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty id", () => {
    const result = GenerationRunSchema.safeParse({
      ...createPendingGenerationRun(),
      id: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["id"]);
  });

  it("rejects an empty planId", () => {
    const result = GenerationRunSchema.safeParse({
      ...createPendingGenerationRun(),
      planId: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["planId"]);
  });

  it("rejects an invalid status", () => {
    const result = GenerationRunSchema.safeParse({
      ...createPendingGenerationRun(),
      status: "failed",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["status"]);
  });

  it("rejects an invalid inputSnapshot", () => {
    const result = GenerationRunSchema.safeParse({
      ...createPendingGenerationRun(),
      inputSnapshot: {
        destination: "Tokyo",
      },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path[0]).toBe("inputSnapshot");
  });

  it("rejects a negative durationMs", () => {
    const result = GenerationRunSchema.safeParse({
      ...createPendingGenerationRun(),
      durationMs: -1,
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["durationMs"]);
  });

  it("rejects an empty versionId", () => {
    const result = GenerationRunSchema.safeParse({
      ...createPendingGenerationRun(),
      versionId: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["versionId"]);
  });

  it("rejects an empty error", () => {
    const result = GenerationRunSchema.safeParse({
      ...createPendingGenerationRun(),
      status: "error",
      error: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["error"]);
  });
});
