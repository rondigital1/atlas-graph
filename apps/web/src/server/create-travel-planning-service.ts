import { TravelPlanningService, createMockTravelPlanningDeps } from "@atlas-graph/agent";
import { createPlannerRunner } from "./create-planner-runner";
import { createDestinationInfoProvider } from "./create-destination-info-provider";

type TravelPlanningServiceEnvironment = Record<string, string | undefined>;

export function createTravelPlanningService(
  environment: TravelPlanningServiceEnvironment = process.env
): TravelPlanningService {
  const deps = createMockTravelPlanningDeps();

  deps.destinationInfoProvider = createDestinationInfoProvider(environment);
  deps.plannerRunner = createPlannerRunner(environment);

  return new TravelPlanningService(deps);
}
