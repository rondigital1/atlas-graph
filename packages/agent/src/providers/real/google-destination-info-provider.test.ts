import { PlanningContextSchema, TripRequestSchema } from "@atlas-graph/core/schemas";
import type { TripRequest } from "@atlas-graph/core/types";
import { describe, expect, it, vi } from "vitest";

import { TravelPlanningService } from "../../services/travel-planning-service";
import { GoogleDestinationInfoProvider } from "./google-destination-info-provider";
import type { GooglePlaceSearchResult } from "./google-places-client";

function createTripRequest(overrides: Partial<TripRequest> = {}): TripRequest {
  return TripRequestSchema.parse({
    destination: "Paris",
    startDate: "2026-06-12",
    endDate: "2026-06-18",
    budget: "medium",
    interests: ["food", "culture"],
    travelStyle: "balanced",
    groupType: "couple",
    ...overrides,
  });
}

function createResolvedDestination() {
  return {
    destination: "Paris",
    country: "France",
    formattedAddress: "Paris, France",
    coordinates: {
      lat: 48.8566,
      lng: 2.3522,
    },
  };
}

describe("GoogleDestinationInfoProvider", () => {
  it("returns a normalized destination summary with canonicalized areas and notes", async () => {
    const geocodingClient = {
      geocodeDestination: vi.fn().mockResolvedValue(createResolvedDestination()),
    };
    const placesClient = {
      searchText: vi.fn(
        async (input: {
          textQuery: string;
          center: {
            lat: number;
            lng: number;
          };
        }): Promise<GooglePlaceSearchResult[]> => {
        if (input.textQuery.startsWith("neighborhoods")) {
          return [
            {
              displayName: "  Le Marais ",
              formattedAddress: "Le Marais, Paris, France",
              primaryType: "neighborhood",
              addressComponents: [
                {
                  longText: "Le Marais",
                  types: ["neighborhood", "political"],
                },
                {
                  longText: "Paris",
                  types: ["locality", "political"],
                },
              ],
            },
          ];
        }

        if (input.textQuery.startsWith("districts")) {
          return [
            {
              displayName: "Saint-Germain-des-Pres",
              formattedAddress: "Saint-Germain-des-Pres, Paris, France",
              primaryType: "administrative_area_level_3",
              addressComponents: [
                {
                  longText: "Saint-Germain-des-Pres",
                  types: ["administrative_area_level_3", "political"],
                },
              ],
            },
          ];
        }

        if (input.textQuery.startsWith("city center")) {
          return [
            {
              displayName: "Latin Quarter",
              formattedAddress: "Latin Quarter, Paris, France",
              primaryType: "neighborhood",
              addressComponents: [
                {
                  longText: "Latin Quarter",
                  types: ["neighborhood", "political"],
                },
              ],
            },
          ];
        }

        return [
          {
            displayName: "Louvre Museum",
            formattedAddress: "Rue de Rivoli, Paris, France",
            primaryType: "museum",
            addressComponents: [],
          },
          {
            displayName: "Eiffel Tower",
            formattedAddress: "Champ de Mars, Paris, France",
            primaryType: "tourist_attraction",
            addressComponents: [],
          },
        ];
        }
      ),
    };
    const provider = new GoogleDestinationInfoProvider({
      geocodingClient,
      placesClient,
    });

    const result = await provider.getDestinationSummary(createTripRequest());

    expect(result).toEqual({
      destination: "Paris",
      country: "France",
      summary:
        "Paris, France has distinct visitor areas such as Le Marais and Saint-Germain-des-Pres, with high-signal anchors like Louvre Museum and Eiffel Tower.",
      bestAreas: ["Le Marais", "Saint-Germain-des-Pres", "Latin Quarter"],
      notes: [
        "Nearby anchors include Louvre Museum and Eiffel Tower.",
        "Useful base areas include Le Marais, Saint-Germain-des-Pres, and Latin Quarter.",
      ],
    });
    expect(placesClient.searchText).toHaveBeenCalledTimes(4);
  });

  it("returns a geocode-only summary when Places enrichment is unavailable", async () => {
    const provider = new GoogleDestinationInfoProvider({
      geocodingClient: {
        geocodeDestination: vi.fn().mockResolvedValue(createResolvedDestination()),
      },
      placesClient: {
        searchText: vi.fn().mockRejectedValue(new Error("Places unavailable")),
      },
    });

    const result = await provider.getDestinationSummary(createTripRequest());

    expect(result).toEqual({
      destination: "Paris",
      country: "France",
      summary:
        "Paris, France is a resolved travel destination with a practical central core and concentrated visitor activity.",
      bestAreas: [],
      notes: [
        "Places enrichment was sparse, so this summary uses canonical geocoding only.",
      ],
    });
  });

  it("rejects when canonical geocoding fails", async () => {
    const provider = new GoogleDestinationInfoProvider({
      geocodingClient: {
        geocodeDestination: vi
          .fn()
          .mockRejectedValue(new Error("Google Geocoding failed with status ZERO_RESULTS.")),
      },
      placesClient: {
        searchText: vi.fn(),
      },
    });

    await expect(provider.getDestinationSummary(createTripRequest())).rejects.toThrow(
      "Google Geocoding failed with status ZERO_RESULTS."
    );
  });

  it("keeps TravelPlanningService context compatible with the real provider output", async () => {
    const destinationInfoProvider = new GoogleDestinationInfoProvider({
      geocodingClient: {
        geocodeDestination: vi.fn().mockResolvedValue(createResolvedDestination()),
      },
      placesClient: {
        searchText: vi.fn(
          async (input: {
            textQuery: string;
            center: {
              lat: number;
              lng: number;
            };
          }): Promise<GooglePlaceSearchResult[]> => {
          if (input.textQuery.startsWith("top attractions")) {
            return [
              {
                displayName: "Louvre Museum",
                formattedAddress: "Rue de Rivoli, Paris, France",
                primaryType: "museum",
                addressComponents: [],
              },
            ];
          }

          return [
            {
              displayName: "Le Marais",
              formattedAddress: "Le Marais, Paris, France",
              primaryType: "neighborhood",
              addressComponents: [
                {
                  longText: "Le Marais",
                  types: ["neighborhood", "political"],
                },
              ],
            },
          ];
          }
        ),
      },
    });
    const service = new TravelPlanningService({
      destinationInfoProvider,
      placesProvider: {
        searchPlaces: vi.fn().mockResolvedValue([]),
      },
      plannerRunner: {
        run: vi.fn(),
      },
      weatherProvider: {
        getWeatherSummary: vi.fn().mockRejectedValue(new Error("No weather in AGE-37")),
      },
    });

    const result = await service.buildPlanningContext(createTripRequest());

    expect(result.destinationSummary).toEqual({
      destination: "Paris",
      country: "France",
      summary:
        "Paris, France has distinct visitor areas such as Le Marais, with high-signal anchors like Louvre Museum.",
      bestAreas: ["Le Marais"],
      notes: [
        "Nearby anchors include Louvre Museum.",
        "Useful base areas include Le Marais.",
      ],
    });
    expect(PlanningContextSchema.parse(result)).toEqual(result);
  });

  it("lets TravelPlanningService omit destinationSummary when real geocoding fails", async () => {
    const destinationInfoProvider = new GoogleDestinationInfoProvider({
      geocodingClient: {
        geocodeDestination: vi
          .fn()
          .mockRejectedValue(new Error("Google Geocoding failed with status ZERO_RESULTS.")),
      },
      placesClient: {
        searchText: vi.fn(),
      },
    });
    const service = new TravelPlanningService({
      destinationInfoProvider,
      placesProvider: {
        searchPlaces: vi.fn().mockResolvedValue([]),
      },
      plannerRunner: {
        run: vi.fn(),
      },
      weatherProvider: {
        getWeatherSummary: vi.fn().mockRejectedValue(new Error("No weather in AGE-37")),
      },
    });

    const result = await service.buildPlanningContext(createTripRequest());

    expect(result.destinationSummary).toBeUndefined();
    expect(PlanningContextSchema.parse(result)).toEqual(result);
  });
});
