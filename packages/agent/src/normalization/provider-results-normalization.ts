import type {
  DestinationSummary,
  PlaceCandidate,
  WeatherSummary,
} from "@atlas-graph/core/types";

import { normalizeDestinationSummary } from "./destination-normalization";
import { normalizeAndDeduplicatePlaceCandidates } from "./place-normalization";
import { normalizeWeatherSummary } from "./weather-normalization";

export interface ProviderNormalizationInput {
  destinationSummary?: unknown;
  weatherSummary?: unknown;
  placeCandidates?: readonly unknown[] | null;
}

export interface NormalizedProviderResults {
  destinationSummary?: DestinationSummary;
  weatherSummary?: WeatherSummary;
  placeCandidates: PlaceCandidate[];
}

export function normalizeProviderResults(
  input: ProviderNormalizationInput
): NormalizedProviderResults {
  return {
    destinationSummary:
      normalizeDestinationSummary(input.destinationSummary) ?? undefined,
    weatherSummary: normalizeWeatherSummary(input.weatherSummary) ?? undefined,
    placeCandidates: normalizeAndDeduplicatePlaceCandidates(input.placeCandidates),
  };
}
