import { afterEach, describe, expect, it, vi } from "vitest";

import { WeatherApiError } from "./weather-api-error-mapper";
import { WeatherApiClient } from "./weather-api-client";

describe("WeatherApiClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("builds the WeatherAPI forecast request and caps days at the documented limit", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        location: {
          name: "Paris",
        },
        forecast: {
          forecastday: [],
        },
      })
    );

    vi.stubGlobal("fetch", fetchMock);

    const client = new WeatherApiClient({ apiKey: "test-key" });

    await client.fetchForecast({
      destination: "Paris",
      days: 30,
    });

    const requestUrl = fetchMock.mock.calls[0]?.[0];

    expect(requestUrl).toBeInstanceOf(URL);
    expect((requestUrl as URL).toString()).toBe(
      "https://api.weatherapi.com/v1/forecast.json?key=test-key&q=Paris&days=14"
    );
  });

  it("maps WeatherAPI quota responses into structured client errors", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json(
        {
          error: {
            code: 2007,
            message: "API key has exceeded calls per month quota.",
          },
        },
        {
          status: 403,
        }
      )
    );

    vi.stubGlobal("fetch", fetchMock);

    const client = new WeatherApiClient({ apiKey: "test-key" });

    await expect(
      client.fetchForecast({
        destination: "Paris",
        days: 5,
      })
    ).rejects.toEqual(
      expect.objectContaining<Partial<WeatherApiError>>({
        name: "WeatherApiError",
        kind: "quota",
        status: 403,
        code: 2007,
        message: "API key has exceeded calls per month quota.",
      })
    );
  });

  it("rejects with an invalid-response error when WeatherAPI returns non-JSON", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response("not-json", { status: 200 }));

    vi.stubGlobal("fetch", fetchMock);

    const client = new WeatherApiClient({ apiKey: "test-key" });

    await expect(
      client.fetchForecast({
        destination: "Paris",
        days: 3,
      })
    ).rejects.toEqual(
      expect.objectContaining<Partial<WeatherApiError>>({
        name: "WeatherApiError",
        kind: "invalid-response",
        message: "WeatherAPI returned invalid JSON.",
      })
    );
  });
});
