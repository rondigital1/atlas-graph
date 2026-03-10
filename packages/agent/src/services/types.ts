import type { PlannerRunner } from "../planner/planner-types";
import type {
  DestinationInfoProvider,
  PlacesProvider,
  WeatherProvider,
} from "./interfaces";
import type {
  DestinationSummary,
  PlanningContext,
  PlaceCandidate,
  TripPlan,
  TripRequest,
  WeatherSummary,
} from "@atlas-graph/core";

export interface TravelPlanningServiceDeps {
  destinationInfoProvider: DestinationInfoProvider;
  placesProvider: PlacesProvider;
  plannerRunner: PlannerRunner;
  weatherProvider: WeatherProvider;
}

export interface BuildPlanningContextResult {
  request: TripRequest;
  destinationSummary?: DestinationSummary;
  weatherSummary?: WeatherSummary;
  placeCandidates: PlaceCandidate[];
}

export interface GeneratePlanResult {
  plan: TripPlan | null;
  context: PlanningContext | null;
}
