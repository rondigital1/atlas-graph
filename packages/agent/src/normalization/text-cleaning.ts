function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizePunctuationSpacing(value: string): string {
  return value.replace(/\s+([,.;!?])/g, "$1");
}

export function cleanOptionalText(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const cleanedValue = normalizePunctuationSpacing(collapseWhitespace(value));

  if (cleanedValue.length === 0) {
    return undefined;
  }

  return cleanedValue;
}

export function cleanText(value: unknown): string | undefined {
  return cleanOptionalText(value);
}

export function cleanTextList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => cleanOptionalText(item))
    .filter((item): item is string => item !== undefined);
}

export function normalizeComparisonText(value: unknown): string | undefined {
  const cleanedValue = cleanOptionalText(value);

  if (!cleanedValue) {
    return undefined;
  }

  return cleanedValue
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugifyText(value: unknown): string | undefined {
  const normalizedValue = normalizeComparisonText(value);

  if (!normalizedValue) {
    return undefined;
  }

  return normalizedValue.replace(/\s+/g, "-");
}
