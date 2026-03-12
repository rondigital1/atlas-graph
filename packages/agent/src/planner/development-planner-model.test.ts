import { TripPlanSchema } from "@atlas-graph/core/schemas";
import { describe, expect, it } from "vitest";

import { DevelopmentPlannerModel } from "./development-planner-model";

function buildPrompt(options: {
  destination: string;
  budget: "low" | "medium" | "high";
  travelStyle: "relaxed" | "balanced" | "packed";
  requiredDates: string[];
  includeSparseMarkers?: boolean;
}): string {
  const destinationSummary = options.includeSparseMarkers
    ? "- No destination summary was provided."
    : `- destination: ${options.destination}\n- summary: A grounded destination summary.`;
  const weatherSummary = options.includeSparseMarkers
    ? "- No weather summary was provided."
    : `- destination: ${options.destination}\n- summary: Mild weather conditions.`;
  const placeCandidates = options.includeSparseMarkers
    ? "- No named place candidates were provided."
    : [
        "Category: Attractions",
        "- id: place-1 | name: City Landmark | category: attraction | summary: A grounded landmark stop.",
        "Category: Restaurants",
        "- id: place-2 | name: Market Lunch | category: restaurant | summary: A grounded lunch stop.",
      ].join("\n");

  return [
    "Use only the planning context below to build the trip plan.",
    "",
    "User request",
    `- destination: ${options.destination}`,
    `- dates: ${options.requiredDates[0]} to ${options.requiredDates[options.requiredDates.length - 1]}`,
    `- tripDateCount: ${options.requiredDates.length}`,
    `- requiredDates: ${options.requiredDates.join(", ")}`,
    `- budget: ${options.budget}`,
    `- travelStyle: ${options.travelStyle}`,
    "- groupType: couple",
    "- interests: food; culture",
    "",
    "Destination summary",
    destinationSummary,
    "",
    "Weather summary",
    weatherSummary,
    "",
    "Place candidates",
    placeCandidates,
  ].join("\n");
}

describe("DevelopmentPlannerModel", () => {
  it("returns JSON text that parses into a TripPlanSchema-valid plan", async () => {
    const model = new DevelopmentPlannerModel();
    const response = await model.generate({
      systemPrompt: "ignored for development model",
      userPrompt: buildPrompt({
        destination: "Paris",
        budget: "medium",
        travelStyle: "balanced",
        requiredDates: ["2026-04-10", "2026-04-11"],
      }),
    });

    expect(typeof response.text).toBe("string");
    expect(TripPlanSchema.parse(JSON.parse(response.text))).toBeTruthy();
  });

  it("uses the exact required dates from the prompt", async () => {
    const model = new DevelopmentPlannerModel();
    const response = await model.generate({
      systemPrompt: "ignored for development model",
      userPrompt: buildPrompt({
        destination: "Tokyo",
        budget: "high",
        travelStyle: "packed",
        requiredDates: ["2026-05-01", "2026-05-02", "2026-05-03"],
      }),
    });
    const tripPlan = TripPlanSchema.parse(JSON.parse(response.text));

    expect(tripPlan.days.map((day) => day.date)).toEqual([
      "2026-05-01",
      "2026-05-02",
      "2026-05-03",
    ]);
    expect(tripPlan.days.map((day) => day.dayNumber)).toEqual([1, 2, 3]);
  });

  it("produces non-empty activities and array fields", async () => {
    const model = new DevelopmentPlannerModel();
    const response = await model.generate({
      systemPrompt: "ignored for development model",
      userPrompt: buildPrompt({
        destination: "Barcelona",
        budget: "low",
        travelStyle: "relaxed",
        requiredDates: ["2026-06-10"],
      }),
    });
    const tripPlan = TripPlanSchema.parse(JSON.parse(response.text));

    expect(tripPlan.days).toHaveLength(1);
    expect(tripPlan.days[0]?.morning.length).toBeGreaterThan(0);
    expect(tripPlan.days[0]?.morning[0]?.title.trim().length).toBeGreaterThan(0);
    expect(tripPlan.days[0]?.morning[0]?.description.trim().length).toBeGreaterThan(0);
    expect(Array.isArray(tripPlan.practicalNotes)).toBe(true);
    expect(Array.isArray(tripPlan.topRecommendations)).toBe(true);
    expect(Array.isArray(tripPlan.warnings)).toBe(true);
  });

  it("emits warnings when the prompt indicates sparse context", async () => {
    const model = new DevelopmentPlannerModel();
    const response = await model.generate({
      systemPrompt: "ignored for development model",
      userPrompt: buildPrompt({
        destination: "Lisbon",
        budget: "medium",
        travelStyle: "balanced",
        requiredDates: ["2026-07-08", "2026-07-09"],
        includeSparseMarkers: true,
      }),
    });
    const tripPlan = TripPlanSchema.parse(JSON.parse(response.text));

    expect(tripPlan.warnings.length).toBeGreaterThan(0);
  });
});
