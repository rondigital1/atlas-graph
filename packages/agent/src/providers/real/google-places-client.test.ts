import { afterEach, describe, expect, it, vi } from "vitest";

import { GooglePlacesClient } from "./google-places-client";

describe("GooglePlacesClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls text search with the configured field mask and parses the response", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        places: [
          {
            displayName: {
              text: "Le Marais",
            },
            formattedAddress: "Le Marais, Paris, France",
            primaryType: "neighborhood",
            addressComponents: [
              {
                longText: "Le Marais",
                shortText: "Le Marais",
                types: ["neighborhood", "political"],
              },
            ],
          },
        ],
      })
    );

    vi.stubGlobal("fetch", fetchMock);

    const client = new GooglePlacesClient({ apiKey: "test-key" });
    const result = await client.searchText({
      textQuery: "neighborhoods in Paris",
      center: {
        lat: 48.8566,
        lng: 2.3522,
      },
    });

    expect(result).toEqual([
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
    ]);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://places.googleapis.com/v1/places:searchText",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": "test-key",
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.addressComponents,places.primaryType",
        },
      })
    );

    const requestBody = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string);

    expect(requestBody).toEqual({
      textQuery: "neighborhoods in Paris",
      pageSize: 5,
      locationBias: {
        circle: {
          center: {
            latitude: 48.8566,
            longitude: 2.3522,
          },
          radius: 25000,
        },
      },
    });
  });

  it("throws when the Places request fails", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 500 }));

    vi.stubGlobal("fetch", fetchMock);

    const client = new GooglePlacesClient({ apiKey: "test-key" });

    await expect(
      client.searchText({
        textQuery: "city center in Paris",
        center: {
          lat: 48.8566,
          lng: 2.3522,
        },
      })
    ).rejects.toThrow("Google Places Text Search failed with status 500.");
  });

  it("throws when the Places payload is malformed", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        places: {
          id: "not-an-array",
        },
      })
    );

    vi.stubGlobal("fetch", fetchMock);

    const client = new GooglePlacesClient({ apiKey: "test-key" });

    await expect(
      client.searchText({
        textQuery: "city center in Paris",
        center: {
          lat: 48.8566,
          lng: 2.3522,
        },
      })
    ).rejects.toThrow("Google Places Text Search returned an invalid places payload.");
  });
});
