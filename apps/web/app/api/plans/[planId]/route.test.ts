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

import { PATCH } from "./route";

describe("PATCH /api/plans/[planId]", () => {
  afterEach(() => {
    getRunDetailById.mockReset();
  });

  it("returns the existing plan id when the legacy run exists", async () => {
    getRunDetailById.mockResolvedValue({
      run: {
        id: "run-123",
      },
    });

    const response = await PATCH(
      new Request("http://localhost/api/plans/run-123", {
        method: "PATCH",
        body: JSON.stringify({
          destination: "Lisbon",
          startDate: "2026-06-12",
          endDate: "2026-06-18",
          budget: "medium",
          interests: ["Food & Dining"],
          travelStyle: "balanced",
          groupType: "couple",
        }),
        headers: {
          "content-type": "application/json",
        },
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
  });

  it("returns 404 when the legacy run does not exist", async () => {
    getRunDetailById.mockResolvedValue(null);

    const response = await PATCH(
      new Request("http://localhost/api/plans/missing", {
        method: "PATCH",
        body: JSON.stringify({
          destination: "Lisbon",
          startDate: "2026-06-12",
          endDate: "2026-06-18",
          budget: "medium",
          interests: ["Food & Dining"],
          travelStyle: "balanced",
          groupType: "couple",
        }),
        headers: {
          "content-type": "application/json",
        },
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
});
