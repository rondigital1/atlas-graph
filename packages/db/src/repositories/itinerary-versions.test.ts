import { TripPlanSchema } from "@atlas-graph/core";
import type { PrismaClient } from "../../generated/prisma/client";
import { describe, expect, it, vi } from "vitest";

import {
  createItineraryVersionRepository,
  itineraryVersionListSelect,
} from "./itinerary-versions";

function createTripPlan() {
  return TripPlanSchema.parse({
    destinationSummary: "Lisbon with food, walks, and neighborhood variety.",
    tripStyleSummary: "A balanced city itinerary with light structure.",
    practicalNotes: ["Wear comfortable shoes."],
    days: [
      {
        dayNumber: 1,
        date: "2026-06-12",
        theme: "Old town and riverside",
        morning: [],
        afternoon: [],
        evening: [],
      },
    ],
    topRecommendations: [
      {
        placeId: "place-1",
        name: "Alfama",
        reason: "Walkable streets and food stops.",
      },
    ],
    warnings: [],
    rationale: "The plan keeps pacing realistic while covering key neighborhoods.",
  });
}

function createVersionRecord(overrides: {
  content?: unknown;
  generatedAt?: Date;
  generationRun?: Partial<{
    completedAt: Date | null;
    createdAt: Date;
    durationMs: number;
    errorMessage: string | null;
    id: string;
    modelName: string | null;
    modelProvider: string | null;
    modelVersion: string | null;
    planId: string;
    startedAt: Date | null;
    status: "done" | "error" | "pending" | "running";
    updatedAt: Date;
  }>;
  id?: string;
  isCurrent?: boolean;
  planId?: string;
  runId?: string;
  versionNumber?: number;
} = {}) {
  const planId = overrides.planId ?? "plan-123";
  const runId = overrides.runId ?? "run-123";

  return {
    id: overrides.id ?? "version-2",
    travelPlanId: planId,
    versionNumber: overrides.versionNumber ?? 2,
    content: overrides.content ?? createTripPlan(),
    generatedAt: overrides.generatedAt ?? new Date("2026-03-12T12:30:00.000Z"),
    generationRunId: runId,
    isCurrent: overrides.isCurrent ?? true,
    generationRun: {
      id: overrides.generationRun?.id ?? runId,
      travelPlanId: overrides.generationRun?.planId ?? planId,
      status: overrides.generationRun?.status ?? "done",
      modelProvider: overrides.generationRun?.modelProvider ?? "openai",
      modelName: overrides.generationRun?.modelName ?? "gpt-5-mini",
      modelVersion: overrides.generationRun?.modelVersion ?? "2026-03-01",
      durationMs: overrides.generationRun?.durationMs ?? 5400,
      errorMessage: overrides.generationRun?.errorMessage ?? null,
      startedAt:
        overrides.generationRun?.startedAt ??
        new Date("2026-03-12T12:29:00.000Z"),
      completedAt:
        overrides.generationRun?.completedAt ??
        new Date("2026-03-12T12:29:05.400Z"),
      createdAt:
        overrides.generationRun?.createdAt ??
        new Date("2026-03-12T12:29:00.000Z"),
      updatedAt:
        overrides.generationRun?.updatedAt ??
        new Date("2026-03-12T12:29:05.400Z"),
    },
  };
}

function createClient(records = [createVersionRecord()]) {
  const client = {
    itineraryVersion: {
      findMany: vi.fn().mockResolvedValue(records),
    },
  };

  return {
    client: client as unknown as PrismaClient,
    mocks: client,
  };
}

describe("ItineraryVersionRepository", () => {
  it("lists mapped itinerary versions for a plan with generation run metadata", async () => {
    const { client, mocks } = createClient();
    const repository = createItineraryVersionRepository(client);

    const result = await repository.listVersionsForPlan("plan-123");

    expect(mocks.itineraryVersion.findMany).toHaveBeenCalledWith({
      where: {
        travelPlanId: "plan-123",
      },
      orderBy: [
        {
          versionNumber: "desc",
        },
        {
          generatedAt: "desc",
        },
        {
          id: "desc",
        },
      ],
      select: itineraryVersionListSelect,
    });
    expect(result).toEqual([
      {
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
    ]);
  });

  it("returns an empty list when a plan has no versions", async () => {
    const { client } = createClient([]);
    const repository = createItineraryVersionRepository(client);

    const result = await repository.listVersionsForPlan("plan-123");

    expect(result).toEqual([]);
  });

  it("rejects invalid persisted itinerary content at the repository boundary", async () => {
    const { client } = createClient([
      createVersionRecord({
        content: {
          destinationSummary: "Lisbon",
        },
      }),
    ]);
    const repository = createItineraryVersionRepository(client);

    await expect(repository.listVersionsForPlan("plan-123")).rejects.toThrow();
  });
});
