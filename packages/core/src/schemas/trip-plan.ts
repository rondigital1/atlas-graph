import { z } from "zod";

import { DateStringSchema } from "./common";

export const ActivityItemSchema = z.object({
  title: z.string(),
  placeId: z.string().optional(),
  description: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const DayPlanSchema = z.object({
  dayNumber: z.number().int().positive(),
  date: DateStringSchema,
  theme: z.string(),
  morning: z.array(ActivityItemSchema).default([]),
  afternoon: z.array(ActivityItemSchema).default([]),
  evening: z.array(ActivityItemSchema).default([]),
});

export const PlaceReferenceSchema = z.object({
  placeId: z.string().optional(),
  name: z.string(),
  reason: z.string(),
});

export const TripPlanSchema = z.object({
  destinationSummary: z.string(),
  tripStyleSummary: z.string(),
  practicalNotes: z.array(z.string()).default([]),
  days: z.array(DayPlanSchema).min(1),
  topRecommendations: z.array(PlaceReferenceSchema).default([]),
  warnings: z.array(z.string()).default([]),
  rationale: z.string(),
});

export type ActivityItem = z.infer<typeof ActivityItemSchema>;
export type DayPlan = z.infer<typeof DayPlanSchema>;
export type PlaceReference = z.infer<typeof PlaceReferenceSchema>;
export type TripPlan = z.infer<typeof TripPlanSchema>;
