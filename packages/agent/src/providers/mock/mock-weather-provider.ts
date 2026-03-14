import { WeatherSummarySchema } from "@atlas-graph/core/schemas";
import type { TripRequest, WeatherSummary } from "@atlas-graph/core/types";

import type { WeatherProvider } from "../ports";
import { buildMockWeatherSummary } from "./mock-data";

export class MockWeatherProvider implements WeatherProvider {
  public async getWeatherSummary(input: TripRequest): Promise<WeatherSummary> {
    return WeatherSummarySchema.parse(buildMockWeatherSummary(input));
  }
}
