import { afterEach, describe, expect, it, vi } from "vitest";

import type { TripRequest } from "@atlas-graph/core/types";

import { createPlan, generatePlan } from "./plans-api";

function createRequest(): TripRequest {
  return {
    budget: "medium",
    destination: "Lisbon, Portugal",
    endDate: "2026-06-18",
    groupType: "couple",
    interests: ["Food & Dining", "Walkable"],
    startDate: "2026-06-12",
    travelStyle: "balanced",
  };
}

describe("plans-api compatibility", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("falls back to the legacy plan-trip route when /api/plans is missing", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockResolvedValueOnce(
        Response.json({
          data: {
            destinationSummary: "Lisbon",
          },
          id: "run-123",
        })
      );

    vi.stubGlobal("fetch", fetchMock);

    const result = await createPlan(createRequest());

    expect(result).toEqual({ id: "run-123" });
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/api/plans",
      expect.objectContaining({
        method: "POST",
      })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/plan-trip",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  it("skips the generate call for ids returned by the legacy fallback", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockResolvedValueOnce(
        Response.json({
          data: {
            destinationSummary: "Lisbon",
          },
          id: "run-123",
        })
      );

    vi.stubGlobal("fetch", fetchMock);

    const result = await createPlan(createRequest());
    await generatePlan(result.id);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
