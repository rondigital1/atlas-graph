import { TripPlanSchema, TripRequestSchema } from "@atlas-graph/core/schemas";
import { describe, expect, it } from "vitest";

import { InMemoryPlanningRunRepository } from "./in-memory-planning-run-repository";

function createTripRequest() {
  return TripRequestSchema.parse({
    destination: "Tokyo",
    startDate: "2026-04-10",
    endDate: "2026-04-15",
    budget: "medium",
    interests: ["food", "culture"],
    travelStyle: "balanced",
    groupType: "friends",
  });
}

function createTripPlan() {
  return TripPlanSchema.parse({
    destinationSummary: "Tokyo offers varied neighborhoods, food, and culture.",
    tripStyleSummary: "A balanced city itinerary with food and cultural stops.",
    practicalNotes: ["Carry a light layer for the evenings."],
    days: [
      {
        dayNumber: 1,
        date: "2026-04-10",
        theme: "Shrines and neighborhood walks",
        morning: [],
        afternoon: [],
        evening: [],
      },
    ],
    topRecommendations: [],
    warnings: [],
    rationale: "The plan keeps the pacing balanced and realistic.",
  });
}

describe("InMemoryPlanningRunRepository", () => {
  it("stores cloned records so external mutation does not leak back in", async () => {
    const repository = new InMemoryPlanningRunRepository();
    const request = createTripRequest();
    const createdAt = new Date("2026-01-01T10:00:00.000Z");
    const createdRun = await repository.createRun({
      id: "run-1",
      userId: "user-1",
      sessionId: "session-1",
      requestId: "request-1",
      inputSnapshot: request,
      normalizedInput: request,
      plannerProvider: "test-provider",
      plannerModel: "test-model",
      plannerVersion: "v1",
      startedAt: createdAt,
      createdAt,
    });

    createdRun.status = "partial";
    createdRun.inputSnapshot.destination = "Paris";

    const storedRun = await repository.getRunById("run-1");

    expect(storedRun?.status).toBe("running");
    expect(storedRun?.inputSnapshot.destination).toBe("Tokyo");
  });

  it("updates timestamps on success and lists newest runs first", async () => {
    const repository = new InMemoryPlanningRunRepository();
    const request = createTripRequest();
    const tripPlan = createTripPlan();
    const firstCreatedAt = new Date("2026-01-01T10:00:00.000Z");
    const secondCreatedAt = new Date("2026-01-01T10:05:00.000Z");
    const completedAt = new Date("2026-01-01T10:05:30.000Z");

    await repository.createRun({
      id: "run-1",
      userId: "user-1",
      sessionId: "session-1",
      requestId: "request-1",
      inputSnapshot: request,
      normalizedInput: request,
      plannerProvider: "test-provider",
      plannerModel: "test-model",
      plannerVersion: "v1",
      startedAt: firstCreatedAt,
      createdAt: firstCreatedAt,
    });
    await repository.createRun({
      id: "run-2",
      userId: "user-1",
      sessionId: "session-2",
      requestId: "request-2",
      inputSnapshot: request,
      normalizedInput: request,
      plannerProvider: "test-provider",
      plannerModel: "test-model",
      plannerVersion: "v1",
      startedAt: secondCreatedAt,
      createdAt: secondCreatedAt,
    });

    await repository.markSucceeded({
      id: "run-2",
      outputPlan: tripPlan,
      outputSummary: {
        destinationSummary: tripPlan.destinationSummary,
        tripStyleSummary: tripPlan.tripStyleSummary,
        dayCount: tripPlan.days.length,
        topRecommendationCount: tripPlan.topRecommendations.length,
        warningCount: tripPlan.warnings.length,
      },
      completedAt,
      durationMs: 30000,
    });

    const listedRuns = await repository.listRuns({
      userId: "user-1",
    });

    expect(listedRuns.map((run) => run.id)).toEqual(["run-2", "run-1"]);
    expect(listedRuns[0]?.updatedAt).toEqual(completedAt);
    expect(listedRuns[0]?.status).toBe("succeeded");
  });
});
