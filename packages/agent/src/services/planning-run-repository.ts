import type {
  JsonValue,
  PlanningRun,
  PlanningRunOutputSummary,
  PlanningRunStatus,
  ToolResult,
  TripPlan,
  TripRequest,
} from "@atlas-graph/core/types";

export interface CreatePlanningRunInput {
  id: string;
  userId: string | null;
  sessionId: string | null;
  requestId: string;
  inputSnapshot: TripRequest;
  normalizedInput: TripRequest;
  plannerProvider: string;
  plannerModel: string;
  plannerVersion: string;
  startedAt: Date;
  createdAt: Date;
}

export interface MarkPlanningRunSucceededInput {
  id: string;
  outputPlan: TripPlan;
  outputSummary: PlanningRunOutputSummary;
  toolResults: ToolResult[];
  completedAt: Date;
  durationMs: number;
}

export interface MarkPlanningRunFailedInput {
  id: string;
  errorCode: string;
  errorMessage: string;
  errorDetails: JsonValue | null;
  completedAt: Date;
  durationMs: number;
}

export interface PlanningRunListOptions {
  userId?: string | null;
  sessionId?: string | null;
  requestId?: string;
  status?: PlanningRunStatus;
  limit?: number;
}

export interface PlanningRunRepository {
  createRun(input: CreatePlanningRunInput): Promise<PlanningRun>;
  markSucceeded(input: MarkPlanningRunSucceededInput): Promise<PlanningRun>;
  markFailed(input: MarkPlanningRunFailedInput): Promise<PlanningRun>;
  getRunById(id: string): Promise<PlanningRun | null>;
  listRuns(options?: PlanningRunListOptions): Promise<PlanningRun[]>;
}
