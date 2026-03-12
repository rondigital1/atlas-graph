import { randomUUID } from "node:crypto";

import {
  InMemoryPlanningRunRepository,
  PlanTripWorkflowService,
} from "@atlas-graph/agent";
import { createPlannerMetadata } from "./create-planner-model";
import { createTravelPlanningService } from "./create-travel-planning-service";

const planningRunRepository = new InMemoryPlanningRunRepository();

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
