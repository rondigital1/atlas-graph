import { afterEach, describe, expect, it, vi } from "vitest";

const { getRunDetailById, getPlanById, planTripWithRun, updatePlan } =
  vi.hoisted(() => {
    return {
      getPlanById: vi.fn(),
      getRunDetailById: vi.fn(),
      planTripWithRun: vi.fn(),
      updatePlan: vi.fn(),
    };
  });

vi.mock("../../../../../src/server/create-planning-run-query-service", () => {
  return {
    createPlanningRunQueryService: () => {
      return {
        getRunDetailById,
      };
    },
  };
});

vi.mock("../../../../../src/server/create-travel-plan-repository", () => {
  return {
    createTravelPlanRepository: () => {
      return {
        getPlanById,
        updatePlan,
      };
    },
  };
});

vi.mock("../../../../../src/server/create-plan-trip-workflow-service", () => {
  return {
    createPlanTripWorkflowService: () => {
      return {
        planTripWithRun,
      };
    },
  };
});

import { POST } from "./route";

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

describe("POST /api/plans/[planId]/generate", () => {
  afterEach(() => {
    getPlanById.mockReset();
    getRunDetailById.mockReset();
    planTripWithRun.mockReset();
    updatePlan.mockReset();
  });

  it("generates a new planning run from a persisted plan", async () => {
    getPlanById.mockResolvedValue({
      id: "plan-123",
      input: createTripRequest(),
      userId: "user-123",
    });
    planTripWithRun.mockResolvedValue({
      plan: {
        destinationSummary: "Lisbon",
      },
      runId: "run-123",
    });
    updatePlan.mockResolvedValue({
      id: "plan-123",
    });

    const response = await POST(
      new Request("http://localhost/api/plans/plan-123/generate", {
        method: "POST",
      }),
      {
        params: Promise.resolve({
          planId: "plan-123",
        }),
      }
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      id: "run-123",
    });
    expect(planTripWithRun).toHaveBeenCalledWith({
      request: createTripRequest(),
      userId: "user-123",
    });
    expect(updatePlan).toHaveBeenNthCalledWith(1, "plan-123", {
      status: "generating",
    });
    expect(updatePlan).toHaveBeenNthCalledWith(2, "plan-123", {
      status: "done",
    });
    expect(getRunDetailById).not.toHaveBeenCalled();
  });

  it("keeps the legacy success path for existing planning runs", async () => {
    getPlanById.mockResolvedValue(null);
    getRunDetailById.mockResolvedValue({
      run: {
        id: "run-123",
      },
    });

    const response = await POST(
      new Request("http://localhost/api/plans/run-123/generate", {
        method: "POST",
      }),
      {
        params: Promise.resolve({
          planId: "run-123",
        }),
      }
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      id: "run-123",
    });
    expect(planTripWithRun).not.toHaveBeenCalled();
  });

  it("returns 404 when neither a persisted plan nor a legacy run exists", async () => {
    getPlanById.mockResolvedValue(null);
    getRunDetailById.mockResolvedValue(null);

    const response = await POST(
      new Request("http://localhost/api/plans/missing/generate", {
        method: "POST",
      }),
      {
        params: Promise.resolve({
          planId: "missing",
        }),
      }
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "NOT_FOUND",
        message: "Plan not found",
      },
    });
  });

  it("marks the plan as errored when generation fails", async () => {
    getPlanById.mockResolvedValue({
      id: "plan-123",
      input: createTripRequest(),
      userId: "user-123",
    });
    planTripWithRun.mockRejectedValue(new Error("planner failed"));
    updatePlan.mockResolvedValue({
      id: "plan-123",
    });

    const response = await POST(
      new Request("http://localhost/api/plans/plan-123/generate", {
        method: "POST",
      }),
      {
        params: Promise.resolve({
          planId: "plan-123",
        }),
      }
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to generate plan",
      },
    });
    expect(updatePlan).toHaveBeenNthCalledWith(1, "plan-123", {
      status: "generating",
    });
    expect(updatePlan).toHaveBeenNthCalledWith(2, "plan-123", {
      status: "error",
    });
  });
});
