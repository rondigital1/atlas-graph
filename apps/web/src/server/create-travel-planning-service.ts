import {
  TravelPlanningService,
  createMockTravelPlanningDeps,
} from "@atlas-graph/agent";
import { createPlannerRunner } from "./create-planner-runner";

export function createTravelPlanningService(): TravelPlanningService {
  const deps = createMockTravelPlanningDeps();

  deps.plannerRunner = createPlannerRunner();

  return new TravelPlanningService(deps);
}
