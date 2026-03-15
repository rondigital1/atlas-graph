import {
  PlanStatusSchema,
  TripRequestSchema,
  type PlanStatus,
  type TripRequest,
} from "@atlas-graph/core";
import type {
  CreateTravelPlanInput,
  ListTravelPlansOptions,
  PersistedTravelPlan,
  UpdateTravelPlanInput,
} from "@atlas-graph/db";
import { z } from "zod";

const NonEmptyStringSchema = z.string().trim().min(1);

const ListPlansQuerySchema = z.object({
  take: z.coerce.number().int().positive().max(100).optional(),
  userId: NonEmptyStringSchema.optional(),
});

const CreateTravelPlanBodySchema = z
  .object({
    input: TripRequestSchema,
    status: PlanStatusSchema.optional(),
    userId: NonEmptyStringSchema,
  })
  .strict();

const UpdateTravelPlanBodySchema = z
  .object({
    input: TripRequestSchema.optional(),
    status: PlanStatusSchema.optional(),
    userId: NonEmptyStringSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.input === undefined &&
      value.status === undefined &&
      value.userId === undefined
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one field must be provided",
        path: ["body"],
      });
    }
  });

const PlanRouteParamsSchema = z.object({
  planId: NonEmptyStringSchema,
});

export const LEGACY_MVP_USER_ID = "legacy-mvp-user";

export interface TravelPlanApiRecord {
  createdAt: string;
  id: string;
  input: TripRequest;
  status: PlanStatus;
  updatedAt: string;
  userId: string;
}

export interface TravelPlanSuccessResponse {
  data: TravelPlanApiRecord;
}

export interface TravelPlanListSuccessResponse {
  data: TravelPlanApiRecord[];
}

export interface TravelPlanErrorShape {
  code: "CONFLICT" | "INVALID_REQUEST" | "INTERNAL_ERROR" | "NOT_FOUND";
  details?: unknown;
  message: string;
}

export interface TravelPlanErrorResponse {
  error: TravelPlanErrorShape;
}

type ParseResult<T> =
  | {
      data: T;
      success: true;
    }
  | {
      error: z.ZodError;
      success: false;
    };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isResourceCreateBody(value: unknown): value is Record<string, unknown> {
  return (
    isPlainObject(value) &&
    ("input" in value || "status" in value || "userId" in value)
  );
}

function isResourcePatchBody(value: unknown): value is Record<string, unknown> {
  return (
    isPlainObject(value) &&
    ("input" in value || "status" in value || "userId" in value)
  );
}

export function createTravelPlanSuccessResponse(
  plan: PersistedTravelPlan
): TravelPlanSuccessResponse {
  return {
    data: serializeTravelPlan(plan),
  };
}

export function createTravelPlanListSuccessResponse(
  plans: PersistedTravelPlan[]
): TravelPlanListSuccessResponse {
  return {
    data: plans.map((plan) => serializeTravelPlan(plan)),
  };
}

export function createInvalidTravelPlanRequestResponse(
  details: unknown
): TravelPlanErrorResponse {
  return {
    error: {
      code: "INVALID_REQUEST",
      details,
      message: "Request validation failed",
    },
  };
}

export function createTravelPlanNotFoundResponse(): TravelPlanErrorResponse {
  return {
    error: {
      code: "NOT_FOUND",
      message: "Plan not found",
    },
  };
}

export function createTravelPlanDeleteConflictResponse(): TravelPlanErrorResponse {
  return {
    error: {
      code: "CONFLICT",
      message: "Plan cannot be deleted once generation or itinerary records exist",
    },
  };
}

export function createTravelPlanListInternalErrorResponse(): TravelPlanErrorResponse {
  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "Failed to load plans",
    },
  };
}

export function createTravelPlanCreateInternalErrorResponse(): TravelPlanErrorResponse {
  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "Failed to create plan",
    },
  };
}

export function createTravelPlanDetailInternalErrorResponse(): TravelPlanErrorResponse {
  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "Failed to load plan",
    },
  };
}

export function createTravelPlanUpdateInternalErrorResponse(): TravelPlanErrorResponse {
  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "Failed to update plan",
    },
  };
}

export function createTravelPlanDeleteInternalErrorResponse(): TravelPlanErrorResponse {
  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "Failed to delete plan",
    },
  };
}

export function createMalformedJsonBodyDetails(): {
  body: string[];
} {
  return {
    body: ["Malformed JSON body."],
  };
}

export function formatValidationDetails(error: z.ZodError): unknown {
  return error.flatten();
}

export function parsePlanRouteParams(params: {
  planId: string;
}): ParseResult<{
  planId: string;
}> {
  return PlanRouteParamsSchema.safeParse(params);
}

export function parseListPlansQuery(
  requestUrl: string
): ParseResult<ListTravelPlansOptions> {
  const url = new URL(requestUrl);
  const query: Record<string, string> = {};
  const userId = url.searchParams.get("userId");
  const take = url.searchParams.get("take");

  if (userId !== null) {
    query["userId"] = userId;
  }

  if (take !== null) {
    query["take"] = take;
  }

  return ListPlansQuerySchema.safeParse(query);
}

export function parseCreateTravelPlanBody(
  body: unknown
): ParseResult<CreateTravelPlanInput> {
  if (isResourceCreateBody(body)) {
    return CreateTravelPlanBodySchema.safeParse(body);
  }

  const parsedBody = TripRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return parsedBody;
  }

  return {
    data: {
      input: parsedBody.data,
      userId: LEGACY_MVP_USER_ID,
    },
    success: true,
  };
}

export function parseUpdateTravelPlanBody(
  body: unknown
): ParseResult<UpdateTravelPlanInput> {
  if (isResourcePatchBody(body)) {
    return UpdateTravelPlanBodySchema.safeParse(body);
  }

  const parsedBody = TripRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return parsedBody;
  }

  return {
    data: {
      input: parsedBody.data,
    },
    success: true,
  };
}

function serializeTravelPlan(plan: PersistedTravelPlan): TravelPlanApiRecord {
  return {
    createdAt: plan.createdAt.toISOString(),
    id: plan.id,
    input: plan.input,
    status: plan.status,
    updatedAt: plan.updatedAt.toISOString(),
    userId: plan.userId,
  };
}
