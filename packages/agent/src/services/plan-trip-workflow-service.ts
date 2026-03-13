import type { TripPlan } from "@atlas-graph/core/types";
import { buildPlanningRunOutputSummary } from "./planning-run-output-summary";
import { calculateDurationMs, normalizeOptionalString } from "./planning-run-utils";
import { mapPlanningRunError } from "./planning-run-error-mapper";
import type {
  PlanTripInput,
  PlanTripResult,
  PlanTripWorkflowServiceDeps,
} from "./types";

export class PlanTripWorkflowService {
  private readonly deps: PlanTripWorkflowServiceDeps;

  public constructor(deps: PlanTripWorkflowServiceDeps) {
    this.deps = deps;
  }

  public async planTrip(input: PlanTripInput): Promise<TripPlan> {
    const result = await this.planTripWithRun(input);

    return result.plan;
  }

  public async planTripWithRun(input: PlanTripInput): Promise<PlanTripResult> {
    const runId = this.deps.idGenerator();
    const startedAt = this.deps.now();
    const normalizedInput = this.deps.travelPlanningService.normalizeRequest(
      input.request
    );
    const inputSnapshot = structuredClone(normalizedInput);
    const requestId = normalizeOptionalString(input.requestId) ?? runId;

    await this.deps.planningRunRepository.createRun({
      id: runId,
      userId: normalizeOptionalString(input.userId),
      sessionId: normalizeOptionalString(input.sessionId),
      requestId,
      inputSnapshot,
      normalizedInput,
      plannerProvider: this.deps.plannerMetadata.provider,
      plannerModel: this.deps.plannerMetadata.model,
      plannerVersion: this.deps.plannerMetadata.version,
      startedAt,
      createdAt: startedAt,
    });

    try {
      const result = await this.deps.travelPlanningService.generatePlanResult(
        normalizedInput
      );
      const completedAt = this.deps.now();

      await this.deps.planningRunRepository.markSucceeded({
        id: runId,
        outputPlan: result.plan,
        outputSummary: buildPlanningRunOutputSummary(result.plan),
        toolResults: result.toolResults,
        completedAt,
        durationMs: calculateDurationMs(startedAt, completedAt),
      });

      return {
        plan: result.plan,
        runId,
      };
    } catch (error) {
      const completedAt = this.deps.now();
      const persistedError = mapPlanningRunError(error);

      await this.deps.planningRunRepository.markFailed({
        id: runId,
        errorCode: persistedError.code,
        errorMessage: persistedError.message,
        errorDetails: persistedError.details,
        completedAt,
        durationMs: calculateDurationMs(startedAt, completedAt),
      });

      throw error;
    }
  }
}
