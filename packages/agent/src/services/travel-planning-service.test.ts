import { PlanningContextSchema, TripRequestSchema } from "@atlas-graph/core/schemas";
import type {
  DestinationSummary,
  PlaceCandidate,
  TripRequest,
  WeatherSummary,
} from "@atlas-graph/core/types";
import { describe, expect, it, vi } from "vitest";

import { TravelPlanningService } from "./travel-planning-service";

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

function createDestinationSummary(): DestinationSummary {
  return {
    destination: "Tokyo",
    country: "Japan",
    summary: "A dense city with strong neighborhood variety.",
    bestAreas: ["Shibuya"],
    notes: ["Transit is efficient."],
  };
}

function createWeatherSummary(): WeatherSummary {
  return {
    destination: "Tokyo",
    summary: "Mild spring weather is typical.",
    dailyNotes: ["Pack a light layer for evenings."],
    averageHighC: 19,
    averageLowC: 11,
  };
}

function createPlaceCandidates(): PlaceCandidate[] {
  return [
    {
      id: "place-1",
      name: "Meiji Shrine",
      category: "attraction",
      source: "test-provider",
      summary: "A calm shrine and park complex.",
    },
  ];
}

function createDeps() {
  const destinationSummary = createDestinationSummary();
  const weatherSummary = createWeatherSummary();
  const placeCandidates = createPlaceCandidates();

  return {
    destinationSummary,
    weatherSummary,
    placeCandidates,
    deps: {
      destinationInfoProvider: {
        getDestinationSummary: vi.fn().mockResolvedValue(destinationSummary),
      },
      placesProvider: {
        searchPlaces: vi.fn().mockResolvedValue(placeCandidates),
      },
      weatherProvider: {
        getWeatherSummary: vi.fn().mockResolvedValue(weatherSummary),
      },
    },
  };
}

describe("TravelPlanningService", () => {
  it("can be constructed with provider dependencies", () => {
    const { deps } = createDeps();

    expect(new TravelPlanningService(deps)).toBeInstanceOf(TravelPlanningService);
  });

  it("buildPlanningContext calls providers and returns a valid planning context", async () => {
    const request = createTripRequest();
    const { deps, destinationSummary, weatherSummary, placeCandidates } = createDeps();
    const service = new TravelPlanningService(deps);

    const result = await service.buildPlanningContext(request);

    expect(deps.destinationInfoProvider.getDestinationSummary).toHaveBeenCalledTimes(1);
    expect(deps.destinationInfoProvider.getDestinationSummary).toHaveBeenCalledWith(
      request
    );
    expect(deps.weatherProvider.getWeatherSummary).toHaveBeenCalledTimes(1);
    expect(deps.weatherProvider.getWeatherSummary).toHaveBeenCalledWith(request);
    expect(deps.placesProvider.searchPlaces).toHaveBeenCalledTimes(1);
    expect(deps.placesProvider.searchPlaces).toHaveBeenCalledWith(request);

    expect(result).toEqual(
      PlanningContextSchema.parse({
        request,
        destinationSummary,
        weatherSummary,
        placeCandidates,
      })
    );
  });

  it("generatePlan throws a not implemented error", async () => {
    const request = createTripRequest();
    const { deps } = createDeps();
    const service = new TravelPlanningService(deps);

    await expect(service.generatePlan(request)).rejects.toThrow(
      "TravelPlanningService.generatePlan is not implemented yet."
    );
  });
});
