import type { TripRequest, WeatherSummary } from "@atlas-graph/core/types";

import { cleanOptionalText } from "../../normalization";
import type { WeatherProvider } from "../../services/interfaces";
import {
  WeatherApiClient,
  type WeatherApiForecastInput,
  type WeatherApiForecastResponse,
} from "./weather-api-client";
import { mapWeatherApiForecastToSummary } from "./weather-api-response-mapper";

import { buildForecastOverlap } from "./weather-date-utils";

export interface WeatherApiProviderDependencies {
  weatherClient: {
    fetchForecast(
      input: WeatherApiForecastInput
    ): Promise<WeatherApiForecastResponse>;
  };
  now: () => Date;
}

export interface WeatherApiProviderOptions {
  apiKey?: string;
  weatherClient?: WeatherApiProviderDependencies["weatherClient"];
  now?: WeatherApiProviderDependencies["now"];
}

export class WeatherApiProvider implements WeatherProvider {
  private readonly weatherClient: WeatherApiProviderDependencies["weatherClient"];
  private readonly now: WeatherApiProviderDependencies["now"];

  public constructor(input: WeatherApiProviderOptions) {
    if (!input.weatherClient && !input.apiKey) {
      throw new Error(
        "WEATHERAPI_API_KEY is required when a weather client is not provided."
      );
    }

    this.weatherClient =
      input.weatherClient ?? new WeatherApiClient({ apiKey: input.apiKey! });
    this.now = input.now ?? (() => new Date());
  }

  public async getWeatherSummary(
    input: TripRequest
  ): Promise<WeatherSummary | undefined> {
    const overlap = buildForecastOverlap(input, this.now());

    if (!overlap) {
      return undefined;
    }

    const destination = cleanOptionalText(input.destination) ?? input.destination;

    try {
      const response = await this.weatherClient.fetchForecast({
        destination,
        days: overlap.requestDays,
      });

      return mapWeatherApiForecastToSummary({
        request: input,
        response,
        overlappingDates: overlap.overlappingDates,
      });
    } catch {
      return undefined;
    }
  }
}

