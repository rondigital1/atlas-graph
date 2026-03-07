import { z } from "zod";

// TODO: Tighten these to required values when runtime integrations are added.
export const atlasEnvSchema = z
  .object({
    DATABASE_URL: z.string().min(1).optional(),
    GOOGLE_MAPS_API_KEY: z.string().min(1).optional(),
    LANGSMITH_API_KEY: z.string().min(1).optional(),
    OPENAI_API_KEY: z.string().min(1).optional(),
    OPENWEATHER_API_KEY: z.string().min(1).optional(),
  })
  .strip();

export type AtlasEnv = z.infer<typeof atlasEnvSchema>;

export function parseAtlasEnv(
  environment: NodeJS.ProcessEnv = process.env,
): AtlasEnv {
  return atlasEnvSchema.parse(environment);
}
