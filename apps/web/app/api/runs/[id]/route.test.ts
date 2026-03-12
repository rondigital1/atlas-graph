import { afterEach, describe, expect, it, vi } from "vitest";

const getRunDetailById = vi.fn();

vi.mock("../../../../src/server/create-planning-run-query-service", () => {
  return {
    createPlanningRunQueryService: () => {
      return {
        getRunDetailById,
      };
    },
  };
});

import { GET } from "./route";

describe("GET /api/runs/[id]", () => {
  afterEach(() => {
    getRunDetailById.mockReset();
  });

  it("returns 200 with planning run details", async () => {
    getRunDetailById.mockResolvedValue({
      run: {
        id: "run-1",
        status: "SUCCEEDED",
        requestId: "request-1",
        destination: "Tokyo",
        startDate: "2026-04-10T00:00:00.000Z",
        endDate: "2026-04-15T00:00:00.000Z",
        budget: "medium",
        travelStyle: "balanced",
        groupType: "friends",
        modelName: "gpt-4.1-mini",
        promptVersion: "v1",
        orchestratorVersion: null,
        startedAt: "2026-03-12T12:00:00.000Z",
        completedAt: "2026-03-12T12:00:05.000Z",
        createdAt: "2026-03-12T12:00:00.000Z",
        updatedAt: "2026-03-12T12:00:05.000Z",
      },
      input: {
        id: "input-1",
        plannerRunId: "run-1",
        payload: {
          destination: "Tokyo",
        },
        createdAt: "2026-03-12T12:00:00.000Z",
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
          createdAt: "2026-03-12T12:00:01.000Z",
        },
      ],
      output: {
        id: "output-1",
        plannerRunId: "run-1",
        outputFormat: "json",
        payload: {
          destinationSummary: "Tokyo trip",
        },
        createdAt: "2026-03-12T12:00:05.000Z",
      },
      errors: [],
    });

    const response = await GET(new Request("http://localhost/api/runs/run-1"), {
      params: Promise.resolve({
        id: "run-1",
      }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        run: {
          id: "run-1",
          status: "SUCCEEDED",
          requestId: "request-1",
          destination: "Tokyo",
          startDate: "2026-04-10T00:00:00.000Z",
          endDate: "2026-04-15T00:00:00.000Z",
          budget: "medium",
          travelStyle: "balanced",
          groupType: "friends",
          modelName: "gpt-4.1-mini",
          promptVersion: "v1",
          orchestratorVersion: null,
          startedAt: "2026-03-12T12:00:00.000Z",
          completedAt: "2026-03-12T12:00:05.000Z",
          createdAt: "2026-03-12T12:00:00.000Z",
          updatedAt: "2026-03-12T12:00:05.000Z",
        },
        input: {
          id: "input-1",
          plannerRunId: "run-1",
          payload: {
            destination: "Tokyo",
          },
          createdAt: "2026-03-12T12:00:00.000Z",
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
            createdAt: "2026-03-12T12:00:01.000Z",
          },
        ],
        output: {
          id: "output-1",
          plannerRunId: "run-1",
          outputFormat: "json",
          payload: {
            destinationSummary: "Tokyo trip",
          },
          createdAt: "2026-03-12T12:00:05.000Z",
        },
        errors: [],
      },
    });
  });

  it("returns 404 when the planning run is not found", async () => {
    getRunDetailById.mockResolvedValue(null);

    const response = await GET(new Request("http://localhost/api/runs/missing"), {
      params: Promise.resolve({
        id: "missing",
      }),
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      error: {
        code: "NOT_FOUND",
        message: "Planning run not found",
      },
    });
  });
});
