import { describe, expect, it } from "vitest";

import {
  PlaceCandidateSchema,
  PROJECT_NAME,
  TripPlanSchema,
  TripRequestSchema,
} from "./index";

describe("core package", () => {
  it("parses a valid trip request", () => {
    expect(PROJECT_NAME).toBe("AtlasGraph");

    const result = TripRequestSchema.safeParse({
      destination: "Tokyo",
      startDate: "2026-04-10",
      endDate: "2026-04-15",
      budget: "medium",
      interests: ["food", "culture"],
      travelStyle: "balanced",
      groupType: "friends",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a trip request when endDate is before startDate", () => {
    const result = TripRequestSchema.safeParse({
      destination: "Tokyo",
      startDate: "2026-04-15",
      endDate: "2026-04-10",
      budget: "medium",
      interests: ["food"],
      travelStyle: "balanced",
      groupType: "solo",
    });

    expect(result.success).toBe(false);
  });

  it("parses a valid trip plan", () => {
    const result = TripPlanSchema.safeParse({
      destinationSummary: "Tokyo offers a dense mix of neighborhoods and food.",
      tripStyleSummary: "A balanced city break with time for food and museums.",
      practicalNotes: ["Book popular restaurants in advance."],
      days: [
        {
          dayNumber: 1,
          date: "2026-04-10",
          theme: "Arrival and Shibuya",
          morning: [],
          afternoon: [
            {
              title: "Walk through Shibuya",
              description: "Settle in with a neighborhood orientation walk.",
            },
          ],
          evening: [
            {
              title: "Dinner in Ebisu",
              description: "Start the trip with a relaxed dinner nearby.",
            },
          ],
        },
      ],
      topRecommendations: [
        {
          name: "Meiji Shrine",
          reason: "Strong first-day anchor for a Tokyo itinerary.",
        },
      ],
      warnings: [],
      rationale: "The plan balances iconic areas with a manageable pace.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a place candidate with a rating above 5", () => {
    const result = PlaceCandidateSchema.safeParse({
      id: "place-1",
      name: "Example Place",
      category: "attraction",
      rating: 5.1,
      source: "normalized-provider",
    });

    expect(result.success).toBe(false);
  });
});
