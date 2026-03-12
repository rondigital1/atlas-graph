import type { TripPlan } from "@atlas-graph/core/types";

export interface PlanTripSuccessResponse {
  data: TripPlan;
}

export interface PlanTripErrorShape {
  code: "INVALID_REQUEST" | "INTERNAL_ERROR";
  message: string;
  details?: unknown;
}

export interface PlanTripErrorResponse {
  error: PlanTripErrorShape;
}

export type PlanTripResponse = PlanTripSuccessResponse | PlanTripErrorResponse;

export function createPlanTripSuccessResponse(
  plan: TripPlan
): PlanTripSuccessResponse {
  return {
    data: plan,
  };
}

export function createInvalidRequestResponse(
  details: unknown
): PlanTripErrorResponse {
  return {
    error: {
      code: "INVALID_REQUEST",
      message: "Request validation failed",
      details,
    },
  };
}

export function createInternalErrorResponse(): PlanTripErrorResponse {
  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "Failed to generate trip plan",
    },
  };
}
