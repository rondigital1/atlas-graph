import {
  DevelopmentPlannerModel,
  PlannerChain,
  TravelPlanningService,
  createMockTravelPlanningDeps,
} from "@atlas-graph/agent";

export function createTravelPlanningService(): TravelPlanningService {
  const deps = createMockTravelPlanningDeps();

  deps.plannerRunner = new PlannerChain({
    model: new DevelopmentPlannerModel(),
  });

  return new TravelPlanningService(deps);
}
