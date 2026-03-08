import { WeatherSummarySchema } from "@atlas-graph/core/schemas";
import type { WeatherSummary } from "@atlas-graph/core/types";

import { cleanOptionalText, cleanTextList } from "./text-cleaning";

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

export function normalizeWeatherSummary(input: unknown): WeatherSummary | null {
  const record = asRecord(input);

  if (!record) {
    return null;
  }

  const destination = cleanOptionalText(record["destination"]);
  const summary = cleanOptionalText(record["summary"] ?? record["description"]);
  const averageHighC = parseOptionalNumber(record["averageHighC"]);
  const averageLowC = parseOptionalNumber(record["averageLowC"]);

  if (!destination || !summary) {
    return null;
  }

  const parsedSummary = WeatherSummarySchema.safeParse({
    destination,
    summary,
    dailyNotes: cleanTextList(record["dailyNotes"]),
    ...(averageHighC !== undefined ? { averageHighC } : {}),
    ...(averageLowC !== undefined ? { averageLowC } : {}),
  });

  if (!parsedSummary.success) {
    return null;
  }

  return parsedSummary.data;
}
