import { ToolResultSchema, TripPlanSchema, TripRequestSchema } from "@atlas-graph/core/schemas";
import type { PrismaClient } from "@atlas-graph/db";
import { describe, expect, it, vi } from "vitest";

import {
  DatabasePlanningRunRepository,
  createDatabasePlanningRunRepository,
} from "./database-planning-run-repository";

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
    topRecommendations: [
      {
        placeId: "place-1",
        name: "Meiji Shrine",
        reason: "It fits the user's culture interest.",
      },
    ],
    warnings: [],
    rationale: "The plan keeps the pacing balanced and realistic.",
  });
}

function createToolResults() {
  return [
    ToolResultSchema.parse({
      toolName: "destination-summary",
      toolCategory: "normalized-context",
      provider: "normalized-provider",
      status: "SUCCEEDED",
      payload: {
        destination: "Tokyo",
        summary: "A dense city with strong neighborhood variety.",
      },
    }),
    ToolResultSchema.parse({
      toolName: "weather-summary",
      toolCategory: "normalized-context",
      provider: "normalized-provider",
      status: "PARTIAL",
      payload: null,
    }),
  ];
}

function createPersistedRecord(overrides: {
  completedAt?: Date | null;
  errors?: Array<{
    id: string;
    plannerRunId: string;
    errorType: string | null;
    stepName: string | null;
    message: string;
    details: unknown;
    createdAt: Date;
  }>;
  output?: {
    id: string;
    plannerRunId: string;
    outputFormat: string | null;
    payload: unknown;
    createdAt: Date;
  } | null;
  status?: "FAILED" | "RUNNING" | "SUCCEEDED";
} = {}) {
  const request = createTripRequest();

  return {
    id: "run-123",
    status: overrides.status ?? "RUNNING",
    requestId: "request-123",
    destination: "Tokyo",
    startDate: new Date("2026-04-10T00:00:00.000Z"),
    endDate: new Date("2026-04-15T00:00:00.000Z"),
    budget: "medium",
    travelStyle: "balanced",
    groupType: "friends",
    modelName: "gpt-4.1-mini",
    promptVersion: "v1",
    orchestratorVersion: null,
    startedAt: new Date("2026-03-12T12:00:00.000Z"),
    completedAt: overrides.completedAt ?? null,
    createdAt: new Date("2026-03-12T12:00:00.000Z"),
    updatedAt: overrides.completedAt ?? new Date("2026-03-12T12:00:00.000Z"),
    input: {
      id: "input-1",
      plannerRunId: "run-123",
      payload: {
        inputSnapshot: request,
        normalizedInput: request,
        metadata: {
          userId: "user-123",
          sessionId: "session-456",
          plannerProvider: "openai",
        },
      },
      createdAt: new Date("2026-03-12T12:00:00.000Z"),
    },
    output: overrides.output ?? null,
    errors: overrides.errors ?? [],
  };
}

