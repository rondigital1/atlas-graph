
import { PlannerOutputParseError } from "./errors";

function stripCodeFences(value: string): string {
  const trimmed = value.trim();

  if (trimmed.startsWith("```")) {
    const lines = trimmed.split("\n");
    const withoutFirst = lines.slice(1);
    const maybeLast = withoutFirst[withoutFirst.length - 1];

    if (maybeLast?.trim().startsWith("```")) {
      withoutFirst.pop();
    }

    return withoutFirst.join("\n").trim();
  }

  return trimmed;
}

export function parseTripPlanFromModelText(text: string): unknown {
  const cleaned = stripCodeFences(text);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    throw new PlannerOutputParseError(
      "Planner output could not be parsed as JSON.",
      text,
      {
        cause: error,
      }
    );
  }
}
