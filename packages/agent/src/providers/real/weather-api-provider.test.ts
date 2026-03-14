import { TripRequestSchema, WeatherSummarySchema } from "@atlas-graph/core/schemas";
import type { TripRequest } from "@atlas-graph/core/types";
import { describe, expect, it, vi } from "vitest";

import type { WeatherApiForecastResponse } from "./weather-api-client";
import { WeatherApiProvider } from "./weather-api-provider";

function createTripRequest(overrides: Partial<TripRequest> = {}): TripRequest {
  return TripRequestSchema.parse({
    destination: "Paris",
    startDate: "2026-03-15",
    endDate: "2026-03-17",
    budget: "medium",
    interests: ["food", "culture"],
    travelStyle: "balanced",
    groupType: "couple",
    ...overrides,
  });
}

describe("WeatherApiProvider", () => {
  it("returns a normalized WeatherSummary for overlapping forecast days", async () => {
    const fetchForecast = vi
      .fn<
        (input: {
          destination: string;
          days: number;
        }) => Promise<WeatherApiForecastResponse>
      >()
      .mockResolvedValue({
        location: {
          name: "Paris",
        },
        forecast: {
          forecastday: [
            {
              date: "2026-03-14",
              day: {
                maxtemp_c: 18,
                mintemp_c: 10,
                avgtemp_c: 14,
                condition: {
                  text: "Sunny",
                },
              },
            },
            {
              date: "2026-03-15",
              day: {
                maxtemp_c: 20,
                mintemp_c: 12,
                avgtemp_c: 16,
                condition: {
                  text: "Partly cloudy",
                },
              },
            },
            {
              date: "2026-03-16",
              day: {
                maxtemp_c: 22,
                mintemp_c: 13,
                avgtemp_c: 17,
                totalprecip_mm: 6,
                daily_will_it_rain: 1,
                daily_chance_of_rain: 75,
                condition: {
                  text: "Partly cloudy",
                },
              },
            },
            {
              date: "2026-03-17",
              day: {
                maxtemp_c: 24,
                mintemp_c: 14,
                avgtemp_c: 18,
                maxwind_kph: 42,
                condition: {
                  text: "Sunny",
                },
              },
            },
          ],
        },
      });
    const provider = new WeatherApiProvider({
      weatherClient: {
        fetchForecast,
      },
      now: () => new Date("2026-03-14T12:00:00.000Z"),
    });

    const result = await provider.getWeatherSummary(createTripRequest());

    expect(fetchForecast).toHaveBeenCalledWith({
      destination: "Paris",
      days: 4,
    });
    expect(result).toEqual(
      WeatherSummarySchema.parse({
        destination: "Paris",
        summary:
          "Expect partly cloudy conditions with average highs near 22C and lows near 13C.",
        dailyNotes: [
          "Rain is likely around Mar 16; keep a rain layer and one indoor backup option handy.",
          "Breezy conditions are possible around Mar 17; prioritize sheltered outdoor time when possible.",
        ],
        averageHighC: 22,
        averageLowC: 13,
      })
    );
  });

  it("returns the best valid summary when the provider response is partial", async () => {
    const provider = new WeatherApiProvider({
      weatherClient: {
        fetchForecast: vi.fn().mockResolvedValue({
          forecast: {
            forecastday: [
              {
                date: "2026-03-15",
                day: {
                  maxtemp_c: 19,
                  condition: {
                    text: "Sunny",
                  },
                },
              },
            ],
          },
        }),
      },
      now: () => new Date("2026-03-14T08:00:00.000Z"),
    });

    const result = await provider.getWeatherSummary(createTripRequest());

    expect(result).toEqual(
      WeatherSummarySchema.parse({
        destination: "Paris",
        summary: "Expect sunny conditions with daytime temperatures near 19C.",
        dailyNotes: [],
        averageHighC: 19,
      })
    );
  });

  it("returns undefined instead of throwing when WeatherAPI is unavailable", async () => {
    const provider = new WeatherApiProvider({
      weatherClient: {
        fetchForecast: vi
          .fn()
          .mockRejectedValue(new Error("API key has exceeded calls per month quota.")),
      },
      now: () => new Date("2026-03-14T08:00:00.000Z"),
    });

    await expect(provider.getWeatherSummary(createTripRequest())).resolves.toBe(
      undefined
    );
  });

  it("returns undefined for malformed or unusable WeatherAPI payloads", async () => {
    const provider = new WeatherApiProvider({
      weatherClient: {
        fetchForecast: vi.fn().mockResolvedValue({
          location: {
            name: "Paris",
          },
          forecast: {
            forecastday: [
              {
                date: "2026-03-15",
              },
            ],
          },
        }),
      },
      now: () => new Date("2026-03-14T08:00:00.000Z"),
    });

    await expect(provider.getWeatherSummary(createTripRequest())).resolves.toBe(
      undefined
    );
  });

  it("does not leak raw WeatherAPI response fields past the provider boundary", async () => {
    const provider = new WeatherApiProvider({
      weatherClient: {
        fetchForecast: vi.fn().mockResolvedValue({
          location: {
            name: "Paris",
          },
          forecast: {
            forecastday: [
              {
                date: "2026-03-15",
                day: {
                  maxtemp_c: 21,
                  mintemp_c: 12,
                  daily_chance_of_rain: 80,
                  daily_will_it_rain: 1,
                  condition: {
                    text: "Patchy rain nearby",
                    code: 1063,
                  },
                },
              },
            ],
          },
        }),
      },
      now: () => new Date("2026-03-14T08:00:00.000Z"),
    });

    const result = await provider.getWeatherSummary(createTripRequest());

    expect(result).toBeDefined();
    expect(result).not.toHaveProperty("location");
    expect(result).not.toHaveProperty("forecast");
    expect(result).not.toHaveProperty("maxtemp_c");
    expect(result).not.toHaveProperty("daily_chance_of_rain");
    expect(result).not.toHaveProperty("condition");
  });

  it("skips the API call when the trip does not overlap WeatherAPI's forecast window", async () => {
    const fetchForecast = vi.fn();
    const provider = new WeatherApiProvider({
      weatherClient: {
        fetchForecast,
      },
      now: () => new Date("2026-03-14T08:00:00.000Z"),
    });

    const result = await provider.getWeatherSummary(
      createTripRequest({
        startDate: "2026-04-10",
        endDate: "2026-04-15",
      })
    );

    expect(result).toBeUndefined();
    expect(fetchForecast).not.toHaveBeenCalled();
  });
});
