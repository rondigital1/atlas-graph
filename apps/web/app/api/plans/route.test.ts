import { afterEach, describe, expect, it, vi } from "vitest";

const { createPlan, listPlans } = vi.hoisted(() => {
  return {
    createPlan: vi.fn(),
    listPlans: vi.fn(),
  };
});

vi.mock("../../../src/server/create-travel-plan-repository", () => {
  return {
    createTravelPlanRepository: () => {
      return {
        createPlan,
        listPlans,
      };
    },
  };
});

import { GET, POST } from "./route";

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

describe("/api/plans", () => {
  afterEach(() => {
    createPlan.mockReset();
    listPlans.mockReset();
  });

  it("lists plans with validated query params", async () => {
    listPlans.mockResolvedValue([
      createPersistedPlan(),
      createPersistedPlan({
        id: "plan-456",
        updatedAt: new Date("2026-03-12T13:00:00.000Z"),
      }),
    ]);

    const response = await GET(
      new Request("http://localhost/api/plans?userId=user-123&take=10")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(listPlans).toHaveBeenCalledWith({
      take: 10,
      userId: "user-123",
    });
    expect(body).toEqual({
      data: [
        {
          createdAt: "2026-03-12T12:00:00.000Z",
          id: "plan-123",
          input: createTripRequest(),
          status: "draft",
          updatedAt: "2026-03-12T12:30:00.000Z",
          userId: "user-123",
        },
        {
          createdAt: "2026-03-12T12:00:00.000Z",
          id: "plan-456",
          input: createTripRequest(),
          status: "draft",
          updatedAt: "2026-03-12T13:00:00.000Z",
          userId: "user-123",
        },
      ],
    });
  });

  it("returns 400 when query params are invalid", async () => {
    const response = await GET(
      new Request("http://localhost/api/plans?userId=user-123&take=0")
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("INVALID_REQUEST");
    expect(body.error.message).toBe("Request validation failed");
    expect(listPlans).not.toHaveBeenCalled();
  });

  it("creates a plan from the official persisted-plan request body", async () => {
    const plan = createPersistedPlan();
    createPlan.mockResolvedValue(plan);

    const response = await POST(
      new Request("http://localhost/api/plans", {
        method: "POST",
        body: JSON.stringify({
          input: createTripRequest(),
          status: "draft",
          userId: "user-123",
        }),
        headers: {
          "content-type": "application/json",
        },
      })
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(createPlan).toHaveBeenCalledWith({
      input: createTripRequest(),
      status: "draft",
      userId: "user-123",
    });
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

  it("creates a plan from the legacy bare TripRequest body", async () => {
    createPlan.mockResolvedValue(
      createPersistedPlan({
        userId: "legacy-mvp-user",
      })
    );

    const response = await POST(
      new Request("http://localhost/api/plans", {
        method: "POST",
        body: JSON.stringify(createTripRequest()),
        headers: {
          "content-type": "application/json",
        },
      })
    );

    expect(response.status).toBe(201);
    expect(createPlan).toHaveBeenCalledWith({
      input: createTripRequest(),
      userId: "legacy-mvp-user",
    });
  });

  it("returns 400 for malformed JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/plans", {
        method: "POST",
        body: "{bad json",
        headers: {
          "content-type": "application/json",
        },
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: {
        code: "INVALID_REQUEST",
        details: {
          body: ["Malformed JSON body."],
        },
        message: "Request validation failed",
      },
    });
  });

  it("returns 400 for invalid create payloads", async () => {
    const response = await POST(
      new Request("http://localhost/api/plans", {
        method: "POST",
        body: JSON.stringify({
          input: createTripRequest(),
          userId: "",
        }),
        headers: {
          "content-type": "application/json",
        },
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("INVALID_REQUEST");
    expect(body.error.message).toBe("Request validation failed");
    expect(createPlan).not.toHaveBeenCalled();
  });

  it("returns 500 when create fails unexpectedly", async () => {
    createPlan.mockRejectedValue(new Error("db offline"));

    const response = await POST(
      new Request("http://localhost/api/plans", {
        method: "POST",
        body: JSON.stringify({
          input: createTripRequest(),
          userId: "user-123",
        }),
        headers: {
          "content-type": "application/json",
        },
      })
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to create plan",
      },
    });
  });
});
