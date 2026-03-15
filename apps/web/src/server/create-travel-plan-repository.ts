import {
  travelPlanRepository,
  type TravelPlanRepository,
} from "@atlas-graph/db";

export function createTravelPlanRepository(): TravelPlanRepository {
  return travelPlanRepository;
}
