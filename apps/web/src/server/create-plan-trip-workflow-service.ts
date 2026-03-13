import { randomUUID } from "node:crypto";

import { PlanTripWorkflowService } from "@atlas-graph/agent";
import { createPlannerMetadata } from "./create-planner-model";
import { createDatabasePlanningRunRepository } from "./database-planning-run-repository";
import { createTravelPlanningService } from "./create-travel-planning-service";

const planningRunRepository = createDatabasePlanningRunRepository();

export function createPlanTripWorkflowService(): PlanTripWorkflowService {
  return new PlanTripWorkflowService({
    travelPlanningService: createTravelPlanningService(),
    planningRunRepository,
    idGenerator() {
      return randomUUID();
    },
    now() {
      return new Date();
    },
    plannerMetadata: createPlannerMetadata(),
  });
}
