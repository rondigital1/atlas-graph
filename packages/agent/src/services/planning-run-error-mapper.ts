import type { PersistedPlanningRunError } from "./types";
import {
  PlannerModelResponseError,
  PlannerOutputParseError,
  PlannerOutputValidationError,
} from "../planner/errors";

export function mapPlanningRunError(error: unknown): PersistedPlanningRunError {
  if (error instanceof PlannerModelResponseError) {
    return {
      code: "PLANNER_MODEL_RESPONSE_ERROR",
      message: getErrorMessage(
        error,
        "Planner model returned an unusable response."
      ),
      details: {
        name: error.name,
        rawText: error.rawText ?? null,
        cause: buildErrorCauseDetails(error.cause),
      },
    };
  }

  if (error instanceof PlannerOutputParseError) {
    return {
      code: "PLANNER_OUTPUT_PARSE_ERROR",
      message: getErrorMessage(error, "Planner output could not be parsed."),
      details: {
        name: error.name,
        rawText: error.rawText,
        cause: buildErrorCauseDetails(error.cause),
      },
    };
  }

  if (error instanceof PlannerOutputValidationError) {
    return {
      code: "PLANNER_OUTPUT_VALIDATION_ERROR",
      message: getErrorMessage(error, "Planner output failed validation."),
      details: {
        name: error.name,
        rawText: error.rawText,
        validationErrorMessage: error.validationError.message,
        cause: buildErrorCauseDetails(error.cause),
      },
    };
  }

  if (error instanceof Error) {
    return {
      code: "UNEXPECTED_ERROR",
      message: getErrorMessage(
        error,
        "Trip planning failed with an unexpected error."
      ),
      details: {
        name: error.name,
        cause: buildErrorCauseDetails(error.cause),
      },
    };
  }

  return {
    code: "UNKNOWN_THROWN_VALUE",
    message: "Trip planning failed with a non-Error thrown value.",
    details: {
      thrownValue: describeThrownValue(error),
    },
  };
}

function buildErrorCauseDetails(
  cause: unknown
): { name: string; message: string } | null {
  if (!(cause instanceof Error)) {
    return null;
  }

  return {
    name: cause.name,
    message: cause.message,
  };
}

function describeThrownValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint" ||
    typeof value === "symbol"
  ) {
    return String(value);
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "undefined") {
    return "undefined";
  }

  if (typeof value === "function") {
    return "[function]";
  }

  return "[object]";
}

function getErrorMessage(error: Error, fallback: string): string {
  if (error.message.trim().length === 0) {
    return fallback;
  }

  return error.message;
}
