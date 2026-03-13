import { z } from "zod";

import { TripPlanSchema } from "../../schemas/trip-plan";
import { TravelPlanInputSchema } from "../plan";
import type {
  GenerationRun,
  GenerationRunStatus,
  ItineraryContent,
  ItineraryVersion,
} from "./types";
import { GENERATION_RUN_STATUS_VALUES } from "./types";

const NonEmptyStringSchema = z.string().min(1);

export const GenerationRunStatusSchema =
  z.enum(GENERATION_RUN_STATUS_VALUES) satisfies z.ZodType<GenerationRunStatus>;

export const ItineraryContentSchema =
  TripPlanSchema satisfies z.ZodType<ItineraryContent>;

export const ItineraryVersionSchema = z
  .object({
    id: NonEmptyStringSchema,
    planId: NonEmptyStringSchema,
    versionNumber: z.number().int().positive(),
    content: ItineraryContentSchema,
    generatedAt: z.date(),
    runId: NonEmptyStringSchema,
    isCurrent: z.boolean(),
  })
  .strict() satisfies z.ZodType<ItineraryVersion>;

export const GenerationRunSchema = z
  .object({
    id: NonEmptyStringSchema,
    planId: NonEmptyStringSchema,
    versionId: NonEmptyStringSchema.optional(),
    status: GenerationRunStatusSchema,
    inputSnapshot: TravelPlanInputSchema,
    providerData: z.unknown().optional(),
    durationMs: z.number().int().nonnegative(),
    error: NonEmptyStringSchema.optional(),
  })
  .strict() satisfies z.ZodType<GenerationRun>;
