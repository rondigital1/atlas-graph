import { TravelPlanningService, createMockTravelPlanningDeps } from "@atlas-graph/agent";
import { createPlannerRunner } from "./create-planner-runner";
import { createDestinationInfoProvider } from "./create-destination-info-provider";
import { createPlacesProvider } from "./create-places-provider";
import { createWeatherProvider } from "./create-weather-provider";

type TravelPlanningServiceEnvironment = Record<string, string | undefined>;

export function createTravelPlanningService(
  environment: TravelPlanningServiceEnvironment = process.env
): TravelPlanningService {
  const deps = createMockTravelPlanningDeps();

  deps.destinationInfoProvider = createDestinationInfoProvider(environment);
  deps.placesProvider = createPlacesProvider(environment);
  deps.plannerRunner = createPlannerRunner(environment);
  deps.weatherProvider = createWeatherProvider(environment);

  return new TravelPlanningService(deps);
}
