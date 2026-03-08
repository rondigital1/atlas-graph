import { PlaceCandidateSchema, PlaceCategorySchema } from "@atlas-graph/core/schemas";
import type { PlaceCandidate, PlaceCategory } from "@atlas-graph/core/types";

import {
  cleanOptionalText,
  normalizeComparisonText,
  slugifyText,
} from "./text-cleaning";

const PlaceCandidateListSchema = PlaceCandidateSchema.array();
const DEFAULT_PLACE_SOURCE = "normalized-provider";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  return value as Record<string, unknown>;
}

function parseOptionalNumber(value: unknown): number | undefined {
  if (typeof value === "number") {
    if (Number.isFinite(value)) {
      return value;
    }

    return undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return undefined;
  }

  const parsedValue = Number(trimmedValue);

  if (!Number.isFinite(parsedValue)) {
    return undefined;
  }

  return parsedValue;
}

function normalizeNumberInRange(
  value: unknown,
  minimum: number,
  maximum: number
): number | undefined {
  const parsedValue = parseOptionalNumber(value);

  if (parsedValue === undefined) {
    return undefined;
  }

  if (parsedValue < minimum || parsedValue > maximum) {
    return undefined;
  }

  return parsedValue;
}

function normalizeIntegerInRange(
  value: unknown,
  minimum: number,
  maximum: number
): number | undefined {
  const parsedValue = normalizeNumberInRange(value, minimum, maximum);

  if (parsedValue === undefined) {
    return undefined;
  }

  if (!Number.isInteger(parsedValue)) {
    return undefined;
  }

  return parsedValue;
}

function normalizePlaceCategory(value: unknown): PlaceCategory | null {
  const normalizedValue = normalizeComparisonText(value);

  if (!normalizedValue) {
    return null;
  }

  const parsedCategory = PlaceCategorySchema.safeParse(normalizedValue);

  if (parsedCategory.success) {
    return parsedCategory.data;
  }

  const aliasMap: Record<string, PlaceCategory> = {
    attraction: "attraction",
    attractions: "attraction",
    activity: "activity",
    activities: "activity",
    restaurant: "restaurant",
    restaurants: "restaurant",
    food: "restaurant",
    hotel: "hotel",
    hotels: "hotel",
    lodging: "hotel",
    accommodation: "hotel",
  };

  return aliasMap[normalizedValue] ?? null;
}

function buildGeneratedPlaceId(
  name: string,
  category: PlaceCategory,
  address?: string
): string {
  const slugParts = [slugifyText(name), slugifyText(address), category].filter(
    (part): part is string => part !== undefined
  );

  return slugParts.join("-");
}

function buildCandidateComparisonSignature(candidate: PlaceCandidate): string {
  return [
    normalizeComparisonText(candidate.id) ?? "",
    buildPlaceDedupKey(candidate),
    normalizeComparisonText(candidate.address) ?? "",
    normalizeComparisonText(candidate.summary) ?? "",
    candidate.rating?.toString() ?? "",
    candidate.priceLevel?.toString() ?? "",
    candidate.lat?.toString() ?? "",
    candidate.lng?.toString() ?? "",
    normalizeComparisonText(candidate.source) ?? "",
  ].join("|");
}

function isDuplicatePlaceCandidate(
  leftCandidate: PlaceCandidate,
  rightCandidate: PlaceCandidate
): boolean {
  const leftId = normalizeComparisonText(leftCandidate.id);
  const rightId = normalizeComparisonText(rightCandidate.id);

  if (leftId && rightId && leftId === rightId) {
    return true;
  }

  return buildPlaceDedupKey(leftCandidate) === buildPlaceDedupKey(rightCandidate);
}

function choosePreferredPlaceCandidate(
  leftCandidate: PlaceCandidate,
  rightCandidate: PlaceCandidate
): PlaceCandidate {
  const leftScore = scorePlaceCandidateCompleteness(leftCandidate);
  const rightScore = scorePlaceCandidateCompleteness(rightCandidate);

  if (leftScore !== rightScore) {
    if (leftScore > rightScore) {
      return leftCandidate;
    }

    return rightCandidate;
  }

  const leftSignature = buildCandidateComparisonSignature(leftCandidate);
  const rightSignature = buildCandidateComparisonSignature(rightCandidate);

  if (leftSignature <= rightSignature) {
    return leftCandidate;
  }

  return rightCandidate;
}

