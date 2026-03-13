import type { PlannerRunner } from "../planner/planner-types";
import type {
  DestinationInfoProvider,
  PlacesProvider,
  WeatherProvider,
} from "./interfaces";
import type { PlanningRunRepository } from "./planning-run-repository";
import type {
  DestinationSummary,
  JsonValue,
  PlanningContext,
  PlaceCandidate,
  ToolResult,
  TripPlan,
  TripRequest,
  WeatherSummary,
} from "@atlas-graph/core";

export interface PlannerMetadata {
  provider: string;
  model: string;
  version: string;
}

export interface PlanTripInput {
  request: TripRequest;
  userId?: string | null;
  sessionId?: string | null;
  requestId?: string | null;
}

export interface PlanTripResult {
  plan: TripPlan;
  runId: string;
}

export interface TravelPlanningServiceDeps {
  destinationInfoProvider: DestinationInfoProvider;
  placesProvider: PlacesProvider;
  plannerRunner: PlannerRunner;
  weatherProvider: WeatherProvider;
}

export interface PlanTripWorkflowServiceDeps {
  travelPlanningService: {
    generatePlanResult(input: TripRequest): Promise<GeneratePlanResult>;
    normalizeRequest(input: TripRequest): TripRequest;
  };
  planningRunRepository: PlanningRunRepository;
  idGenerator: () => string;
  now: () => Date;
  plannerMetadata: PlannerMetadata;
}

export interface PersistedPlanningRunError {
  code: string;
  message: string;
  details: JsonValue | null;
}

export interface BuildPlanningContextResult {
  request: TripRequest;
  destinationSummary?: DestinationSummary;
  weatherSummary?: WeatherSummary;
  placeCandidates: PlaceCandidate[];
}

export interface GeneratePlanResult {
  plan: TripPlan;
  context: PlanningContext;
  toolResults: ToolResult[];
}
