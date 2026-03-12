import { z } from "zod";

import type {
  PlanStatus,
  TravelDraft,
  TravelPlan,
  TravelPlanInput,
} from "./types";
import { PLAN_STATUS_VALUES } from "./types";

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDateString(value: string): boolean {
  if (!isoDatePattern.test(value)) {
    return false;
  }

  const [yearPart, monthPart, dayPart] = value.split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);
  const day = Number(dayPart);

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return false;
  }

  const normalizedDate = new Date(Date.UTC(year, month - 1, day));

  if (Number.isNaN(normalizedDate.getTime())) {
    return false;
  }

  if (normalizedDate.getUTCFullYear() !== year) {
    return false;
  }

  if (normalizedDate.getUTCMonth() !== month - 1) {
    return false;
  }

  if (normalizedDate.getUTCDate() !== day) {
    return false;
  }

  return true;
}

const NonEmptyStringSchema = z.string().min(1);

const IsoDateStringSchema = z.string().refine(isValidIsoDateString, {
  message: "Expected a valid date string in YYYY-MM-DD format",
});

export const PlanStatusSchema =
  z.enum(PLAN_STATUS_VALUES) satisfies z.ZodType<PlanStatus>;

export const TravelPlanInputSchema = z
  .object({
    origin: NonEmptyStringSchema,
    destination: NonEmptyStringSchema,
    startDate: IsoDateStringSchema,
    endDate: IsoDateStringSchema,
    travelers: z.number().int().positive(),
    budgetUsd: z.number().finite().nonnegative().optional(),
    preferences: z.array(NonEmptyStringSchema).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      isValidIsoDateString(value.startDate) &&
      isValidIsoDateString(value.endDate) &&
      value.endDate < value.startDate
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "endDate must be on or after startDate",
        path: ["endDate"],
      });
    }
  }) satisfies z.ZodType<TravelPlanInput>;

const TravelDraftSchemaBase = z
  .object({
    id: NonEmptyStringSchema,
    userId: NonEmptyStringSchema,
    status: PlanStatusSchema,
    input: TravelPlanInputSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const TravelDraftSchema =
  TravelDraftSchemaBase satisfies z.ZodType<TravelDraft>;

export const TravelPlanSchema = TravelDraftSchemaBase.extend({
  currentVersionId: NonEmptyStringSchema.optional(),
}).strict() satisfies z.ZodType<TravelPlan>;
