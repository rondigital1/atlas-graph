import { afterEach, describe, expect, it, vi } from "vitest";

const listRecentRuns = vi.fn();

vi.mock("../../../src/server/create-planning-run-query-service", () => {
  return {
    createPlanningRunQueryService: () => {
      return {
        listRecentRuns,
      };
    },
  };
});

import { GET } from "./route";

describe("GET /api/runs", () => {
  afterEach(() => {
    listRecentRuns.mockReset();
  });

  it("returns 200 with recent planning run summaries", async () => {
    listRecentRuns.mockResolvedValue([
      {
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
        startedAt: "2026-03-12T12:00:00.000Z",
        completedAt: "2026-03-12T12:00:05.000Z",
        createdAt: "2026-03-12T12:00:00.000Z",
      },
    ]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: [
        {
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
          startedAt: "2026-03-12T12:00:00.000Z",
          completedAt: "2026-03-12T12:00:05.000Z",
          createdAt: "2026-03-12T12:00:00.000Z",
        },
      ],
    });
  });
});
