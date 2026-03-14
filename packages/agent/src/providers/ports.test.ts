import {
  DestinationSummarySchema,
  PlaceCandidateSchema,
  PlanningContextSchema,
  TripPlanSchema,
  TripRequestSchema,
  WeatherSummarySchema,
} from "@atlas-graph/core/schemas";
import type {
  DestinationInfoProvider,
  PlacesProvider,
  WeatherProvider,
} from "./ports";
import { describe, expect, it, vi } from "vitest";

import { TravelPlanningService } from "../services/travel-planning-service";

const PlaceCandidateListSchema = PlaceCandidateSchema.array();

describe("provider ports", () => {
  it("accepts normalized provider fixtures through the shared ports module", async () => {
    const request = TripRequestSchema.parse({
      destination: "Paris",
      startDate: "2026-05-10",
      endDate: "2026-05-14",
      budget: "medium",
      interests: ["art", "food"],
      travelStyle: "balanced",
      groupType: "couple",
    });
    const destinationInfoProvider: DestinationInfoProvider = {
      getDestinationSummary: vi.fn().mockResolvedValue(
        DestinationSummarySchema.parse({
          destination: "Paris",
          country: "France",
          summary: "Dense neighborhoods and strong dining variety.",
          bestAreas: ["Le Marais"],
          notes: ["Transit is straightforward."],
        })
      ),
    };
    const placesProvider: PlacesProvider = {
      searchPlaces: vi.fn().mockResolvedValue(
        PlaceCandidateListSchema.parse([
          {
            id: "paris-louvre",
            name: "Louvre Museum",
            category: "attraction",
            source: "contract-fixture",
            summary: "Major art collection.",
          },
        ])
      ),
    };
    const weatherProvider: WeatherProvider = {
      getWeatherSummary: vi.fn().mockResolvedValue(
        WeatherSummarySchema.parse({
          destination: "Paris",
          summary: "Mild spring weather is typical.",
          dailyNotes: ["Carry a light layer for evenings."],
          averageHighC: 19,
          averageLowC: 11,
        })
      ),
    };
    const service = new TravelPlanningService({
      destinationInfoProvider,
      placesProvider,
      weatherProvider,
      plannerRunner: {
        run: vi.fn().mockResolvedValue(
          TripPlanSchema.parse({
            destinationSummary: "Paris offers art, food, and walkable neighborhoods.",
            tripStyleSummary: "Balanced city trip.",
            practicalNotes: [],
            days: [
              {
                dayNumber: 1,
                date: "2026-05-10",
                theme: "Museums and neighborhood walks",
                morning: [
                  {
                    title: "Visit the Louvre",
                    placeId: "paris-louvre",
                    description: "Start with a core art stop.",
                  },
                ],
                afternoon: [],
                evening: [],
              },
            ],
            topRecommendations: [
              {
                placeId: "paris-louvre",
                name: "Louvre Museum",
                reason: "It matches the art interest.",
              },
            ],
            warnings: [],
            rationale: "Contract fixture plan.",
          })
        ),
      },
    });

    const context = await service.buildPlanningContext(request);

    expect(PlanningContextSchema.parse(context)).toEqual(context);
    expect(context.destinationSummary?.destination).toBe("Paris");
    expect(context.placeCandidates[0]?.id).toBe("paris-louvre");
    expect(context.weatherSummary?.averageHighC).toBe(19);
  });

  it("keeps missing weather context compatible with PlanningContextSchema", async () => {
    const request = TripRequestSchema.parse({
      destination: "Lisbon",
      startDate: "2026-05-10",
      endDate: "2026-05-14",
      budget: "medium",
      interests: ["architecture"],
      travelStyle: "balanced",
      groupType: "solo",
    });
    const weatherProvider: WeatherProvider = {
      getWeatherSummary: vi.fn().mockResolvedValue(undefined),
    };
    const service = new TravelPlanningService({
      destinationInfoProvider: {
        getDestinationSummary: vi.fn().mockResolvedValue(
          DestinationSummarySchema.parse({
            destination: "Lisbon",
            summary: "Compact hills, viewpoints, and historic districts.",
            bestAreas: [],
            notes: [],
          })
        ),
      },
      placesProvider: {
        searchPlaces: vi.fn().mockResolvedValue([]),
      },
      weatherProvider,
      plannerRunner: {
        run: vi.fn(),
      },
    });

    const context = await service.buildPlanningContext(request);

    expect(PlanningContextSchema.parse(context)).toEqual(context);
    expect(context.weatherSummary).toBeUndefined();
    expect(weatherProvider.getWeatherSummary).toHaveBeenCalledWith(request);
  });
});
