import type { PlannerRunRepository } from "@atlas-graph/db";
import { describe, expect, it, vi } from "vitest";

import { DefaultPlanningRunQueryService } from "./planning-run-query-service";

function createRepository(): PlannerRunRepository {
  return {
    create: vi.fn(),
    listRecentRuns: vi.fn().mockResolvedValue([
      {
        id: "run-1",
        status: "SUCCEEDED",
        requestId: "request-1",
        destination: "Tokyo",
        startDate: new Date("2026-04-10T00:00:00.000Z"),
        endDate: new Date("2026-04-15T00:00:00.000Z"),
        budget: "medium",
        travelStyle: "balanced",
        groupType: "friends",
        modelName: "gpt-4.1-mini",
        promptVersion: "v1",
        startedAt: new Date("2026-03-12T12:00:00.000Z"),
        completedAt: new Date("2026-03-12T12:00:05.000Z"),
        createdAt: new Date("2026-03-12T12:00:00.000Z"),
      },
    ]),
    findById: vi.fn(),
    findDetailById: vi.fn().mockResolvedValue({
      id: "run-1",
      status: "SUCCEEDED",
      requestId: "request-1",
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
      completedAt: new Date("2026-03-12T12:00:05.000Z"),
      createdAt: new Date("2026-03-12T12:00:00.000Z"),
      updatedAt: new Date("2026-03-12T12:00:05.000Z"),
      input: {
        id: "input-1",
        plannerRunId: "run-1",
        payload: {
          destination: "Tokyo",
        },
        createdAt: new Date("2026-03-12T12:00:00.000Z"),
      },
      toolResults: [
        {
          id: "tool-1",
          plannerRunId: "run-1",
          toolName: "weather",
          toolCategory: "provider",
          sequence: 1,
          status: "SUCCEEDED",
          provider: "mock",
          latencyMs: 42,
          payload: {
            summary: "Sunny",
          },
          createdAt: new Date("2026-03-12T12:00:01.000Z"),
        },
      ],
      output: {
        id: "output-1",
        plannerRunId: "run-1",
        outputFormat: "json",
        payload: {
          destinationSummary: "Tokyo trip",
        },
        createdAt: new Date("2026-03-12T12:00:05.000Z"),
      },
      errors: [],
    }),
    findByRequestId: vi.fn(),
  };
}

describe("DefaultPlanningRunQueryService", () => {
  it("lists recent run summaries from the repository", async () => {
    const repository = createRepository();
    const service = new DefaultPlanningRunQueryService(repository);

    const result = await service.listRecentRuns();

    expect(repository.listRecentRuns).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("run-1");
  });

  it("maps a detailed repository record into the route payload shape", async () => {
    const repository = createRepository();
    const service = new DefaultPlanningRunQueryService(repository);

    const result = await service.getRunDetailById("run-1");

    expect(repository.findDetailById).toHaveBeenCalledWith("run-1");
    expect(result).toEqual({
      run: {
        id: "run-1",
        status: "SUCCEEDED",
        requestId: "request-1",
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
        completedAt: new Date("2026-03-12T12:00:05.000Z"),
        createdAt: new Date("2026-03-12T12:00:00.000Z"),
        updatedAt: new Date("2026-03-12T12:00:05.000Z"),
      },
      input: {
        id: "input-1",
        plannerRunId: "run-1",
        payload: {
          destination: "Tokyo",
        },
        createdAt: new Date("2026-03-12T12:00:00.000Z"),
      },
      toolResults: [
        {
          id: "tool-1",
          plannerRunId: "run-1",
          toolName: "weather",
          toolCategory: "provider",
          sequence: 1,
          status: "SUCCEEDED",
          provider: "mock",
          latencyMs: 42,
          payload: {
            summary: "Sunny",
          },
          createdAt: new Date("2026-03-12T12:00:01.000Z"),
        },
      ],
      output: {
        id: "output-1",
        plannerRunId: "run-1",
        outputFormat: "json",
        payload: {
          destinationSummary: "Tokyo trip",
        },
        createdAt: new Date("2026-03-12T12:00:05.000Z"),
      },
      errors: [],
    });
  });
});
