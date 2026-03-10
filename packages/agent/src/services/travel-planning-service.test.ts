import {
  PlanningContextSchema,
  TripPlanSchema,
  TripRequestSchema,
} from "@atlas-graph/core/schemas";
import type {
  DestinationSummary,
  PlaceCandidate,
  TripPlan,
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

function createTripPlan(): TripPlan {
  return TripPlanSchema.parse({
    destinationSummary: "Tokyo offers varied neighborhoods, food, and culture.",
    tripStyleSummary: "A balanced city itinerary with food and cultural stops.",
    practicalNotes: ["Carry a light layer for the evenings."],
    days: [
      {
        dayNumber: 1,
        date: "2026-04-10",
        theme: "Shrines and neighborhood walks",
        morning: [
          {
            title: "Visit Meiji Shrine",
            placeId: "place-1",
            description: "Start with a calm walk through the shrine grounds.",
          },
        ],
        afternoon: [],
        evening: [],
      },
    ],
    topRecommendations: [
      {
        placeId: "place-1",
        name: "Meiji Shrine",
        reason: "It fits the user's culture interest.",
      },
    ],
    warnings: [],
    rationale: "The plan keeps the pacing balanced and realistic.",
  });
}

function createDeps() {
  const destinationSummary = createDestinationSummary();
  const weatherSummary = createWeatherSummary();
  const placeCandidates = createPlaceCandidates();
  const tripPlan = createTripPlan();

  return {
    destinationSummary,
    weatherSummary,
    placeCandidates,
    tripPlan,
    deps: {
      destinationInfoProvider: {
        getDestinationSummary: vi.fn().mockResolvedValue(destinationSummary),
      },
      placesProvider: {
        searchPlaces: vi.fn().mockResolvedValue(placeCandidates),
      },
      plannerRunner: {
        run: vi.fn().mockResolvedValue(tripPlan),
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

  it("generatePlan delegates to plannerRunner with a valid planning context", async () => {
    const request = createTripRequest();
    const { deps, destinationSummary, placeCandidates, tripPlan, weatherSummary } =
      createDeps();
    const service = new TravelPlanningService(deps);

    const result = await service.generatePlan(request);

    expect(result).toEqual(tripPlan);
    expect(deps.plannerRunner.run).toHaveBeenCalledTimes(1);

    const context = deps.plannerRunner.run.mock.calls[0]?.[0];

    expect(context).toEqual(
      PlanningContextSchema.parse({
        request,
        destinationSummary,
        weatherSummary,
        placeCandidates,
      })
    );

    expect(PlanningContextSchema.parse(context)).toEqual(context);
  });
});
