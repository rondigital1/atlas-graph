import type {
  DestinationSummary,
  PlaceCandidate,
  TripRequest,
  WeatherSummary,
} from "@atlas-graph/core/types";

/**
 * Domain-facing boundary for destination enrichment.
 * Implementations must return normalized planner-safe data and must not expose
 * vendor response shapes beyond this port.
 */
export interface DestinationInfoProvider {
  getDestinationSummary(input: TripRequest): Promise<DestinationSummary>;
}

/**
 * Domain-facing boundary for place candidate retrieval.
 * Implementations must normalize and filter provider results before returning them.
 */
export interface PlacesProvider {
  searchPlaces(input: TripRequest): Promise<PlaceCandidate[]>;
}

/**
 * Domain-facing boundary for weather enrichment.
 * Implementations must return normalized planner-safe weather data, or
 * `undefined` when no useful weather context is available.
 */
export interface WeatherProvider {
  getWeatherSummary(input: TripRequest): Promise<WeatherSummary | undefined>;
}
