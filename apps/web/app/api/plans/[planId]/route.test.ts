import { TravelPlanDeleteConflictError } from "@atlas-graph/db";
import { afterEach, describe, expect, it, vi } from "vitest";

const { deletePlan, getPlanById, updatePlan } = vi.hoisted(() => {
  return {
    deletePlan: vi.fn(),
    getPlanById: vi.fn(),
    updatePlan: vi.fn(),
  };
});

vi.mock("../../../../src/server/create-travel-plan-repository", () => {
  return {
    createTravelPlanRepository: () => {
      return {
        deletePlan,
        getPlanById,
        updatePlan,
      };
    },
  };
});

import { DELETE, GET, PATCH } from "./route";

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

function createPersistedPlan(overrides: {
  createdAt?: Date;
  id?: string;
  input?: ReturnType<typeof createTripRequest>;
  status?: "done" | "draft" | "error" | "generating";
  updatedAt?: Date;
  userId?: string;
} = {}) {
  return {
    createdAt: overrides.createdAt ?? new Date("2026-03-12T12:00:00.000Z"),
    id: overrides.id ?? "plan-123",
    input: overrides.input ?? createTripRequest(),
    status: overrides.status ?? "draft",
    updatedAt: overrides.updatedAt ?? new Date("2026-03-12T12:30:00.000Z"),
    userId: overrides.userId ?? "user-123",
  };
}

describe("/api/plans/[planId]", () => {
  afterEach(() => {
    deletePlan.mockReset();
    getPlanById.mockReset();
    updatePlan.mockReset();
  });

  it("returns the persisted plan on GET", async () => {
    getPlanById.mockResolvedValue(createPersistedPlan());

    const response = await GET(
      new Request("http://localhost/api/plans/plan-123"),
      {
        params: Promise.resolve({
          planId: "plan-123",
        }),
      }
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(getPlanById).toHaveBeenCalledWith("plan-123");
    expect(body).toEqual({
      data: {
        createdAt: "2026-03-12T12:00:00.000Z",
        id: "plan-123",
        input: createTripRequest(),
        status: "draft",
        updatedAt: "2026-03-12T12:30:00.000Z",
        userId: "user-123",
      },
    });
  });

  it("returns 404 when GET cannot find the plan", async () => {
    getPlanById.mockResolvedValue(null);

    const response = await GET(
      new Request("http://localhost/api/plans/missing"),
      {
        params: Promise.resolve({
          planId: "missing",
        }),
      }
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

  it("updates a plan from the official patch shape", async () => {
    updatePlan.mockResolvedValue(
      createPersistedPlan({
        status: "done",
      })
    );

    const response = await PATCH(
      new Request("http://localhost/api/plans/plan-123", {
        method: "PATCH",
        body: JSON.stringify({
          status: "done",
        }),
        headers: {
          "content-type": "application/json",
        },
      }),
      {
        params: Promise.resolve({
          planId: "plan-123",
        }),
      }
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(updatePlan).toHaveBeenCalledWith("plan-123", {
      status: "done",
    });
    expect(body.data.status).toBe("done");
  });

  it("updates a plan from the legacy bare TripRequest body", async () => {
    updatePlan.mockResolvedValue(createPersistedPlan());

    const response = await PATCH(
      new Request("http://localhost/api/plans/plan-123", {
        method: "PATCH",
        body: JSON.stringify(createTripRequest()),
        headers: {
          "content-type": "application/json",
        },
      }),
      {
        params: Promise.resolve({
          planId: "plan-123",
        }),
      }
    );

    expect(response.status).toBe(200);
    expect(updatePlan).toHaveBeenCalledWith("plan-123", {
      input: createTripRequest(),
    });
  });

  it("returns 400 when PATCH receives an empty resource body", async () => {
    const response = await PATCH(
      new Request("http://localhost/api/plans/plan-123", {
        method: "PATCH",
        body: JSON.stringify({}),
        headers: {
          "content-type": "application/json",
        },
      }),
      {
        params: Promise.resolve({
          planId: "plan-123",
        }),
      }
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("INVALID_REQUEST");
    expect(updatePlan).not.toHaveBeenCalled();
  });

  it("deletes an existing plan", async () => {
    deletePlan.mockResolvedValue(createPersistedPlan());

    const response = await DELETE(
      new Request("http://localhost/api/plans/plan-123", {
        method: "DELETE",
      }),
      {
        params: Promise.resolve({
          planId: "plan-123",
        }),
      }
    );

    expect(response.status).toBe(204);
    expect(deletePlan).toHaveBeenCalledWith("plan-123");
  });

  it("returns 404 when DELETE cannot find the plan", async () => {
    deletePlan.mockResolvedValue(null);

    const response = await DELETE(
      new Request("http://localhost/api/plans/missing", {
        method: "DELETE",
      }),
      {
        params: Promise.resolve({
          planId: "missing",
        }),
      }
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

  it("returns 409 when DELETE is blocked by related records", async () => {
    deletePlan.mockRejectedValue(new TravelPlanDeleteConflictError("plan-123"));

    const response = await DELETE(
      new Request("http://localhost/api/plans/plan-123", {
        method: "DELETE",
      }),
      {
        params: Promise.resolve({
          planId: "plan-123",
        }),
      }
    );
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body).toEqual({
      error: {
        code: "CONFLICT",
        message:
          "Plan cannot be deleted once generation or itinerary records exist",
      },
    });
  });
});
