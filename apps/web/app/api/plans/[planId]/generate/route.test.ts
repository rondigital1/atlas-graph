import { afterEach, describe, expect, it, vi } from "vitest";

const getRunDetailById = vi.fn();

vi.mock("../../../../../src/server/create-planning-run-query-service", () => {
  return {
    createPlanningRunQueryService: () => {
      return {
        getRunDetailById,
      };
    },
  };
});

import { POST } from "./route";

describe("POST /api/plans/[planId]/generate", () => {
  afterEach(() => {
    getRunDetailById.mockReset();
  });

  it("returns 200 when the legacy run exists", async () => {
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
  });

  it("returns 404 when the legacy run does not exist", async () => {
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
});
