import { z } from "zod";

import { TripPlanSchema } from "./trip-plan";
import { TripRequestSchema } from "./trip-request";

type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

const JsonPrimitiveSchema = z.union([
  z.string(),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);

export const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() => {
  return z.union([
    JsonPrimitiveSchema,
    z.array(JsonValueSchema),
    z.record(z.string(), JsonValueSchema),
  ]);
});

export const PlanningRunStatusSchema = z.enum([
  "running",
  "succeeded",
  "failed",
  "partial",
]);

export const PlanningRunOutputSummarySchema = z.object({
  destinationSummary: z.string(),
  tripStyleSummary: z.string(),
  dayCount: z.number().int().nonnegative(),
  topRecommendationCount: z.number().int().nonnegative(),
  warningCount: z.number().int().nonnegative(),
});

export const PlanningRunSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1).nullable(),
  sessionId: z.string().min(1).nullable(),
  requestId: z.string().min(1),
  status: PlanningRunStatusSchema,
  inputSnapshot: TripRequestSchema,
  normalizedInput: TripRequestSchema,
  plannerProvider: z.string().min(1),
  plannerModel: z.string().min(1),
  plannerVersion: z.string().min(1),
  outputPlan: TripPlanSchema.nullable(),
  outputSummary: PlanningRunOutputSummarySchema.nullable(),
  errorCode: z.string().min(1).nullable(),
  errorMessage: z.string().min(1).nullable(),
  errorDetails: JsonValueSchema.nullable(),
  startedAt: z.date(),
  completedAt: z.date().nullable(),
  durationMs: z.number().int().nonnegative().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PlanningRunStatus = z.infer<typeof PlanningRunStatusSchema>;
export type PlanningRunOutputSummary = z.infer<
  typeof PlanningRunOutputSummarySchema
>;
export type PlanningRun = z.infer<typeof PlanningRunSchema>;
