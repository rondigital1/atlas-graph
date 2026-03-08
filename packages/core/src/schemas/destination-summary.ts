import { z } from "zod";

export const DestinationSummarySchema = z.object({
  destination: z.string(),
  country: z.string().optional(),
  summary: z.string(),
  bestAreas: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
});

export type DestinationSummary = z.infer<typeof DestinationSummarySchema>;
