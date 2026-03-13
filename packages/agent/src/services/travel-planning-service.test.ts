import {
  PlanningContextSchema,
  ToolResultSchema,
  TripPlanSchema,
  TripRequestSchema,
} from "@atlas-graph/core/schemas";
import type {
  DestinationSummary,
  PlaceCandidate,
  ToolResult,
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

function createExpectedToolResults(
  destinationSummary: DestinationSummary | undefined,
  weatherSummary: WeatherSummary | undefined,
  placeCandidates: PlaceCandidate[]
): ToolResult[] {
  return [
    ToolResultSchema.parse({
      toolName: "destination-summary",
      toolCategory: "normalized-context",
      provider: "normalized-provider",
      status: destinationSummary ? "SUCCEEDED" : "PARTIAL",
      payload: destinationSummary ?? null,
    }),
    ToolResultSchema.parse({
      toolName: "weather-summary",
      toolCategory: "normalized-context",
      provider: "normalized-provider",
      status: weatherSummary ? "SUCCEEDED" : "PARTIAL",
      payload: weatherSummary ?? null,
    }),
    ToolResultSchema.parse({
      toolName: "place-candidates",
      toolCategory: "normalized-context",
      provider: "normalized-provider",
      status: "SUCCEEDED",
      payload: placeCandidates,
    }),
  ];
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

  it("buildPlanningContext rejects invalid TripRequest input at the service boundary", async () => {
    const invalidRequest = {
      destination: "T",
      startDate: "2026-04-15",
      endDate: "2026-04-10",
      budget: "medium",
      interests: [],
      travelStyle: "balanced",
      groupType: "friends",
    } as unknown as TripRequest;
    const { deps } = createDeps();
    const service = new TravelPlanningService(deps);

    await expect(service.buildPlanningContext(invalidRequest)).rejects.toThrow();
    expect(deps.destinationInfoProvider.getDestinationSummary).not.toHaveBeenCalled();
    expect(deps.weatherProvider.getWeatherSummary).not.toHaveBeenCalled();
    expect(deps.placesProvider.searchPlaces).not.toHaveBeenCalled();
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

  it("buildPlanningContext deduplicates normalized place candidates deterministically", async () => {
    const request = createTripRequest();
    const { deps } = createDeps();
    deps.placesProvider.searchPlaces = vi.fn().mockResolvedValue([
      {
        id: "tokyo-meiji-raw",
        name: "  Meiji Shrine ",
        category: "Attractions",
        source: "test-provider",
      },
      {
        id: "tokyo-meiji-detailed",
        name: "Meiji Shrine",
        category: "attraction",
        source: "test-provider",
        address: "1-1 Yoyogikamizonocho",
        description: "  A calm shrine and park complex. ",
        rating: "4.8",
      },
    ] as unknown as PlaceCandidate[]);
    const service = new TravelPlanningService(deps);

    const result = await service.buildPlanningContext(request);

    expect(result.placeCandidates).toEqual([
      {
        id: "tokyo-meiji-detailed",
        name: "Meiji Shrine",
        category: "attraction",
        source: "test-provider",
        address: "1-1 Yoyogikamizonocho",
        summary: "A calm shrine and park complex.",
        rating: 4.8,
      },
    ]);
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

  it("generatePlanResult returns validated context, tool results, and plan", async () => {
    const request = createTripRequest();
    const { deps, destinationSummary, weatherSummary, placeCandidates, tripPlan } =
      createDeps();
    const service = new TravelPlanningService(deps);

    const result = await service.generatePlanResult(request);

    expect(result).toEqual({
      plan: tripPlan,
      context: PlanningContextSchema.parse({
        request,
        destinationSummary,
        weatherSummary,
        placeCandidates,
      }),
      toolResults: createExpectedToolResults(
        destinationSummary,
        weatherSummary,
        placeCandidates
      ),
    });
  });

  it("generatePlan passes normalized context to plannerRunner", async () => {
    const request = createTripRequest();
    const { deps, tripPlan } = createDeps();
    deps.destinationInfoProvider.getDestinationSummary = vi.fn().mockResolvedValue({
      destination: " Tokyo ",
      country: " Japan ",
      description: " Dense city with strong neighborhood variety. ",
      bestAreas: [" Shibuya ", " ", "Asakusa"],
      notes: [" Transit is efficient. ", "   "],
    } as unknown as DestinationSummary);
    deps.weatherProvider.getWeatherSummary = vi.fn().mockResolvedValue({
      destination: "Tokyo",
      description: " Mild spring weather is typical. ",
      dailyNotes: [" Pack a light layer for evenings. ", " "],
      averageHighC: "19",
      averageLowC: "11",
    } as unknown as WeatherSummary);
    deps.placesProvider.searchPlaces = vi.fn().mockResolvedValue([
      {
        name: "  Meiji Shrine ",
        category: "Attractions",
        description: " A calm shrine and park complex. ",
        source: " test-provider ",
      },
    ] as unknown as PlaceCandidate[]);
    const service = new TravelPlanningService(deps);

    const result = await service.generatePlan(request);

    expect(result).toEqual(tripPlan);
    expect(deps.plannerRunner.run).toHaveBeenCalledWith({
      request,
      destinationSummary: {
        destination: "Tokyo",
        country: "Japan",
        summary: "Dense city with strong neighborhood variety.",
        bestAreas: ["Shibuya", "Asakusa"],
        notes: ["Transit is efficient."],
      },
      weatherSummary: {
        destination: "Tokyo",
        summary: "Mild spring weather is typical.",
        dailyNotes: ["Pack a light layer for evenings."],
        averageHighC: 19,
        averageLowC: 11,
      },
      placeCandidates: [
        {
          id: "meiji-shrine-attraction",
          name: "Meiji Shrine",
          category: "attraction",
          source: "test-provider",
          summary: "A calm shrine and park complex.",
        },
      ],
    });
  });

  it("buildPlanningContext returns empty placeCandidates when placesProvider throws", async () => {
    const request = createTripRequest();
    const { deps, destinationSummary, weatherSummary } = createDeps();
    deps.placesProvider.searchPlaces = vi.fn().mockRejectedValue(new Error("API failure"));
    const service = new TravelPlanningService(deps);

    const result = await service.buildPlanningContext(request);

    expect(result.placeCandidates).toEqual([]);
    expect(result.destinationSummary).toEqual(destinationSummary);
    expect(result.weatherSummary).toEqual(weatherSummary);
  });

  it("buildPlanningContext degrades gracefully when destinationInfoProvider throws", async () => {
    const request = createTripRequest();
    const { deps, weatherSummary, placeCandidates } = createDeps();
    deps.destinationInfoProvider.getDestinationSummary = vi
      .fn()
      .mockRejectedValue(new Error("Destination API failure"));
    const service = new TravelPlanningService(deps);

    const result = await service.buildPlanningContext(request);

    expect(result.destinationSummary).toBeUndefined();
    expect(result.weatherSummary).toEqual(weatherSummary);
    expect(result.placeCandidates).toEqual(placeCandidates);
    expect(PlanningContextSchema.parse(result)).toEqual(result);
  });

  it("buildPlanningContext degrades gracefully when weatherProvider throws", async () => {
    const request = createTripRequest();
    const { deps, destinationSummary, placeCandidates } = createDeps();
    deps.weatherProvider.getWeatherSummary = vi
      .fn()
      .mockRejectedValue(new Error("Weather API failure"));
    const service = new TravelPlanningService(deps);

    const result = await service.buildPlanningContext(request);

    expect(result.destinationSummary).toEqual(destinationSummary);
    expect(result.weatherSummary).toBeUndefined();
    expect(result.placeCandidates).toEqual(placeCandidates);
    expect(PlanningContextSchema.parse(result)).toEqual(result);
  });

  it("buildPlanningContext drops invalid place candidates and keeps valid ones", async () => {
    const request = createTripRequest();
    const validCandidate = createPlaceCandidates()[0]!;
    const { deps } = createDeps();
    deps.placesProvider.searchPlaces = vi.fn().mockResolvedValue([
      validCandidate,
      { id: "bad-1", name: "", category: "attraction", source: "test" },
      null,
      { id: "bad-2", name: "No Category", source: "test" },
      42,
    ]);
    const service = new TravelPlanningService(deps);

    const result = await service.buildPlanningContext(request);

    expect(result.placeCandidates).toHaveLength(1);
    expect(result.placeCandidates[0]!.id).toBe(validCandidate.id);
  });

  it("buildPlanningContext degrades gracefully when destination data is malformed", async () => {
    const request = createTripRequest();
    const validCandidate = createPlaceCandidates()[0]!;
    const { deps, weatherSummary } = createDeps();
    deps.destinationInfoProvider.getDestinationSummary = vi.fn().mockResolvedValue({
      destination: "Tokyo",
      bestAreas: ["Shibuya"],
      notes: ["Transit is efficient."],
    } as unknown as DestinationSummary);
    deps.placesProvider.searchPlaces = vi.fn().mockResolvedValue([
      validCandidate,
    ] as unknown as PlaceCandidate[]);
    const service = new TravelPlanningService(deps);

    const result = await service.buildPlanningContext(request);

    expect(result.destinationSummary).toBeUndefined();
    expect(result.weatherSummary).toEqual(weatherSummary);
    expect(result.placeCandidates).toEqual([validCandidate]);
    expect(PlanningContextSchema.parse(result)).toEqual(result);
  });

  it("buildPlanningContext degrades gracefully when weather data is malformed", async () => {
    const request = createTripRequest();
    const validCandidate = createPlaceCandidates()[0]!;
    const { deps, destinationSummary } = createDeps();
    deps.weatherProvider.getWeatherSummary = vi.fn().mockResolvedValue({
      destination: "Tokyo",
      dailyNotes: ["Pack a light layer for evenings."],
      averageHighC: "19",
    } as unknown as WeatherSummary);
    deps.placesProvider.searchPlaces = vi.fn().mockResolvedValue([
      validCandidate,
    ] as unknown as PlaceCandidate[]);
    const service = new TravelPlanningService(deps);

    const result = await service.buildPlanningContext(request);

    expect(result.destinationSummary).toEqual(destinationSummary);
    expect(result.weatherSummary).toBeUndefined();
    expect(result.placeCandidates).toEqual([validCandidate]);
    expect(PlanningContextSchema.parse(result)).toEqual(result);
  });
});
