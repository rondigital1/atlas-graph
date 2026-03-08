import { z } from "zod";

import { PlaceCategorySchema } from "./common";

export const PlaceCandidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: PlaceCategorySchema,
  address: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  priceLevel: z.number().int().min(1).max(4).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  source: z.string(),
  summary: z.string().optional(),
});

export type PlaceCandidate = z.infer<typeof PlaceCandidateSchema>;
