import { DestinationSummarySchema } from "@atlas-graph/core/schemas";
import type { DestinationSummary } from "@atlas-graph/core/types";

import { cleanOptionalText, cleanTextList } from "./text-cleaning";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  return value as Record<string, unknown>;
}

export function normalizeDestinationSummary(
  input: unknown
): DestinationSummary | null {
  const record = asRecord(input);

  if (!record) {
    return null;
  }

  const destination = cleanOptionalText(record["destination"]);
  const country = cleanOptionalText(record["country"]);
  const summary = cleanOptionalText(record["summary"] ?? record["description"]);

  if (!destination || !summary) {
    return null;
  }

  const parsedSummary = DestinationSummarySchema.safeParse({
    destination,
    summary,
    bestAreas: cleanTextList(record["bestAreas"]),
    notes: cleanTextList(record["notes"]),
    ...(country ? { country } : {}),
  });

  if (!parsedSummary.success) {
    return null;
  }

  return parsedSummary.data;
}
