import type {
  PlanningRunDetail,
  PlanningRunSummary,
} from "../planning-run-query-service";

export interface PlanningRunListSuccessResponse {
  data: PlanningRunSummary[];
}

export interface PlanningRunDetailSuccessResponse {
  data: PlanningRunDetail;
}

export interface PlanningRunErrorShape {
  code: "NOT_FOUND" | "INTERNAL_ERROR";
  message: string;
}

export interface PlanningRunErrorResponse {
  error: PlanningRunErrorShape;
}

export function createPlanningRunListSuccessResponse(
  runs: PlanningRunSummary[]
): PlanningRunListSuccessResponse {
  return {
    data: runs,
  };
}

export function createPlanningRunDetailSuccessResponse(
  detail: PlanningRunDetail
): PlanningRunDetailSuccessResponse {
  return {
    data: detail,
  };
}

export function createPlanningRunNotFoundResponse(): PlanningRunErrorResponse {
  return {
    error: {
      code: "NOT_FOUND",
      message: "Planning run not found",
    },
  };
}

export function createPlanningRunListInternalErrorResponse(): PlanningRunErrorResponse {
  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "Failed to load planning runs",
    },
  };
}

export function createPlanningRunDetailInternalErrorResponse(): PlanningRunErrorResponse {
  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "Failed to load planning run",
    },
  };
}