export function normalizePlaceCandidate(input: unknown): PlaceCandidate | null {
  const record = asRecord(input);

  if (!record) {
    return null;
  }

  const name = cleanOptionalText(record["name"]);

  if (!name) {
    return null;
  }

  const category = normalizePlaceCategory(record["category"] ?? record["type"]);

  if (!category) {
    return null;
  }

  const address = cleanOptionalText(record["address"]);
  const summary = cleanOptionalText(record["summary"] ?? record["description"]);
  const source = cleanOptionalText(record["source"]) ?? DEFAULT_PLACE_SOURCE;
  const rating = normalizeNumberInRange(record["rating"], 0, 5);
  const priceLevel = normalizeIntegerInRange(
    record["priceLevel"] ?? record["price_level"],
    1,
    4
  );
  const lat = normalizeNumberInRange(record["lat"] ?? record["latitude"], -90, 90);
  const lng = normalizeNumberInRange(record["lng"] ?? record["longitude"], -180, 180);
  const id =
    cleanOptionalText(record["id"]) ?? buildGeneratedPlaceId(name, category, address);

  const parsedCandidate = PlaceCandidateSchema.safeParse({
    id,
    name,
    category,
    source,
    ...(address ? { address } : {}),
    ...(summary ? { summary } : {}),
    ...(rating !== undefined ? { rating } : {}),
    ...(priceLevel !== undefined ? { priceLevel } : {}),
    ...(lat !== undefined ? { lat } : {}),
    ...(lng !== undefined ? { lng } : {}),
  });

  if (!parsedCandidate.success) {
    return null;
  }

  return parsedCandidate.data;
}

export function normalizePlaceCandidates(
  input: readonly unknown[] | null | undefined
): PlaceCandidate[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const normalizedCandidates = input
    .map((candidate) => normalizePlaceCandidate(candidate))
    .filter((candidate): candidate is PlaceCandidate => candidate !== null);

  const parsedCandidates = PlaceCandidateListSchema.safeParse(normalizedCandidates);

  if (!parsedCandidates.success) {
    return normalizedCandidates.filter((candidate): candidate is PlaceCandidate => {
      return PlaceCandidateSchema.safeParse(candidate).success;
    });
  }

  return parsedCandidates.data;
}

export function buildPlaceDedupKey(candidate: PlaceCandidate): string {
  return `${normalizeComparisonText(candidate.name) ?? ""}|${candidate.category}`;
}

export function scorePlaceCandidateCompleteness(candidate: PlaceCandidate): number {
  let score = 0;

  if (candidate.address) {
    score += 2;
  }

  if (candidate.summary) {
    score += 2;
  }

  if (candidate.rating !== undefined) {
    score += 1;
  }

  if (candidate.priceLevel !== undefined) {
    score += 1;
  }

  if (candidate.lat !== undefined) {
    score += 1;
  }

  if (candidate.lng !== undefined) {
    score += 1;
  }

  return score;
}

export function deduplicatePlaceCandidates(
  candidates: readonly PlaceCandidate[]
): PlaceCandidate[] {
  const deduplicatedCandidates: PlaceCandidate[] = [];

  for (const candidate of candidates) {
    const validCandidate = normalizePlaceCandidate(candidate);

    if (!validCandidate) {
      continue;
    }
    const existingCandidateIndex = deduplicatedCandidates.findIndex(
      (existingCandidate) => {
        return isDuplicatePlaceCandidate(existingCandidate, validCandidate);
      }
    );

    if (existingCandidateIndex === -1) {
      deduplicatedCandidates.push(validCandidate);
      continue;
    }

    const existingCandidate = deduplicatedCandidates[existingCandidateIndex];

    if (!existingCandidate) {
      deduplicatedCandidates.push(validCandidate);
      continue;
    }

    deduplicatedCandidates[existingCandidateIndex] = choosePreferredPlaceCandidate(
      existingCandidate,
      validCandidate
    );
  }

  const parsedCandidates = PlaceCandidateListSchema.safeParse(deduplicatedCandidates);

  if (!parsedCandidates.success) {
    return deduplicatedCandidates.filter((candidate): candidate is PlaceCandidate => {
      return PlaceCandidateSchema.safeParse(candidate).success;
    });
  }

  return parsedCandidates.data;
}

export function normalizeAndDeduplicatePlaceCandidates(
  input: readonly unknown[] | null | undefined
): PlaceCandidate[] {
  return deduplicatePlaceCandidates(normalizePlaceCandidates(input));
}
