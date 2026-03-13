import {
  PlanningContextSchema,
  ToolResultSchema,
  TripPlanSchema,
  TripRequestSchema,
} from "@atlas-graph/core/schemas";
import type {
  PlanningContext,
  ToolResult,
  TripPlan,
  TripRequest,
} from "@atlas-graph/core/types";
import { describe, expect, it, vi } from "vitest";

import { InMemoryPlanningRunRepository } from "./in-memory-planning-run-repository";
import { PlanTripWorkflowService } from "./plan-trip-workflow-service";
import { PlannerOutputParseError } from "../planner/errors";
import { PLANNER_PROMPT_VERSION } from "../prompts/planner-prompt-version";

function createTripRequest(overrides: Partial<TripRequest> = {}): TripRequest {
  return TripRequestSchema.parse({
    destination: "Tokyo",
    startDate: "2026-04-10",
    endDate: "2026-04-15",
    budget: "medium",
    interests: ["food", "culture"],
    travelStyle: "balanced",
    groupType: "friends",
    ...overrides,
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

function createPlanningContext(request: TripRequest): PlanningContext {
  return PlanningContextSchema.parse({
    request,
    destinationSummary: {
      destination: request.destination,
      country: "Japan",
      summary: "A dense city with strong neighborhood variety.",
      bestAreas: ["Shibuya"],
      notes: ["Transit is efficient."],
    },
    weatherSummary: {
      destination: request.destination,
      summary: "Mild spring weather is typical.",
      dailyNotes: ["Pack a light layer for evenings."],
      averageHighC: 19,
      averageLowC: 11,
    },
    placeCandidates: [
      {
        id: "place-1",
        name: "Meiji Shrine",
        category: "attraction",
        source: "normalized-provider",
        summary: "A calm shrine and park complex.",
      },
    ],
  });
}

function createToolResults(context: PlanningContext): ToolResult[] {
  return [
    ToolResultSchema.parse({
      toolName: "destination-summary",
      toolCategory: "normalized-context",
      provider: "normalized-provider",
      status: "SUCCEEDED",
      payload: context.destinationSummary,
    }),
    ToolResultSchema.parse({
      toolName: "weather-summary",
      toolCategory: "normalized-context",
      provider: "normalized-provider",
      status: "SUCCEEDED",
      payload: context.weatherSummary,
    }),
    ToolResultSchema.parse({
      toolName: "place-candidates",
      toolCategory: "normalized-context",
      provider: "normalized-provider",
      status: "SUCCEEDED",
      payload: context.placeCandidates,
    }),
  ];
}

function createGeneratePlanResult(request: TripRequest, plan: TripPlan) {
  const context = createPlanningContext(request);

  return {
    plan,
    context,
    toolResults: createToolResults(context),
  };
}

function createDeps(overrides: {
  now?: () => Date;
} = {}) {
  const planningRunRepository = new InMemoryPlanningRunRepository();
  const tripPlan = createTripPlan();
  const request = createTripRequest();
  const now =
    overrides.now ??
    vi
      .fn<() => Date>()
      .mockReturnValueOnce(new Date("2026-01-01T10:00:00.000Z"))
      .mockReturnValueOnce(new Date("2026-01-01T10:00:01.000Z"));

  return {
    planningRunRepository,
    tripPlan,
    deps: {
      travelPlanningService: {
        normalizeRequest: vi.fn((input: TripRequest) => {
          return TripRequestSchema.parse(structuredClone(input));
        }),
        generatePlanResult: vi
          .fn()
          .mockResolvedValue(createGeneratePlanResult(request, tripPlan)),
      },
      planningRunRepository,
      idGenerator: vi.fn().mockReturnValue("run-123"),
      now,
      plannerMetadata: {
        provider: "test-provider",
        model: "test-model",
        version: PLANNER_PROMPT_VERSION,
      },
    },
  };
}

describe("PlanTripWorkflowService", () => {
  it("creates a running run before planner execution", async () => {
    const request = createTripRequest();
    const planningRunRepository = new InMemoryPlanningRunRepository();
    const tripPlan = createTripPlan();
    const travelPlanningService = {
      normalizeRequest: vi.fn((input: TripRequest) => {
        return TripRequestSchema.parse(structuredClone(input));
      }),
      generatePlanResult: vi.fn(async () => {
        const run = await planningRunRepository.getRunById("run-123");

        expect(run).not.toBeNull();
        expect(run?.status).toBe("running");
        expect(run?.requestId).toBe("run-123");

        return createGeneratePlanResult(request, tripPlan);
      }),
    };
    const service = new PlanTripWorkflowService({
      travelPlanningService,
      planningRunRepository,
      idGenerator: vi.fn().mockReturnValue("run-123"),
      now: vi
        .fn<() => Date>()
        .mockReturnValueOnce(new Date("2026-01-01T10:00:00.000Z"))
        .mockReturnValueOnce(new Date("2026-01-01T10:00:01.000Z")),
      plannerMetadata: {
        provider: "test-provider",
        model: "test-model",
        version: PLANNER_PROMPT_VERSION,
      },
    });

    const result = await service.planTrip({
      request,
    });

    expect(result).toEqual(tripPlan);
    expect(travelPlanningService.generatePlanResult).toHaveBeenCalledTimes(1);
  });

  it("marks succeeded when planning returns and persists summary metadata", async () => {
    const request = createTripRequest();
    const startedAt = new Date("2026-01-01T10:00:00.000Z");
    const completedAt = new Date("2026-01-01T10:00:02.500Z");
    const now = vi
      .fn<() => Date>()
      .mockReturnValueOnce(startedAt)
      .mockReturnValueOnce(completedAt);
    const { planningRunRepository, tripPlan, deps } = createDeps({
      now,
    });
    const service = new PlanTripWorkflowService(deps);

    const result = await service.planTrip({
      request,
      userId: "user-123",
      sessionId: "session-456",
      requestId: "request-789",
    });

    expect(result).toEqual(tripPlan);

    const run = await planningRunRepository.getRunById("run-123");

    expect(run).toEqual({
      id: "run-123",
      userId: "user-123",
      sessionId: "session-456",
      requestId: "request-789",
      status: "succeeded",
      inputSnapshot: request,
      normalizedInput: request,
      plannerProvider: "test-provider",
      plannerModel: "test-model",
      plannerVersion: PLANNER_PROMPT_VERSION,
      outputPlan: tripPlan,
      outputSummary: {
        destinationSummary: tripPlan.destinationSummary,
        tripStyleSummary: tripPlan.tripStyleSummary,
        dayCount: 1,
        topRecommendationCount: 1,
        warningCount: 0,
      },
      errorCode: null,
      errorMessage: null,
      errorDetails: null,
      startedAt,
      completedAt,
      durationMs: 2500,
      createdAt: startedAt,
      updatedAt: completedAt,
    });
  });

  it("marks failed when planning throws and rethrows the original error", async () => {
    const request = createTripRequest();
    const startedAt = new Date("2026-01-01T10:00:00.000Z");
    const completedAt = new Date("2026-01-01T10:00:03.250Z");
    const now = vi
      .fn<() => Date>()
      .mockReturnValueOnce(startedAt)
      .mockReturnValueOnce(completedAt);
    const planningRunRepository = new InMemoryPlanningRunRepository();
    const plannerError = new Error("planner failed");
    const service = new PlanTripWorkflowService({
      travelPlanningService: {
        normalizeRequest: vi.fn((input: TripRequest) => {
          return TripRequestSchema.parse(structuredClone(input));
        }),
        generatePlanResult: vi.fn().mockRejectedValue(plannerError),
      },
      planningRunRepository,
      idGenerator: vi.fn().mockReturnValue("run-123"),
      now,
      plannerMetadata: {
        provider: "test-provider",
        model: "test-model",
        version: PLANNER_PROMPT_VERSION,
      },
    });

    await expect(
      service.planTrip({
        request,
      })
    ).rejects.toBe(plannerError);

    const run = await planningRunRepository.getRunById("run-123");

    expect(run).toEqual({
      id: "run-123",
      userId: null,
      sessionId: null,
      requestId: "run-123",
      status: "failed",
      inputSnapshot: request,
      normalizedInput: request,
      plannerProvider: "test-provider",
      plannerModel: "test-model",
      plannerVersion: PLANNER_PROMPT_VERSION,
      outputPlan: null,
      outputSummary: null,
      errorCode: "UNEXPECTED_ERROR",
      errorMessage: "planner failed",
      errorDetails: {
        name: "Error",
        cause: null,
      },
      startedAt,
      completedAt,
      durationMs: 3250,
      createdAt: startedAt,
      updatedAt: completedAt,
    });
  });

  it("uses runId as the fallback requestId and normalizes blank metadata values", async () => {
    const request = createTripRequest();
    const { planningRunRepository, deps } = createDeps();
    const service = new PlanTripWorkflowService(deps);

    await service.planTrip({
      request,
      userId: "   ",
      sessionId: "",
      requestId: "  ",
    });

    const run = await planningRunRepository.getRunById("run-123");

    expect(run?.userId).toBeNull();
    expect(run?.sessionId).toBeNull();
    expect(run?.requestId).toBe("run-123");
  });

  it("persists mapped planner errors for known planner failure types", async () => {
    const request = createTripRequest();
    const planningRunRepository = new InMemoryPlanningRunRepository();
    const plannerError = new PlannerOutputParseError(
      "Planner output could not be parsed as JSON.",
      "{bad"
    );
    const service = new PlanTripWorkflowService({
      travelPlanningService: {
        normalizeRequest: vi.fn((input: TripRequest) => {
          return TripRequestSchema.parse(structuredClone(input));
        }),
        generatePlanResult: vi.fn().mockRejectedValue(plannerError),
      },
      planningRunRepository,
      idGenerator: vi.fn().mockReturnValue("run-123"),
      now: vi
        .fn<() => Date>()
        .mockReturnValueOnce(new Date("2026-01-01T10:00:00.000Z"))
        .mockReturnValueOnce(new Date("2026-01-01T10:00:00.500Z")),
      plannerMetadata: {
        provider: "test-provider",
        model: "test-model",
        version: PLANNER_PROMPT_VERSION,
      },
    });

    await expect(
      service.planTrip({
        request,
      })
    ).rejects.toBe(plannerError);

    const run = await planningRunRepository.getRunById("run-123");

    expect(run?.errorCode).toBe("PLANNER_OUTPUT_PARSE_ERROR");
    expect(run?.errorMessage).toBe("Planner output could not be parsed as JSON.");
    expect(run?.errorDetails).toEqual({
      name: "PlannerOutputParseError",
      rawText: "{bad",
      cause: null,
    });
  });

  it("passes inspectable tool results into markSucceeded", async () => {
    const request = createTripRequest();
    const tripPlan = createTripPlan();
    const generatedResult = createGeneratePlanResult(request, tripPlan);
    const planningRunRepository = {
      createRun: vi.fn().mockResolvedValue({}),
      markSucceeded: vi.fn().mockResolvedValue({}),
      markFailed: vi.fn().mockResolvedValue({}),
      getRunById: vi.fn(),
      listRuns: vi.fn(),
    };
    const service = new PlanTripWorkflowService({
      travelPlanningService: {
        normalizeRequest: vi.fn((input: TripRequest) => {
          return TripRequestSchema.parse(structuredClone(input));
        }),
        generatePlanResult: vi.fn().mockResolvedValue(generatedResult),
      },
      planningRunRepository,
      idGenerator: vi.fn().mockReturnValue("run-123"),
      now: vi
        .fn<() => Date>()
        .mockReturnValueOnce(new Date("2026-01-01T10:00:00.000Z"))
        .mockReturnValueOnce(new Date("2026-01-01T10:00:01.000Z")),
      plannerMetadata: {
        provider: "test-provider",
        model: "test-model",
        version: PLANNER_PROMPT_VERSION,
      },
    });

    await service.planTrip({
      request,
    });

    expect(planningRunRepository.markSucceeded).toHaveBeenCalledTimes(1);
    expect(planningRunRepository.markSucceeded).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "run-123",
        outputPlan: tripPlan,
        toolResults: generatedResult.toolResults,
      })
    );
  });
});
