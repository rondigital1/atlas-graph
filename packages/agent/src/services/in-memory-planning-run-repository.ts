import { PlanningRunSchema } from "@atlas-graph/core/schemas";
import type { PlanningRun } from "@atlas-graph/core/types";
import type {
  CreatePlanningRunInput,
  MarkPlanningRunFailedInput,
  MarkPlanningRunSucceededInput,
  PlanningRunListOptions,
  PlanningRunRepository,
} from "./planning-run-repository";

function clonePlanningRun(run: PlanningRun): PlanningRun {
  return PlanningRunSchema.parse(structuredClone(run));
}

function compareRunsNewestFirst(left: PlanningRun, right: PlanningRun): number {
  const createdAtDifference = right.createdAt.getTime() - left.createdAt.getTime();

  if (createdAtDifference !== 0) {
    return createdAtDifference;
  }

  const updatedAtDifference = right.updatedAt.getTime() - left.updatedAt.getTime();

  if (updatedAtDifference !== 0) {
    return updatedAtDifference;
  }

  return right.id.localeCompare(left.id);
}

export class InMemoryPlanningRunRepository implements PlanningRunRepository {
  private readonly runs = new Map<string, PlanningRun>();

  public async createRun(input: CreatePlanningRunInput): Promise<PlanningRun> {
    if (this.runs.has(input.id)) {
      throw new Error(`Planning run already exists: ${input.id}`);
    }

    const createdRun = PlanningRunSchema.parse({
      id: input.id,
      userId: input.userId,
      sessionId: input.sessionId,
      requestId: input.requestId,
      status: "running",
      inputSnapshot: input.inputSnapshot,
      normalizedInput: input.normalizedInput,
      plannerProvider: input.plannerProvider,
      plannerModel: input.plannerModel,
      plannerVersion: input.plannerVersion,
      outputPlan: null,
      outputSummary: null,
      errorCode: null,
      errorMessage: null,
      errorDetails: null,
      startedAt: input.startedAt,
      completedAt: null,
      durationMs: null,
      createdAt: input.createdAt,
      updatedAt: input.createdAt,
    });

    const storedRun = clonePlanningRun(createdRun);

    this.runs.set(storedRun.id, storedRun);

    return clonePlanningRun(storedRun);
  }

  public async markSucceeded(
    input: MarkPlanningRunSucceededInput
  ): Promise<PlanningRun> {
    const existingRun = this.getExistingRun(input.id);
    const updatedRun = PlanningRunSchema.parse({
      ...existingRun,
      status: "succeeded",
      outputPlan: input.outputPlan,
      outputSummary: input.outputSummary,
      errorCode: null,
      errorMessage: null,
      errorDetails: null,
      completedAt: input.completedAt,
      durationMs: input.durationMs,
      updatedAt: input.completedAt,
    });

    const storedRun = clonePlanningRun(updatedRun);

    this.runs.set(storedRun.id, storedRun);

    return clonePlanningRun(storedRun);
  }

  public async markFailed(input: MarkPlanningRunFailedInput): Promise<PlanningRun> {
    const existingRun = this.getExistingRun(input.id);
    const updatedRun = PlanningRunSchema.parse({
      ...existingRun,
      status: "failed",
      outputPlan: null,
      outputSummary: null,
      errorCode: input.errorCode,
      errorMessage: input.errorMessage,
      errorDetails: input.errorDetails,
      completedAt: input.completedAt,
      durationMs: input.durationMs,
      updatedAt: input.completedAt,
    });

    const storedRun = clonePlanningRun(updatedRun);

    this.runs.set(storedRun.id, storedRun);

    return clonePlanningRun(storedRun);
  }

  public async getRunById(id: string): Promise<PlanningRun | null> {
    const run = this.runs.get(id);

    if (!run) {
      return null;
    }

    return clonePlanningRun(run);
  }

  public async listRuns(
    options: PlanningRunListOptions = {}
  ): Promise<PlanningRun[]> {
    const runs = Array.from(this.runs.values())
      .filter((run) => {
        if (options.userId !== undefined && run.userId !== options.userId) {
          return false;
        }

        if (options.sessionId !== undefined && run.sessionId !== options.sessionId) {
          return false;
        }

        if (options.requestId !== undefined && run.requestId !== options.requestId) {
          return false;
        }

        if (options.status !== undefined && run.status !== options.status) {
          return false;
        }

        return true;
      })
      .sort(compareRunsNewestFirst);

    const limitedRuns =
      typeof options.limit === "number" ? runs.slice(0, options.limit) : runs;

    return limitedRuns.map((run) => {
      return clonePlanningRun(run);
    });
  }

  private getExistingRun(id: string): PlanningRun {
    const existingRun = this.runs.get(id);

    if (!existingRun) {
      throw new Error(`Planning run not found: ${id}`);
    }

    return clonePlanningRun(existingRun);
  }
}
