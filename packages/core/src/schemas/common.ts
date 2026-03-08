import { z } from "zod";

const dateStringPattern = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateString(value: string): boolean {
  if (!dateStringPattern.test(value)) {
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

export const DateStringSchema = z.string().refine(isValidDateString, {
  message: "Expected a valid date string in YYYY-MM-DD format",
});

export const BudgetSchema = z.enum(["low", "medium", "high"]);

export const TravelStyleSchema = z.enum(["relaxed", "balanced", "packed"]);

export const GroupTypeSchema = z.enum(["solo", "couple", "friends", "family"]);

export const PlaceCategorySchema = z.enum([
  "attraction",
  "restaurant",
  "hotel",
  "activity",
]);

export const ToolExecutionStatusSchema = z.enum([
  "SUCCEEDED",
  "FAILED",
  "PARTIAL",
]);

export type Budget = z.infer<typeof BudgetSchema>;
export type TravelStyle = z.infer<typeof TravelStyleSchema>;
export type GroupType = z.infer<typeof GroupTypeSchema>;
export type PlaceCategory = z.infer<typeof PlaceCategorySchema>;
export type ToolExecutionStatus = z.infer<typeof ToolExecutionStatusSchema>;
