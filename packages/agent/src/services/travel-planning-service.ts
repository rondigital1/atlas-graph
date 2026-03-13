import { PlanningContextSchema, TripRequestSchema } from "@atlas-graph/core/schemas";
import type { PlanningContext, TripPlan, TripRequest } from "@atlas-graph/core/types";
import { buildPlanningToolResults } from "./planning-tool-results";
import type { GeneratePlanResult, TravelPlanningServiceDeps } from "./types";
import { normalizeProviderResults } from "../normalization/provider-results-normalization";

export class TravelPlanningService {
  private readonly deps: TravelPlanningServiceDeps;

  public constructor(deps: TravelPlanningServiceDeps) {
    this.deps = deps;
  }

  public normalizeRequest(input: TripRequest): TripRequest {
    return TripRequestSchema.parse(structuredClone(input));
  }

  public async buildPlanningContext(input: TripRequest): Promise<PlanningContext> {
    return await this.buildPlanningContextFromValidatedRequest(
      this.normalizeRequest(input)
    );
  }

  public async generatePlan(input: TripRequest): Promise<TripPlan> {
    const result = await this.generatePlanResult(input);

    return result.plan;
  }

  public async generatePlanResult(input: TripRequest): Promise<GeneratePlanResult> {
    const context = await this.buildPlanningContext(input);
    const toolResults = buildPlanningToolResults(context);
    const plan = await this.deps.plannerRunner.run(context);

    return {
      plan,
      context,
      toolResults,
    };
  }

  private async buildPlanningContextFromValidatedRequest(
    validatedInput: TripRequest
  ): Promise<PlanningContext> {
    const [destinationSummary, weatherSummary, placeCandidates] =
      await Promise.all([
        this.deps.destinationInfoProvider.getDestinationSummary(validatedInput),
        this.deps.weatherProvider.getWeatherSummary(validatedInput),
        this.deps.placesProvider.searchPlaces(validatedInput).catch(() => []),
      ]);

    const normalizedResults = normalizeProviderResults({
      destinationSummary,
      weatherSummary,
      placeCandidates,
    });

    const context = {
      request: validatedInput,
      destinationSummary: normalizedResults.destinationSummary,
      weatherSummary: normalizedResults.weatherSummary,
      placeCandidates: normalizedResults.placeCandidates,
    };

    return PlanningContextSchema.parse(context);
  }
}
