import { afterEach, describe, expect, it, vi } from "vitest";

import { GoogleGeocodingClient } from "./google-geocoding-client";

describe("GoogleGeocodingClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls the geocoding endpoint and extracts the canonical destination", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        status: "OK",
        results: [
          {
            formatted_address: "Paris, France",
            address_components: [
              {
                long_name: "Paris",
                short_name: "Paris",
                types: ["locality", "political"],
              },
              {
                long_name: "France",
                short_name: "FR",
                types: ["country", "political"],
              },
            ],
            geometry: {
              location: {
                lat: 48.8566,
                lng: 2.3522,
              },
            },
          },
        ],
      })
    );

    vi.stubGlobal("fetch", fetchMock);

    const client = new GoogleGeocodingClient({ apiKey: "test-key" });
    const result = await client.geocodeDestination("Paris");

    expect(result).toEqual({
      destination: "Paris",
      country: "France",
      formattedAddress: "Paris, France",
      coordinates: {
        lat: 48.8566,
        lng: 2.3522,
      },
    });

    const requestUrl = fetchMock.mock.calls[0]?.[0];

    expect(requestUrl).toBeInstanceOf(URL);
    expect((requestUrl as URL).toString()).toBe(
      "https://maps.googleapis.com/maps/api/geocode/json?address=Paris&key=test-key"
    );
  });

  it("falls back to the first formatted-address segment when locality is missing", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        status: "OK",
        results: [
          {
            formatted_address: "Bavaria, Germany",
            address_components: [
              {
                long_name: "Bavaria",
                short_name: "BY",
                types: ["administrative_area_level_1", "political"],
              },
              {
                long_name: "Germany",
                short_name: "DE",
                types: ["country", "political"],
              },
            ],
            geometry: {
              location: {
                lat: 48.7904,
                lng: 11.4979,
              },
            },
          },
        ],
      })
    );

    vi.stubGlobal("fetch", fetchMock);

    const client = new GoogleGeocodingClient({ apiKey: "test-key" });
    const result = await client.geocodeDestination("Bavaria");

    expect(result.destination).toBe("Bavaria");
    expect(result.country).toBe("Germany");
  });

  it("throws when geocoding returns zero results", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        status: "ZERO_RESULTS",
        results: [],
      })
    );

    vi.stubGlobal("fetch", fetchMock);

    const client = new GoogleGeocodingClient({ apiKey: "test-key" });

    await expect(client.geocodeDestination("Unknown Place")).rejects.toThrow(
      "Google Geocoding failed with status ZERO_RESULTS."
    );
  });

  it("throws when the geocoding request itself fails", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 503 }));

    vi.stubGlobal("fetch", fetchMock);

    const client = new GoogleGeocodingClient({ apiKey: "test-key" });

    await expect(client.geocodeDestination("Paris")).rejects.toThrow(
      "Google Geocoding request failed with status 503."
    );
  });
});
