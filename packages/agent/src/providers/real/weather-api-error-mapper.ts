import { cleanOptionalText } from "../../normalization";
import { asNumber, asRecord } from "./type-parsing";

export type WeatherApiErrorKind =
  | "auth"
  | "invalid-request"
  | "invalid-response"
  | "network"
  | "not-found"
  | "quota"
  | "resource"
  | "unavailable";

export class WeatherApiError extends Error {
  public readonly kind: WeatherApiErrorKind;
  public readonly status?: number;
  public readonly code?: number;

  public constructor(input: {
    kind: WeatherApiErrorKind;
    message: string;
    status?: number;
    code?: number;
  }) {
    super(input.message);

    this.name = "WeatherApiError";
    this.kind = input.kind;
    this.status = input.status;
    this.code = input.code;
  }
}

export function mapWeatherApiHttpError(input: {
  status: number;
  payload: unknown;
}): WeatherApiError {
  const payloadError = parseWeatherApiErrorPayload(input.payload);
  const kind = resolveWeatherApiErrorKind(input.status, payloadError.code);

  return new WeatherApiError({
    kind,
    status: input.status,
    code: payloadError.code,
    message:
      payloadError.message ??
      `WeatherAPI request failed with status ${input.status}.`,
  });
}

export function mapWeatherApiNetworkError(error: unknown): WeatherApiError {
  if (error instanceof WeatherApiError) {
    return error;
  }

  return new WeatherApiError({
    kind: "network",
    message:
      error instanceof Error
        ? error.message
        : "WeatherAPI request failed before a response was received.",
  });
}

export function createInvalidWeatherApiResponseError(
  message = "WeatherAPI returned an invalid response."
): WeatherApiError {
  return new WeatherApiError({
    kind: "invalid-response",
    message,
  });
}

function parseWeatherApiErrorPayload(payload: unknown): {
  code?: number;
  message?: string;
} {
  const payloadRecord = asRecord(payload);

  if (!payloadRecord) {
    return {};
  }

  const errorRecord = asRecord(payloadRecord["error"]);

  if (!errorRecord) {
    return {};
  }

  return {
    code: asNumber(errorRecord["code"]),
    message: cleanOptionalText(errorRecord["message"]),
  };
}

function resolveWeatherApiErrorKind(
  status: number,
  code: number | undefined
): WeatherApiErrorKind {
  if (code === 1006) {
    return "not-found";
  }

  if (code === 1002 || code === 2006 || status === 401) {
    return "auth";
  }

  if (code === 2007) {
    return "quota";
  }

  if (code === 2008 || code === 2009) {
    return "resource";
  }

  if (code === 9999 || status >= 500) {
    return "unavailable";
  }

  return "invalid-request";
}
