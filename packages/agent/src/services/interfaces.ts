import type {
  DestinationSummary,
  PlaceCandidate,
  TripRequest,
  WeatherSummary,
} from "@atlas-graph/core/types";

export interface DestinationInfoProvider {
  getDestinationSummary(input: TripRequest): Promise<DestinationSummary>;
}

export interface PlacesProvider {
  searchPlaces(input: TripRequest): Promise<PlaceCandidate[]>;
}

export interface WeatherProvider {
  getWeatherSummary(input: TripRequest): Promise<WeatherSummary | undefined>;
}
