import {
  DestinationSummarySchema,
  PlaceCandidateSchema,
  WeatherSummarySchema,
} from "@atlas-graph/core/schemas";
import { describe, expect, it } from "vitest";

import {
  cleanText,
  deduplicatePlaceCandidates,
  normalizeDestinationSummary,
  normalizePlaceCandidate,
  normalizePlaceCandidates,
  normalizeProviderResults,
  normalizeWeatherSummary,
} from "../index";

const PlaceCandidateListSchema = PlaceCandidateSchema.array();

describe("normalization utilities", () => {
  it("cleanText trims and collapses whitespace", () => {
    expect(cleanText("  Hello   world   !  ")).toBe("Hello world!");
    expect(cleanText("   ")).toBeUndefined();
  });

  it("normalizePlaceCandidate drops unusable input with no valid name", () => {
    expect(
      normalizePlaceCandidate({
        id: "missing-name",
        category: "restaurant",
        source: "mock",
      })
    ).toBeNull();
  });

  it("normalizePlaceCandidates returns schema-valid output", () => {
    const result = normalizePlaceCandidates([
      {
        name: "  Senso-ji Temple  ",
        category: "Attractions",
        description: "  Historic temple   complex. ",
        rating: "4.7",
        price_level: "2",
        latitude: "35.7148",
        longitude: "139.7967",
      },
      {
        id: "blank-summary",
        name: "Asakusa Lunch Set",
        category: "restaurant",
        summary: "   ",
        source: " mock-provider ",
        rating: "not-a-number",
        lat: 999,
      },
      {
        id: "invalid-place",
        name: "   ",
        category: "hotel",
      },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0]?.id).toBe("senso-ji-temple-attraction");
    expect(result[0]?.category).toBe("attraction");
    expect(result[0]?.source).toBe("normalized-provider");
    expect(result[1]?.summary).toBeUndefined();
    expect(result[1]?.rating).toBeUndefined();
    expect(result[1]?.lat).toBeUndefined();
    expect(PlaceCandidateListSchema.parse(result)).toEqual(result);
  });

  it("deduplicatePlaceCandidates removes duplicates deterministically", () => {
    const result = deduplicatePlaceCandidates([
      PlaceCandidateSchema.parse({
        id: "tokyo-sensoji",
        name: "Senso-ji Temple",
        category: "attraction",
        source: "mock",
      }),
      PlaceCandidateSchema.parse({
        id: "other-id",
        name: "  Senso-ji Temple ",
        category: "attraction",
        source: "mock",
        summary: "Historic landmark.",
      }),
      PlaceCandidateSchema.parse({
        id: "tokyo-meiji",
        name: "Meiji Shrine",
        category: "attraction",
        source: "mock",
      }),
    ]);

    expect(result).toHaveLength(2);
    expect(result[0]?.name).toBe("Senso-ji Temple");
    expect(result[0]?.summary).toBe("Historic landmark.");
    expect(result[1]?.id).toBe("tokyo-meiji");
  });

  it("more complete duplicate wins over less complete duplicate", () => {
    const result = deduplicatePlaceCandidates([
      PlaceCandidateSchema.parse({
        id: "barcelona-born-tapas",
        name: "Born Tapas House",
        category: "restaurant",
        source: "mock",
      }),
      PlaceCandidateSchema.parse({
        id: "barcelona-born-tapas",
        name: "Born Tapas House",
        category: "restaurant",
        source: "mock",
        address: "Carrer de la Princesa, 19",
        summary: "Lively small-plate stop.",
        rating: 4.5,
        lat: 41.3853,
        lng: 2.1816,
      }),
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(
      PlaceCandidateSchema.parse({
        id: "barcelona-born-tapas",
        name: "Born Tapas House",
        category: "restaurant",
        source: "mock",
        address: "Carrer de la Princesa, 19",
        summary: "Lively small-plate stop.",
        rating: 4.5,
        lat: 41.3853,
        lng: 2.1816,
      })
    );
  });

  it("destination normalization removes blank bestAreas and notes", () => {
    const result = normalizeDestinationSummary({
      destination: "  Tokyo ",
      country: " Japan ",
      summary: " Dense city with strong transit. ",
      bestAreas: [" Shibuya ", " ", "", "Asakusa"],
      notes: [" Carry cash for smaller shops. ", "   ", "Book teamLab ahead."],
    });

    expect(result).toEqual(
      DestinationSummarySchema.parse({
        destination: "Tokyo",
        country: "Japan",
        summary: "Dense city with strong transit.",
        bestAreas: ["Shibuya", "Asakusa"],
        notes: ["Carry cash for smaller shops.", "Book teamLab ahead."],
      })
    );
  });

  it("weather normalization handles missing and invalid optional numeric fields safely", () => {
    const result = normalizeWeatherSummary({
      destination: "  Paris ",
      summary: " Mild spring conditions. ",
      dailyNotes: [" Light jacket at night. ", "  "],
      averageHighC: "18",
      averageLowC: "unknown",
    });

    expect(result).toEqual(
      WeatherSummarySchema.parse({
        destination: "Paris",
        summary: "Mild spring conditions.",
        dailyNotes: ["Light jacket at night."],
        averageHighC: 18,
      })
    );
  });

  it("normalizeProviderResults returns planning-ready normalized outputs", () => {
    const result = normalizeProviderResults({
      destinationSummary: {
        destination: " Barcelona ",
        summary: " Architecture and neighborhood dining. ",
        bestAreas: ["Eixample", " ", "El Born"],
      },
      weatherSummary: {
        destination: "Barcelona",
        summary: " Warm daytime weather. ",
        dailyNotes: [" Bring sunscreen. "],
      },
      placeCandidates: [
        {
          name: "Sagrada Familia",
          category: "Attractions",
          summary: " Signature architecture stop. ",
        },
        {
          id: "duplicate-sagrada",
          name: "Sagrada Familia",
          category: "attraction",
          source: "mock",
          address: "Carrer de Mallorca, 401",
        },
      ],
    });

    expect(result.destinationSummary?.bestAreas).toEqual(["Eixample", "El Born"]);
    expect(result.weatherSummary?.dailyNotes).toEqual(["Bring sunscreen."]);
    expect(result.placeCandidates).toHaveLength(1);
    expect(result.placeCandidates[0]?.category).toBe("attraction");
    expect(PlaceCandidateSchema.parse(result.placeCandidates[0])).toEqual(
      result.placeCandidates[0]
    );
  });
});
