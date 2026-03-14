import { TripRequestSchema } from "@atlas-graph/core";
import type { PrismaClient } from "../../generated/prisma/client";
import { describe, expect, it, vi } from "vitest";

import {
  createTravelPlanRepository,
  travelPlanSelect,
} from "./travel-plans";

function createTripRequest() {
  return TripRequestSchema.parse({
    destination: "Lisbon, Portugal",
    startDate: "2026-06-12",
    endDate: "2026-06-18",
    budget: "medium",
    interests: ["Food & Dining", "Walkable"],
    travelStyle: "balanced",
    groupType: "couple",
  });
}

function createRecord(overrides: {
  createdAt?: Date;
  id?: string;
  input?: unknown;
  status?: "DRAFT" | "DONE" | "ERROR" | "GENERATING";
  updatedAt?: Date;
  userId?: string;
} = {}) {
  return {
    id: overrides.id ?? "plan-123",
    userId: overrides.userId ?? "user-123",
    status: overrides.status ?? "DRAFT",
    input: overrides.input ?? createTripRequest(),
    createdAt: overrides.createdAt ?? new Date("2026-03-12T12:00:00.000Z"),
    updatedAt: overrides.updatedAt ?? new Date("2026-03-12T12:30:00.000Z"),
  };
}

function createClient(record = createRecord()) {
  const client = {
    travelPlan: {
      create: vi.fn().mockResolvedValue(record),
      findUnique: vi.fn().mockResolvedValue(record),
      findMany: vi.fn().mockResolvedValue([record]),
      update: vi.fn().mockResolvedValue(record),
      delete: vi.fn().mockResolvedValue(record),
    },
  };

  return {
    client: client as unknown as PrismaClient,
    mocks: client,
  };
}

describe("TravelPlanRepository", () => {
  it("creates a plan with validated TripRequest input and default draft status", async () => {
    const { client, mocks } = createClient();
    const repository = createTravelPlanRepository(client);
    const request = createTripRequest();

    const result = await repository.createPlan({
      userId: "user-123",
      input: request,
    });

    expect(mocks.travelPlan.create).toHaveBeenCalledWith({
      data: {
        userId: "user-123",
        status: "DRAFT",
        input: request,
      },
      select: travelPlanSelect,
    });
    expect(result).toEqual({
      id: "plan-123",
      userId: "user-123",
      status: "draft",
      input: request,
      createdAt: new Date("2026-03-12T12:00:00.000Z"),
      updatedAt: new Date("2026-03-12T12:30:00.000Z"),
    });
  });

  it("returns a mapped plan by id when it exists", async () => {
    const { client, mocks } = createClient();
    const repository = createTravelPlanRepository(client);

    const result = await repository.getPlanById("plan-123");

    expect(mocks.travelPlan.findUnique).toHaveBeenCalledWith({
      where: {
        id: "plan-123",
      },
      select: travelPlanSelect,
    });
    expect(result?.status).toBe("draft");
  });

  it("returns null when a plan is not found by id", async () => {
    const { client } = createClient();
    const repository = createTravelPlanRepository(client);
    vi.mocked(client.travelPlan.findUnique).mockResolvedValueOnce(null);

    const result = await repository.getPlanById("missing");

    expect(result).toBeNull();
  });

  it("lists plans with deterministic ordering and respects take", async () => {
    const recordA = createRecord({
      id: "plan-2",
      status: "DONE",
      updatedAt: new Date("2026-03-12T12:31:00.000Z"),
    });
    const recordB = createRecord({
      id: "plan-1",
      updatedAt: new Date("2026-03-12T12:30:00.000Z"),
    });
    const { client, mocks } = createClient();
    vi.mocked(client.travelPlan.findMany).mockResolvedValueOnce([recordA, recordB]);
    const repository = createTravelPlanRepository(client);

    const result = await repository.listPlans({
      take: 10,
    });

    expect(mocks.travelPlan.findMany).toHaveBeenCalledWith({
      where: undefined,
      take: 10,
      orderBy: [
        {
          updatedAt: "desc",
        },
        {
          id: "desc",
        },
      ],
      select: travelPlanSelect,
    });
    expect(result.map((plan) => plan.id)).toEqual(["plan-2", "plan-1"]);
    expect(result.map((plan) => plan.status)).toEqual(["done", "draft"]);
  });

  it("filters listed plans by userId when provided", async () => {
    const { client, mocks } = createClient();
    const repository = createTravelPlanRepository(client);

    await repository.listPlans({
      userId: "user-999",
    });

    expect(mocks.travelPlan.findMany).toHaveBeenCalledWith({
      where: {
        userId: "user-999",
      },
      take: 50,
      orderBy: [
        {
          updatedAt: "desc",
        },
        {
          id: "desc",
        },
      ],
      select: travelPlanSelect,
    });
  });

  it("updates only the provided fields and returns the mapped entity", async () => {
    const record = createRecord({
      status: "DONE",
    });
    const { client, mocks } = createClient(record);
    const repository = createTravelPlanRepository(client);

    const result = await repository.updatePlan("plan-123", {
      status: "done",
    });

    expect(mocks.travelPlan.update).toHaveBeenCalledWith({
      where: {
        id: "plan-123",
      },
      data: {
        status: "DONE",
      },
      select: travelPlanSelect,
    });
    expect(result?.status).toBe("done");
  });

  it("returns null when update hits Prisma not-found behavior", async () => {
    const { client } = createClient();
    vi.mocked(client.travelPlan.update).mockRejectedValueOnce({
      code: "P2025",
    });
    const repository = createTravelPlanRepository(client);

    const result = await repository.updatePlan("missing", {
      status: "done",
    });

    expect(result).toBeNull();
  });

  it("deletes and returns the mapped entity", async () => {
    const record = createRecord({
      status: "ERROR",
    });
    const { client, mocks } = createClient(record);
    const repository = createTravelPlanRepository(client);

    const result = await repository.deletePlan("plan-123");

    expect(mocks.travelPlan.delete).toHaveBeenCalledWith({
      where: {
        id: "plan-123",
      },
      select: travelPlanSelect,
    });
    expect(result?.status).toBe("error");
  });

  it("returns null when delete hits Prisma not-found behavior", async () => {
    const { client } = createClient();
    vi.mocked(client.travelPlan.delete).mockRejectedValueOnce({
      code: "P2025",
    });
    const repository = createTravelPlanRepository(client);

    const result = await repository.deletePlan("missing");

    expect(result).toBeNull();
  });

  it("rejects invalid persisted input at the repository boundary", async () => {
    const record = createRecord({
      input: {
        destination: "Lisbon, Portugal",
      },
    });
    const { client } = createClient(record);
    const repository = createTravelPlanRepository(client);

    await expect(repository.getPlanById("plan-123")).rejects.toThrow();
  });
});
