import {
  GoogleDestinationInfoProvider,
  MockDestinationInfoProvider,
} from "@atlas-graph/agent";
import type { DestinationInfoProvider } from "@atlas-graph/agent";

type DestinationInfoProviderEnvironment = Record<string, string | undefined>;

export function createDestinationInfoProvider(
  environment: DestinationInfoProviderEnvironment = process.env
): DestinationInfoProvider {
  const apiKey = cleanEnvironmentValue(environment["GOOGLE_MAPS_API_KEY"]);

  if (!apiKey) {
    return new MockDestinationInfoProvider();
  }

  return new GoogleDestinationInfoProvider({ apiKey });
}

function cleanEnvironmentValue(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length === 0 ? undefined : trimmedValue;
}
