import {
  createInvalidWeatherApiResponseError,
  mapWeatherApiHttpError,
  mapWeatherApiNetworkError,
} from "./weather-api-error-mapper";

const WEATHERAPI_FORECAST_ENDPOINT =
  "https://api.weatherapi.com/v1/forecast.json";
const MAX_FORECAST_DAYS = 14;
const MIN_FORECAST_DAYS = 1;

export interface WeatherApiConditionResponse {
  text?: string;
  code?: number;
}

export interface WeatherApiDayResponse {
  maxtemp_c?: number;
  mintemp_c?: number;
  avgtemp_c?: number;
  maxwind_kph?: number;
  totalprecip_mm?: number;
  uv?: number;
  daily_will_it_rain?: number;
  daily_will_it_snow?: number;
  daily_chance_of_rain?: number;
  daily_chance_of_snow?: number;
  condition?: WeatherApiConditionResponse;
}

export interface WeatherApiForecastDayResponse {
  date?: string;
  day?: WeatherApiDayResponse;
}

export interface WeatherApiForecastResponse {
  location?: {
    name?: string;
  };
  forecast?: {
    forecastday?: WeatherApiForecastDayResponse[];
  };
}

export interface WeatherApiForecastInput {
  destination: string;
  days: number;
}

export interface WeatherApiClientOptions {
  apiKey: string;
  fetch?: typeof fetch;
}

export class WeatherApiClient {
  private readonly apiKey: string;
  private readonly fetchFn: typeof fetch;

  public constructor(input: WeatherApiClientOptions) {
    this.apiKey = input.apiKey;
    this.fetchFn = input.fetch ?? fetch;
  }

  public async fetchForecast(
    input: WeatherApiForecastInput
  ): Promise<WeatherApiForecastResponse> {
    const requestUrl = new URL(WEATHERAPI_FORECAST_ENDPOINT);

    requestUrl.searchParams.set("key", this.apiKey);
    requestUrl.searchParams.set("q", input.destination);
    requestUrl.searchParams.set("days", String(normalizeForecastDays(input.days)));

    let response: Response;

    try {
      response = await this.fetchFn(requestUrl);
    } catch (error) {
      throw mapWeatherApiNetworkError(error);
    }

    if (!response.ok) {
      let payload: unknown = null;

      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      throw mapWeatherApiHttpError({
        status: response.status,
        payload,
      });
    }

    let payload: unknown;

    try {
      payload = await response.json();
    } catch {
      throw createInvalidWeatherApiResponseError(
        "WeatherAPI returned invalid JSON."
      );
    }

    if (typeof payload !== "object" || payload === null) {
      throw createInvalidWeatherApiResponseError();
    }

    return payload as WeatherApiForecastResponse;
  }
}

function normalizeForecastDays(days: number): number {
  if (!Number.isFinite(days)) {
    return MIN_FORECAST_DAYS;
  }

  return Math.min(
    Math.max(Math.trunc(days), MIN_FORECAST_DAYS),
    MAX_FORECAST_DAYS
  );
}
