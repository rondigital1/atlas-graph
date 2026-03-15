import type {
  ItineraryVersionRepository,
  TravelPlanRepository,
} from "@atlas-graph/db";
import { describe, expect, it, vi } from "vitest";

import { DefaultTravelPlanVersionQueryService } from "./travel-plan-version-query-service";

function createTripRequest() {
  return {
    budget: "medium" as const,
    destination: "Lisbon, Portugal",
    endDate: "2026-06-18",
    groupType: "couple" as const,
    interests: ["Food & Dining", "Walkable"],
    startDate: "2026-06-12",
    travelStyle: "balanced" as const,
  };
}

function createPlanRepository(found = true): TravelPlanRepository {
  return {
    createPlan: vi.fn(),
    getPlanById: vi.fn().mockResolvedValue(
      found
        ? {
            id: "plan-123",
            userId: "user-123",
            status: "draft",
            input: createTripRequest(),
            createdAt: new Date("2026-03-12T12:00:00.000Z"),
            updatedAt: new Date("2026-03-12T12:30:00.000Z"),
          }
        : null
    ),
    listPlans: vi.fn(),
    updatePlan: vi.fn(),
    deletePlan: vi.fn(),
  };
}

function createVersionRepository(): ItineraryVersionRepository {
  return {
    listVersionsForPlan: vi.fn().mockResolvedValue([
      {
        id: "version-2",
        planId: "plan-123",
        versionNumber: 2,
        content: {
          destinationSummary: "Lisbon",
          tripStyleSummary: "Balanced",
          practicalNotes: [],
          days: [],
          topRecommendations: [],
          warnings: [],
          rationale: "Rationale",
        },
        generatedAt: new Date("2026-03-12T12:30:00.000Z"),
        runId: "run-123",
        isCurrent: true,
        generationRun: {
          id: "run-123",
          planId: "plan-123",
          status: "done",
          modelProvider: "openai",
          modelName: "gpt-5-mini",
          modelVersion: "2026-03-01",
          durationMs: 5400,
          errorMessage: null,
          startedAt: new Date("2026-03-12T12:29:00.000Z"),
          completedAt: new Date("2026-03-12T12:29:05.400Z"),
          createdAt: new Date("2026-03-12T12:29:00.000Z"),
          updatedAt: new Date("2026-03-12T12:29:05.400Z"),
        },
      },
    ]),
  };
}

describe("DefaultTravelPlanVersionQueryService", () => {
  it("returns null when the plan does not exist", async () => {
    const travelPlanRepository = createPlanRepository(false);
    const itineraryVersionRepository = createVersionRepository();
    const service = new DefaultTravelPlanVersionQueryService({
      itineraryVersionRepository,
      travelPlanRepository,
    });

    const result = await service.listVersionsForPlan("missing");

    expect(travelPlanRepository.getPlanById).toHaveBeenCalledWith("missing");
    expect(itineraryVersionRepository.listVersionsForPlan).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it("returns versions when the plan exists", async () => {
    const travelPlanRepository = createPlanRepository(true);
    const itineraryVersionRepository = createVersionRepository();
    const service = new DefaultTravelPlanVersionQueryService({
      itineraryVersionRepository,
      travelPlanRepository,
    });

    const result = await service.listVersionsForPlan("plan-123");

    expect(travelPlanRepository.getPlanById).toHaveBeenCalledWith("plan-123");
    expect(itineraryVersionRepository.listVersionsForPlan).toHaveBeenCalledWith(
      "plan-123"
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]?.id).toBe("version-2");
  });
});
