import { z } from "zod";

import {
  BudgetSchema,
  DateStringSchema,
  GroupTypeSchema,
  TravelStyleSchema,
  isValidDateString,
} from "./common";

export const TripRequestSchema = z
  .object({
    destination: z.string().min(2).max(120),
    startDate: DateStringSchema,
    endDate: DateStringSchema,
    budget: BudgetSchema,
    interests: z.array(z.string().min(1).max(50)).min(1).max(10),
    travelStyle: TravelStyleSchema,
    groupType: GroupTypeSchema,
  })
  .superRefine((value, context) => {
    if (
      isValidDateString(value.startDate) &&
      isValidDateString(value.endDate) &&
      value.endDate < value.startDate
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "endDate must be on or after startDate",
        path: ["endDate"],
      });
    }
  });

export type TripRequest = z.infer<typeof TripRequestSchema>;
