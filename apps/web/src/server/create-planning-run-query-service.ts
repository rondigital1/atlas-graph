import { plannerRunRepository } from "@atlas-graph/db";

import {
  DefaultPlanningRunQueryService,
  type PlanningRunQueryService,
} from "./planning-run-query-service";

export function createPlanningRunQueryService(): PlanningRunQueryService {
  return new DefaultPlanningRunQueryService(plannerRunRepository);
}
