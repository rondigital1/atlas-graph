import { MockWeatherProvider, WeatherApiProvider } from "@atlas-graph/agent";
import { describe, expect, it } from "vitest";

import { createWeatherProvider } from "./create-weather-provider";

describe("createWeatherProvider", () => {
  it("returns the mock provider when no weather API key is configured", () => {
    const result = createWeatherProvider({});

    expect(result).toBeInstanceOf(MockWeatherProvider);
  });

  it("returns the real provider when WEATHERAPI_API_KEY is configured", () => {
    const result = createWeatherProvider({
      WEATHERAPI_API_KEY: "test-key",
    });

    expect(result).toBeInstanceOf(WeatherApiProvider);
  });

  it("accepts OPENWEATHER_API_KEY as a compatibility fallback", () => {
    const result = createWeatherProvider({
      OPENWEATHER_API_KEY: "test-key",
    });

    expect(result).toBeInstanceOf(WeatherApiProvider);
  });
});
