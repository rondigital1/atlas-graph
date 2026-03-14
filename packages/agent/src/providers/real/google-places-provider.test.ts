import { PlaceCandidateSchema, TripRequestSchema } from "@atlas-graph/core/schemas";
import type { TripRequest } from "@atlas-graph/core/types";
import { describe, expect, it, vi } from "vitest";

import { buildPlaceCandidateFieldMask } from "./google-places-field-mask";
import type { GooglePlaceSearchResult } from "./google-places-client";
import { GooglePlacesProvider } from "./google-places-provider";

const PlaceCandidateListSchema = PlaceCandidateSchema.array();

function createTripRequest(overrides: Partial<TripRequest> = {}): TripRequest {
  return TripRequestSchema.parse({
    destination: "Paris",
    startDate: "2026-06-12",
    endDate: "2026-06-18",
    budget: "medium",
    interests: ["art", "parks"],
    travelStyle: "balanced",
    groupType: "couple",
    ...overrides,
  });
}

describe("GooglePlacesProvider", () => {
  it("returns normalized place candidates with stable Google IDs and canonical names", async () => {
    const searchText = vi.fn(
      async (input: {
        textQuery: string;
        fieldMask?: string;
        pageSize?: number;
        center?: {
          lat: number;
          lng: number;
        };
      }): Promise<GooglePlaceSearchResult[]> => {
      switch (input.textQuery) {
        case "hotels in Paris":
          return [
            {
              id: "hotel-1",
              displayName: " Left Bank Corner Hotel ",
              primaryType: "lodging",
              types: ["lodging", "point_of_interest"],
              formattedAddress: "8 Rue de l'Ancienne Comedie, 75006 Paris",
              rating: 4.4,
              priceLevel: "PRICE_LEVEL_EXPENSIVE",
              location: {
                lat: 48.8535,
                lng: 2.3388,
              },
              addressComponents: [],
            },
          ];
        case "best restaurants in Paris":
          return [
            {
              id: "restaurant-1",
              displayName: "Marais Bistro Table",
              primaryType: "restaurant",
              types: ["restaurant", "food"],
              formattedAddress: "24 Rue Vieille du Temple, 75004 Paris",
              rating: 4.5,
              priceLevel: "PRICE_LEVEL_MODERATE",
              location: {
                lat: 48.8579,
                lng: 2.3622,
              },
              addressComponents: [],
            },
          ];
        case "top attractions in Paris":
          return [
            {
              id: "attraction-1",
              displayName: "Louvre Museum",
              primaryType: "museum",
              types: ["museum", "tourist_attraction"],
              formattedAddress: "Rue de Rivoli, 75001 Paris",
              rating: 4.8,
              location: {
                lat: 48.8606,
                lng: 2.3376,
              },
              addressComponents: [],
            },
          ];
        case "top activities in Paris":
          return [
            {
              id: "activity-1",
              displayName: "Luxembourg Gardens",
              primaryType: "park",
              types: ["park", "point_of_interest"],
              formattedAddress: "75006 Paris, France",
              rating: 4.7,
              location: {
                lat: 48.8462,
                lng: 2.3371,
              },
              addressComponents: [],
            },
          ];
        default:
          return [];
      }
      }
    );
    const provider = new GooglePlacesProvider({
      placesClient: {
        searchText,
      },
    });

    const result = await provider.searchPlaces(createTripRequest());

    expect(searchText).toHaveBeenNthCalledWith(1, {
      textQuery: "hotels in Paris",
      fieldMask: buildPlaceCandidateFieldMask(),
      pageSize: 2,
    });
    expect(searchText).toHaveBeenNthCalledWith(2, {
      textQuery: "best restaurants in Paris",
      fieldMask: buildPlaceCandidateFieldMask(),
      pageSize: 2,
    });
    expect(searchText).toHaveBeenNthCalledWith(3, {
      textQuery: "top attractions in Paris",
      fieldMask: buildPlaceCandidateFieldMask(),
      pageSize: 2,
    });
    expect(searchText).toHaveBeenNthCalledWith(4, {
      textQuery: "top activities in Paris",
      fieldMask: buildPlaceCandidateFieldMask(),
      pageSize: 2,
    });
    expect(PlaceCandidateListSchema.parse(result)).toEqual(result);
    expect(result).toEqual([
      {
        id: "hotel-1",
        name: "Left Bank Corner Hotel",
        category: "hotel",
        address: "8 Rue de l'Ancienne Comedie, 75006 Paris",
        rating: 4.4,
        priceLevel: 3,
        lat: 48.8535,
        lng: 2.3388,
        source: "google-places",
      },
      {
        id: "restaurant-1",
        name: "Marais Bistro Table",
        category: "restaurant",
        address: "24 Rue Vieille du Temple, 75004 Paris",
        rating: 4.5,
        priceLevel: 2,
        lat: 48.8579,
        lng: 2.3622,
        source: "google-places",
      },
      {
        id: "attraction-1",
        name: "Louvre Museum",
        category: "attraction",
        address: "Rue de Rivoli, 75001 Paris",
        rating: 4.8,
        lat: 48.8606,
        lng: 2.3376,
        source: "google-places",
      },
      {
        id: "activity-1",
        name: "Luxembourg Gardens",
        category: "activity",
        address: "75006 Paris, France",
        rating: 4.7,
        lat: 48.8462,
        lng: 2.3371,
        source: "google-places",
      },
    ]);
  });

  it("returns an empty list when Google returns no results", async () => {
    const provider = new GooglePlacesProvider({
      placesClient: {
        searchText: vi.fn().mockResolvedValue([]),
      },
    });

    const result = await provider.searchPlaces(createTripRequest());

    expect(result).toEqual([]);
  });

  it("drops malformed individual results safely and does not leak raw Google fields", async () => {
    const provider = new GooglePlacesProvider({
      placesClient: {
        searchText: vi.fn(
          async (input: {
            textQuery: string;
            fieldMask?: string;
            pageSize?: number;
            center?: {
              lat: number;
              lng: number;
            };
          }): Promise<GooglePlaceSearchResult[]> => {
          if (input.textQuery === "best restaurants in Paris") {
            return [
              {
                id: "restaurant-1",
                displayName: "Bistro Valid",
                primaryType: "restaurant",
                types: ["restaurant", "food"],
                formattedAddress: "1 Rue de Test, Paris",
                rating: 4.3,
                priceLevel: "PRICE_LEVEL_MODERATE",
                location: {
                  lat: 48.85,
                  lng: 2.35,
                },
                addressComponents: [],
              },
              {
                displayName: "Missing Stable Id",
                primaryType: "restaurant",
                types: ["restaurant"],
                addressComponents: [],
              },
              {
                id: "blank-name",
                displayName: "   ",
                primaryType: "restaurant",
                types: ["restaurant"],
                addressComponents: [],
              },
            ];
          }

          return [];
          }
        ),
      },
    });

    const result = await provider.searchPlaces(
      createTripRequest({ interests: ["food"] })
    );

    expect(result).toEqual([
      {
        id: "restaurant-1",
        name: "Bistro Valid",
        category: "restaurant",
        address: "1 Rue de Test, Paris",
        rating: 4.3,
        priceLevel: 2,
        lat: 48.85,
        lng: 2.35,
        source: "google-places",
      },
    ]);
    expect(result[0]).not.toHaveProperty("types");
    expect(result[0]).not.toHaveProperty("primaryType");
    expect(result[0]).not.toHaveProperty("location");
  });

  it("keeps partial results when one query fails", async () => {
    const provider = new GooglePlacesProvider({
      placesClient: {
        searchText: vi.fn(
          async (input: {
            textQuery: string;
            fieldMask?: string;
            pageSize?: number;
            center?: {
              lat: number;
              lng: number;
            };
          }): Promise<GooglePlaceSearchResult[]> => {
          if (input.textQuery === "top attractions in Paris") {
            throw new Error("Google Places unavailable");
          }

          if (input.textQuery === "best restaurants in Paris") {
            return [
              {
                id: "restaurant-1",
                displayName: "Bistro Partial",
                primaryType: "restaurant",
                types: ["restaurant", "food"],
                addressComponents: [],
              },
            ];
          }

          return [];
          }
        ),
      },
    });

    const result = await provider.searchPlaces(createTripRequest({ interests: ["art"] }));

    expect(result).toEqual([
      {
        id: "restaurant-1",
        name: "Bistro Partial",
        category: "restaurant",
        source: "google-places",
      },
    ]);
  });
});
