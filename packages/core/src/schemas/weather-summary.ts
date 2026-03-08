import { z } from "zod";

export const WeatherSummarySchema = z.object({
  destination: z.string(),
  summary: z.string(),
  dailyNotes: z.array(z.string()).default([]),
  averageHighC: z.number().optional(),
  averageLowC: z.number().optional(),
});

export type WeatherSummary = z.infer<typeof WeatherSummarySchema>;
