import {
  PlanningContextSchema,
  TripRequestSchema,
} from "@atlas-graph/core/schemas";
import type {
  PlanningContext,
  TripPlan,
  TripRequest,
} from "@atlas-graph/core/types";
import type { TravelPlanningServiceDeps } from "./types";

export class TravelPlanningService {
  private readonly deps: TravelPlanningServiceDeps;

  public constructor(deps: TravelPlanningServiceDeps) {
    this.deps = deps;
  }

  public async buildPlanningContext(input: TripRequest): Promise<PlanningContext> {
    const validatedInput = TripRequestSchema.parse(input);

    const destinationSummary =
      await this.deps.destinationInfoProvider.getDestinationSummary(validatedInput);

    const weatherSummary =
      await this.deps.weatherProvider.getWeatherSummary(validatedInput);

    const placeCandidates =
      await this.deps.placesProvider.searchPlaces(validatedInput);

    const context = {
      request: validatedInput,
      destinationSummary,
      weatherSummary,
      placeCandidates,
    };

    return PlanningContextSchema.parse(context);
  }

  public async generatePlan(input: TripRequest): Promise<TripPlan> {
    const context = await this.buildPlanningContext(input);

    return await this.deps.plannerRunner.run(context);
  }
}