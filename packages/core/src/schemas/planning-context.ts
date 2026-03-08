import { z } from "zod";

import { DestinationSummarySchema } from "./destination-summary";
import { PlaceCandidateSchema } from "./place-candidate";
import { TripRequestSchema } from "./trip-request";
import { WeatherSummarySchema } from "./weather-summary";

export const PlanningContextSchema = z.object({
  request: TripRequestSchema,
  destinationSummary: DestinationSummarySchema.optional(),
  weatherSummary: WeatherSummarySchema.optional(),
  placeCandidates: z.array(PlaceCandidateSchema).default([]),
});

export type PlanningContext = z.infer<typeof PlanningContextSchema>;
