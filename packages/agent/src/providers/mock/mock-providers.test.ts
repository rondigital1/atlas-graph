import {
  DestinationSummarySchema,
  PlaceCandidateSchema,
  PlanningContextSchema,
  TripRequestSchema,
  WeatherSummarySchema,
} from "@atlas-graph/core/schemas";
import type { TripRequest } from "@atlas-graph/core/types";
import { describe, expect, it } from "vitest";

import {
  MockDestinationInfoProvider,
  MockPlacesProvider,
  MockWeatherProvider,
  TravelPlanningService,
  createMockTravelPlanningDeps,
} from "../../index";

const PlaceCandidateListSchema = PlaceCandidateSchema.array();

function createTripRequest(overrides: Partial<TripRequest> = {}): TripRequest {
  return TripRequestSchema.parse({
    destination: "Tokyo",
    startDate: "2026-04-10",
    endDate: "2026-04-15",
    budget: "medium",
    interests: ["food", "culture"],
    travelStyle: "balanced",
    groupType: "friends",
    ...overrides,
  });
}

describe("mock travel providers", () => {
  it("returns a destination-specific summary for known destinations", async () => {
    const provider = new MockDestinationInfoProvider();

    const result = await provider.getDestinationSummary(
      createTripRequest({ destination: "paris" })
    );

    expect(result.destination).toBe("Paris");
    expect(result.country).toBe("France");
    expect(result.bestAreas).toContain("Le Marais");
    expect(result.summary).toContain("walkable");
  });

  it("returns normalized place candidates", async () => {
    const provider = new MockPlacesProvider();

    const result = await provider.searchPlaces(createTripRequest());

    expect(result.length).toBeGreaterThanOrEqual(4);
    expect(result[0]?.id).toBe("tokyo-sensoji");
    expect(result.some((place) => place.category === "restaurant")).toBe(true);
    expect(result.some((place) => place.category === "hotel")).toBe(true);
    expect(result.every((place) => place.source === "mock")).toBe(true);
    expect(PlaceCandidateListSchema.parse(result)).toEqual(result);
  });

  it("falls back safely for unknown destinations", async () => {
    const request = createTripRequest({
      destination: "Lisbon",
      interests: ["architecture"],
    });
    const destinationInfoProvider = new MockDestinationInfoProvider();
    const placesProvider = new MockPlacesProvider();
    const weatherProvider = new MockWeatherProvider();

    const destinationSummary =
      await destinationInfoProvider.getDestinationSummary(request);
    const placeCandidates = await placesProvider.searchPlaces(request);
    const weatherSummary = await weatherProvider.getWeatherSummary(request);

    expect(destinationSummary.destination).toBe("Lisbon");
    expect(destinationSummary.country).toBeUndefined();
    expect(destinationSummary.bestAreas).toEqual(["City Center", "Old Town"]);
    expect(placeCandidates.map((place) => place.id)).toEqual([
      "lisbon-city-highlights-walk",
      "lisbon-central-landmark",
      "lisbon-market-kitchen",
      "lisbon-city-stay",
    ]);
    expect(weatherSummary.destination).toBe("Lisbon");
    expect(weatherSummary.summary).toContain("Mock seasonal profile");
  });

  it("produces outputs that validate against shared schemas", async () => {
    const request = createTripRequest({
      destination: "Barcelona",
      interests: ["architecture", "art"],
    });
    const destinationInfoProvider = new MockDestinationInfoProvider();
    const placesProvider = new MockPlacesProvider();
    const weatherProvider = new MockWeatherProvider();

    const destinationSummary =
      await destinationInfoProvider.getDestinationSummary(request);
    const placeCandidates = await placesProvider.searchPlaces(request);
    const weatherSummary = await weatherProvider.getWeatherSummary(request);

    expect(DestinationSummarySchema.parse(destinationSummary)).toEqual(
      destinationSummary
    );
    expect(PlaceCandidateListSchema.parse(placeCandidates)).toEqual(
      placeCandidates
    );
    expect(WeatherSummarySchema.parse(weatherSummary)).toEqual(weatherSummary);
  });

  it("returns the same planning context for the same input", async () => {
    const request = createTripRequest({
      destination: "New York City",
      interests: ["culture", "food"],
    });
    const service = new TravelPlanningService(createMockTravelPlanningDeps());

    const firstResult = await service.buildPlanningContext(request);
    const secondResult = await service.buildPlanningContext(request);

    expect(firstResult).toEqual(secondResult);
    expect(PlanningContextSchema.parse(firstResult)).toEqual(firstResult);
    expect(firstResult.destinationSummary?.destination).toBe("New York");
    expect(firstResult.placeCandidates.some((place) => place.id === "nyc-central-park")).toBe(
      true
    );
  });
});
