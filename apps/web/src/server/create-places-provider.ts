import { GooglePlacesProvider, MockPlacesProvider } from "@atlas-graph/agent";
import type { PlacesProvider } from "@atlas-graph/agent";

type PlacesProviderEnvironment = Record<string, string | undefined>;

export function createPlacesProvider(
  environment: PlacesProviderEnvironment = process.env
): PlacesProvider {
  const apiKey = cleanEnvironmentValue(environment["GOOGLE_MAPS_API_KEY"]);

  if (!apiKey) {
    return new MockPlacesProvider();
  }

  return new GooglePlacesProvider({ apiKey });
}

function cleanEnvironmentValue(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length === 0 ? undefined : trimmedValue;
}
