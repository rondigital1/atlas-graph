import { itineraryVersionRepository } from "@atlas-graph/db";

import { createTravelPlanRepository } from "./create-travel-plan-repository";
import {
  DefaultTravelPlanVersionQueryService,
  type TravelPlanVersionQueryService,
} from "./travel-plan-version-query-service";

export function createTravelPlanVersionQueryService(): TravelPlanVersionQueryService {
  return new DefaultTravelPlanVersionQueryService({
    itineraryVersionRepository,
    travelPlanRepository: createTravelPlanRepository(),
  });
}
