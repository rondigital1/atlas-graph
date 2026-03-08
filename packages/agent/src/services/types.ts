import type {
  DestinationInfoProvider,
  PlacesProvider,
  WeatherProvider,
} from "./interfaces";

export interface TravelPlanningServiceDeps {
  destinationInfoProvider: DestinationInfoProvider;
  placesProvider: PlacesProvider;
  weatherProvider: WeatherProvider;
}
