import { MockWeatherProvider, WeatherApiProvider } from "@atlas-graph/agent";
import type { WeatherProvider } from "@atlas-graph/agent";

type WeatherProviderEnvironment = Record<string, string | undefined>;

export function createWeatherProvider(
  environment: WeatherProviderEnvironment = process.env
): WeatherProvider {
  const apiKey =
    cleanEnvironmentValue(environment["WEATHERAPI_API_KEY"]) ??
    cleanEnvironmentValue(environment["OPENWEATHER_API_KEY"]);

  if (!apiKey) {
    return new MockWeatherProvider();
  }

  return new WeatherApiProvider({ apiKey });
}

function cleanEnvironmentValue(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length === 0 ? undefined : trimmedValue;
}
