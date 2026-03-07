import { z } from "zod";

export const placeholderIdentifierSchema = z.string().min(1);

export const coordinatePlaceholderSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
