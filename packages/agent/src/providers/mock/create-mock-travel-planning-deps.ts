import type { TravelPlanningServiceDeps } from "../../services";
import { MockDestinationInfoProvider } from "./mock-destination-info-provider";
import { MockPlacesProvider } from "./mock-places-provider";
import { MockWeatherProvider } from "./mock-weather-provider";

export function createMockTravelPlanningDeps(): TravelPlanningServiceDeps {
  return {
    destinationInfoProvider: new MockDestinationInfoProvider(),
    placesProvider: new MockPlacesProvider(),
    plannerRunner: {
      async run() {
        throw new Error("Mock plannerRunner.run is not implemented.");
      },
    },
    weatherProvider: new MockWeatherProvider(),
  };
}
