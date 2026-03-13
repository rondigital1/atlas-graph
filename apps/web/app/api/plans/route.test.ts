import { afterEach, describe, expect, it, vi } from "vitest";

const { legacyPlanTripPost } = vi.hoisted(() => {
  return {
    legacyPlanTripPost: vi.fn(),
  };
});

vi.mock("../plan-trip/route", () => {
  return {
    POST: legacyPlanTripPost,
  };
});

import { POST } from "./route";

describe("POST /api/plans", () => {
  afterEach(() => {
    legacyPlanTripPost.mockReset();
  });

  it("delegates to the legacy plan-trip route", async () => {
    const response = Response.json({
      data: {
        destinationSummary: "Lisbon",
      },
      id: "run-123",
    });
    const request = new Request("http://localhost/api/plans", {
      method: "POST",
      body: JSON.stringify({
        destination: "Lisbon",
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    legacyPlanTripPost.mockResolvedValue(response);

    const result = await POST(request);

    expect(result).toBe(response);
    expect(legacyPlanTripPost).toHaveBeenCalledWith(request);
  });
});
