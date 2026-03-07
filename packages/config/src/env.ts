import { z } from "zod";

// DATABASE_URL is required because Prisma and packages/db depend on it.
export const atlasEnvSchema = z
  .object({
    DATABASE_URL: z.string().min(1),
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
