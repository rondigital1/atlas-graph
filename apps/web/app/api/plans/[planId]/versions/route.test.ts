import { afterEach, describe, expect, it, vi } from "vitest";

const { listVersionsForPlan } = vi.hoisted(() => {
  return {
    listVersionsForPlan: vi.fn(),
  };
});

vi.mock(
  "../../../../../src/server/create-travel-plan-version-query-service",
  () => {
    return {
      createTravelPlanVersionQueryService: () => {
        return {
          listVersionsForPlan,
        };
      },
    };
  },
);

import { GET } from "./route";

function createTripPlan() {
  return {
    destinationSummary: "Lisbon with food and walkable neighborhoods.",
    tripStyleSummary: "Balanced city itinerary.",
    practicalNotes: ["Wear comfortable shoes."],
    days: [
      {
        dayNumber: 1,
        date: "2026-06-12",
        theme: "Old town",
        morning: [],
        afternoon: [],
        evening: [],
      },
    ],
    topRecommendations: [],
    warnings: [],
    rationale: "A realistic first version.",
  };
}

function createVersion() {
  return {
    id: "version-2",
    planId: "plan-123",
    versionNumber: 2,
    content: createTripPlan(),
    generatedAt: new Date("2026-03-12T12:30:00.000Z"),
    runId: "run-123",
    isCurrent: true,
    generationRun: {
      id: "run-123",
      planId: "plan-123",
      status: "done" as const,
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
  };
}

describe("GET /api/plans/[planId]/versions", () => {
  afterEach(() => {
    listVersionsForPlan.mockReset();
  });

  it("returns ordered version history for an existing plan", async () => {
    listVersionsForPlan.mockResolvedValue([createVersion()]);

    const response = await GET(
      new Request("http://localhost/api/plans/plan-123/versions"),
      {
        params: Promise.resolve({
          planId: "plan-123",
        }),
      },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(listVersionsForPlan).toHaveBeenCalledWith("plan-123");
    expect(body).toEqual({
      data: [
        {
          id: "version-2",
          planId: "plan-123",
          versionNumber: 2,
          content: createTripPlan(),
          generatedAt: "2026-03-12T12:30:00.000Z",
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
            startedAt: "2026-03-12T12:29:00.000Z",
            completedAt: "2026-03-12T12:29:05.400Z",
            createdAt: "2026-03-12T12:29:00.000Z",
            updatedAt: "2026-03-12T12:29:05.400Z",
          },
        },
      ],
    });
  });

  it("returns an empty list when the plan exists but has no versions", async () => {
    listVersionsForPlan.mockResolvedValue([]);

    const response = await GET(
      new Request("http://localhost/api/plans/plan-123/versions"),
      {
        params: Promise.resolve({
          planId: "plan-123",
        }),
      },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: [],
    });
  });

  it("returns 404 when the plan does not exist", async () => {
    listVersionsForPlan.mockResolvedValue(null);

    const response = await GET(
      new Request("http://localhost/api/plans/missing/versions"),
      {
        params: Promise.resolve({
          planId: "missing",
        }),
      },
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      error: {
        code: "NOT_FOUND",
        message: "Plan not found",
      },
    });
  });
});
