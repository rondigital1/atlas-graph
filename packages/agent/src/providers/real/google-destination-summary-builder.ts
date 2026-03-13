import {
  cleanOptionalText,
  normalizeComparisonText,
} from "../../normalization/text-cleaning";
import type { ResolvedGoogleDestination } from "./google-geocoding-client";
import type { GooglePlaceSearchResult } from "./google-places-client";

export const AREA_QUERY_DEFINITIONS = [
  "neighborhoods in {destination}",
  "districts in {destination}",
  "city center in {destination}",
] as const;

export const LANDMARK_QUERY_DEFINITION = "top attractions in {destination}";

const MAX_BEST_AREAS = 5;
const MAX_LANDMARK_NAMES = 3;

const AREA_COMPONENT_TYPES = new Set([
  "neighborhood",
  "sublocality",
  "sublocality_level_1",
  "sublocality_level_2",
  "postal_town",
  "administrative_area_level_2",
  "administrative_area_level_3",
  "locality",
]);

export function buildBestAreas(
  destination: ResolvedGoogleDestination,
  places: readonly GooglePlaceSearchResult[]
): string[] {
  const seen = new Set<string>();
  const destinationKey = normalizeComparisonText(destination.destination);
  const countryKey = normalizeComparisonText(destination.country);
  const collectedAreas: string[] = [];

  for (const place of places) {
    const areaCandidates = [
      cleanOptionalText(place.displayName),
      ...place.addressComponents
        .filter((component) => {
          return component.types.some((type) => AREA_COMPONENT_TYPES.has(type));
        })
        .map((component) => cleanOptionalText(component.longText)),
    ]
      .filter((value): value is string => value !== undefined)
      .filter((value) => isSpecificAreaName(value, destinationKey, countryKey));

    for (const areaCandidate of areaCandidates) {
      const comparisonKey = normalizeComparisonText(areaCandidate);

      if (!comparisonKey || seen.has(comparisonKey)) {
        continue;
      }

      seen.add(comparisonKey);
      collectedAreas.push(areaCandidate);

      if (collectedAreas.length >= MAX_BEST_AREAS) {
        return collectedAreas;
      }
    }
  }

  return collectedAreas;
}

export function buildLandmarkNames(
  destination: ResolvedGoogleDestination,
  places: readonly GooglePlaceSearchResult[]
): string[] {
  const seen = new Set<string>();
  const destinationKey = normalizeComparisonText(destination.destination);
  const countryKey = normalizeComparisonText(destination.country);
  const landmarkNames: string[] = [];

  for (const place of places) {
    const cleanedName = cleanOptionalText(place.displayName);
    const comparisonKey = normalizeComparisonText(cleanedName);

    if (!cleanedName || !comparisonKey) {
      continue;
    }

    if (comparisonKey === destinationKey || comparisonKey === countryKey) {
      continue;
    }

    if (seen.has(comparisonKey)) {
      continue;
    }

    seen.add(comparisonKey);
    landmarkNames.push(cleanedName);

    if (landmarkNames.length >= MAX_LANDMARK_NAMES) {
      return landmarkNames;
    }
  }

  return landmarkNames;
}

export function buildSummary(
  destination: ResolvedGoogleDestination,
  bestAreas: readonly string[],
  landmarkNames: readonly string[]
): string {
  const destinationLabel = destination.country
    ? `${destination.destination}, ${destination.country}`
    : destination.destination;

  if (bestAreas.length > 0 && landmarkNames.length > 0) {
    return `${destinationLabel} has distinct visitor areas such as ${joinReadableList(
      bestAreas.slice(0, 2)
    )}, with high-signal anchors like ${joinReadableList(landmarkNames.slice(0, 2))}.`;
  }

  if (bestAreas.length > 0) {
    return `${destinationLabel} has distinct visitor areas such as ${joinReadableList(
      bestAreas.slice(0, 2)
    )}, which can anchor a stay and daily routing.`;
  }

  if (landmarkNames.length > 0) {
    return `${destinationLabel} has concentrated visitor activity around anchors like ${joinReadableList(
      landmarkNames.slice(0, 2)
    )}.`;
  }

  return `${destinationLabel} is a resolved travel destination with a practical central core and concentrated visitor activity.`;
}

export function buildNotes(
  bestAreas: readonly string[],
  landmarkNames: readonly string[]
): string[] {
  if (landmarkNames.length > 0) {
    return [
      `Nearby anchors include ${joinReadableList(landmarkNames)}.`,
      ...(bestAreas.length > 0
        ? [`Useful base areas include ${joinReadableList(bestAreas.slice(0, 3))}.`]
        : []),
    ];
  }

  if (bestAreas.length > 0) {
    return [`Useful base areas include ${joinReadableList(bestAreas.slice(0, 3))}.`];
  }

  return ["Places enrichment was sparse, so this summary uses canonical geocoding only."];
}

function isSpecificAreaName(
  value: string,
  destinationKey: string | undefined,
  countryKey: string | undefined
): boolean {
  const comparisonKey = normalizeComparisonText(value);

  if (!comparisonKey) {
    return false;
  }

  if (comparisonKey === destinationKey || comparisonKey === countryKey) {
    return false;
  }

  return comparisonKey.length > 2;
}

function joinReadableList(values: readonly string[]): string {
  if (values.length === 0) {
    return "";
  }

  if (values.length === 1) {
    return values[0]!;
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}