function createClient(record = createPersistedRecord()) {
  const client = {
    plannerRun: {
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      findUnique: vi.fn().mockResolvedValue(record),
      findMany: vi.fn().mockResolvedValue([record]),
    },
    plannerRunOutput: {
      upsert: vi.fn().mockResolvedValue({}),
    },
    plannerRunToolResult: {
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
      createMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
    plannerRunError: {
      create: vi.fn().mockResolvedValue({}),
    },
    $transaction: vi.fn(async (callback: (tx: PrismaClient) => Promise<unknown>) => {
      return await callback(client as unknown as PrismaClient);
    }),
  };

  return {
    client: client as unknown as PrismaClient,
    mocks: client,
  };
}

describe("DatabasePlanningRunRepository", () => {
  it("persists the run envelope into PlannerRun and PlannerRunInput", async () => {
    const { client, mocks } = createClient();
    const repository = new DatabasePlanningRunRepository(client);
    const request = createTripRequest();
    const createdAt = new Date("2026-03-12T12:00:00.000Z");

    const result = await repository.createRun({
      id: "run-123",
      userId: "user-123",
      sessionId: "session-456",
      requestId: "request-123",
      inputSnapshot: request,
      normalizedInput: request,
      plannerProvider: "openai",
      plannerModel: "gpt-4.1-mini",
      plannerVersion: "v1",
      startedAt: createdAt,
      createdAt,
    });

    expect(mocks.plannerRun.create).toHaveBeenCalledWith({
      data: {
        id: "run-123",
        status: "RUNNING",
        requestId: "request-123",
        destination: "Tokyo",
        startDate: new Date("2026-04-10T00:00:00.000Z"),
        endDate: new Date("2026-04-15T00:00:00.000Z"),
        budget: "medium",
        travelStyle: "balanced",
        groupType: "friends",
        modelName: "gpt-4.1-mini",
        promptVersion: "v1",
        startedAt: createdAt,
        createdAt,
        input: {
          create: {
            payload: {
              inputSnapshot: request,
              normalizedInput: request,
              metadata: {
                userId: "user-123",
                sessionId: "session-456",
                plannerProvider: "openai",
              },
            },
          },
        },
      },
    });
    expect(result.plannerProvider).toBe("openai");
    expect(result.inputSnapshot).toEqual(request);
  });

  it("persists normalized tool results and output on success", async () => {
    const completedAt = new Date("2026-03-12T12:00:05.000Z");
    const record = createPersistedRecord({
      status: "SUCCEEDED",
      completedAt,
      output: {
        id: "output-1",
        plannerRunId: "run-123",
        outputFormat: "json",
        payload: createTripPlan(),
        createdAt: completedAt,
      },
    });
    const { client, mocks } = createClient(record);
    const repository = createDatabasePlanningRunRepository(client);
    const plan = createTripPlan();
    const toolResults = createToolResults();

    const result = await repository.markSucceeded({
      id: "run-123",
      outputPlan: plan,
      outputSummary: {
        destinationSummary: plan.destinationSummary,
        tripStyleSummary: plan.tripStyleSummary,
        dayCount: plan.days.length,
        topRecommendationCount: plan.topRecommendations.length,
        warningCount: plan.warnings.length,
      },
      toolResults,
      completedAt,
      durationMs: 5000,
    });

    expect(mocks.plannerRun.update).toHaveBeenCalledWith({
      where: {
        id: "run-123",
      },
      data: {
        status: "SUCCEEDED",
        completedAt,
      },
    });
    expect(mocks.plannerRunOutput.upsert).toHaveBeenCalledWith({
      where: {
        plannerRunId: "run-123",
      },
      create: {
        plannerRunId: "run-123",
        outputFormat: "json",
        payload: plan,
      },
      update: {
        outputFormat: "json",
        payload: plan,
      },
    });
    expect(mocks.plannerRunToolResult.deleteMany).toHaveBeenCalledWith({
      where: {
        plannerRunId: "run-123",
      },
    });
    expect(mocks.plannerRunToolResult.createMany).toHaveBeenCalledWith({
      data: [
        {
          plannerRunId: "run-123",
          toolName: "destination-summary",
          toolCategory: "normalized-context",
          sequence: 1,
          status: "SUCCEEDED",
          provider: "normalized-provider",
          latencyMs: null,
          payload: {
            destination: "Tokyo",
            summary: "A dense city with strong neighborhood variety.",
          },
        },
        {
          plannerRunId: "run-123",
          toolName: "weather-summary",
          toolCategory: "normalized-context",
          sequence: 2,
          status: "PARTIAL",
          provider: "normalized-provider",
          latencyMs: null,
          payload: expect.anything(),
        },
      ],
    });
    expect(result.status).toBe("succeeded");
    expect(result.outputSummary?.dayCount).toBe(1);
  });

  it("persists mapped workflow errors on failure", async () => {
    const completedAt = new Date("2026-03-12T12:00:05.000Z");
    const record = createPersistedRecord({
      status: "FAILED",
      completedAt,
      errors: [
        {
          id: "error-1",
          plannerRunId: "run-123",
          errorType: "UNEXPECTED_ERROR",
          stepName: "plan-trip",
          message: "planner failed",
          details: {
            name: "Error",
          },
          createdAt: completedAt,
        },
      ],
    });
    const { client, mocks } = createClient(record);
    const repository = new DatabasePlanningRunRepository(client);

    const result = await repository.markFailed({
      id: "run-123",
      errorCode: "UNEXPECTED_ERROR",
      errorMessage: "planner failed",
      errorDetails: {
        name: "Error",
      },
      completedAt,
      durationMs: 5000,
    });

    expect(mocks.plannerRun.update).toHaveBeenCalledWith({
      where: {
        id: "run-123",
      },
      data: {
        status: "FAILED",
        completedAt,
      },
    });
    expect(mocks.plannerRunError.create).toHaveBeenCalledWith({
      data: {
        plannerRunId: "run-123",
        errorType: "UNEXPECTED_ERROR",
        stepName: "plan-trip",
        message: "planner failed",
        details: {
          name: "Error",
        },
      },
    });
    expect(result.status).toBe("failed");
    expect(result.errorCode).toBe("UNEXPECTED_ERROR");
  });
});
