import { atlasEnvSchema } from "@atlas-graph/config";
import { z } from "zod";

// TODO: Tighten required variables once the web app has runtime integrations.
export const webServerEnvSchema = atlasEnvSchema.pick({
  DATABASE_URL: true,
  GOOGLE_MAPS_API_KEY: true,
  LANGSMITH_API_KEY: true,
  OPENAI_API_KEY: true,
  OPENWEATHER_API_KEY: true,
});

export type WebServerEnv = z.infer<typeof webServerEnvSchema>;

export function getWebServerEnv(
  environment: NodeJS.ProcessEnv = process.env,
): WebServerEnv {
  return webServerEnvSchema.parse(environment);
}
