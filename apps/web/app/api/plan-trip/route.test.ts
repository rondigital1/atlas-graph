import { TripPlanSchema } from "@atlas-graph/core/schemas";
import { afterEach, describe, expect, it, vi } from "vitest";

const generatePlan = vi.fn();

vi.mock("../../../src/server/create-travel-planning-service", () => {
  return {
    createTravelPlanningService: () => {
      return {
        generatePlan,
      };
    },
  };
});

import { POST } from "./route";

function createValidTripPlan() {
  return TripPlanSchema.parse({
    destinationSummary: "Paris is easy to explore with compact neighborhoods.",
    tripStyleSummary: "A balanced medium-budget city break.",
    practicalNotes: ["Book museums ahead for shorter queues."],
    days: [
      {
        dayNumber: 1,
        date: "2026-04-10",
        theme: "Arrival and central neighborhoods",
        morning: [
          {
            title: "Orientation walk",
            description: "Start with a short central walk to get oriented.",
          },
        ],
        afternoon: [],
        evening: [],
      },
    ],
    topRecommendations: [],
    warnings: [],
    rationale: "The plan balances sightseeing and pacing.",
  });
}

describe("POST /api/plan-trip", () => {
  afterEach(() => {
    generatePlan.mockReset();
  });

  it("returns 200 with plan data for a valid request", async () => {
    const tripPlan = createValidTripPlan();
    generatePlan.mockResolvedValue(tripPlan);
    const request = new Request("http://localhost/api/plan-trip", {
      method: "POST",
      body: JSON.stringify({
        destination: "Paris",
        startDate: "2026-04-10",
        endDate: "2026-04-10",
        budget: "medium",
        interests: ["art", "food"],
        travelStyle: "balanced",
        groupType: "couple",
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: tripPlan,
    });
    expect(generatePlan).toHaveBeenCalledWith({
      destination: "Paris",
      startDate: "2026-04-10",
      endDate: "2026-04-10",
      budget: "medium",
      interests: ["art", "food"],
      travelStyle: "balanced",
      groupType: "couple",
    });
  });

  it("returns 400 for an invalid request body", async () => {
    const request = new Request("http://localhost/api/plan-trip", {
      method: "POST",
      body: JSON.stringify({
        destination: "P",
        startDate: "2026-04-10",
        endDate: "2026-04-09",
        budget: "medium",
        interests: [],
        travelStyle: "balanced",
        groupType: "couple",
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("INVALID_REQUEST");
    expect(body.error.message).toBe("Request validation failed");
    expect(generatePlan).not.toHaveBeenCalled();
  });

  it("returns 400 for malformed JSON", async () => {
    const request = new Request("http://localhost/api/plan-trip", {
      method: "POST",
      body: "{bad json",
      headers: {
        "content-type": "application/json",
      },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: {
        code: "INVALID_REQUEST",
        message: "Request validation failed",
        details: {
          body: ["Malformed JSON body."],
        },
      },
    });
  });

  it("returns 500 for unexpected service failures", async () => {
    generatePlan.mockRejectedValue(new Error("planner failed"));
    const request = new Request("http://localhost/api/plan-trip", {
      method: "POST",
      body: JSON.stringify({
        destination: "Paris",
        startDate: "2026-04-10",
        endDate: "2026-04-10",
        budget: "medium",
        interests: ["art", "food"],
        travelStyle: "balanced",
        groupType: "couple",
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to generate trip plan",
      },
    });
  });
});
