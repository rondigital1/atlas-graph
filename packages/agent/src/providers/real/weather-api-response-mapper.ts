import type { TripRequest, WeatherSummary } from "@atlas-graph/core/types";

import { cleanOptionalText, normalizeWeatherSummary } from "../../normalization";
import { asNumber } from "./type-parsing";
import type {
  WeatherApiForecastDayResponse,
  WeatherApiForecastResponse,
} from "./weather-api-client";

const MAX_DAILY_NOTES = 3;
const RAIN_CHANCE_THRESHOLD = 60;
const SNOW_CHANCE_THRESHOLD = 40;
const WIND_THRESHOLD_KPH = 35;
const UV_THRESHOLD = 7;
const PRECIP_THRESHOLD_MM = 5;

interface MappedForecastDay {
  date: string;
  conditionText?: string;
  maxTempC?: number;
  minTempC?: number;
  avgTempC?: number;
  maxWindKph?: number;
  totalPrecipMm?: number;
  uv?: number;
  willRain?: boolean;
  willSnow?: boolean;
  chanceOfRain?: number;
  chanceOfSnow?: number;
}

interface DayNote {
  text: string;
  score: number;
  date: string;
}

export function mapWeatherApiForecastToSummary(input: {
  request: TripRequest;
  response: WeatherApiForecastResponse;
  overlappingDates: readonly string[];
}): WeatherSummary | undefined {
  const overlappingDateSet = new Set(input.overlappingDates);
  const rawForecastDays = input.response.forecast?.forecastday;

  if (!Array.isArray(rawForecastDays) || overlappingDateSet.size === 0) {
    return undefined;
  }

  const mappedDays = rawForecastDays
    .map((forecastDay) => mapForecastDay(forecastDay))
    .filter(
      (forecastDay): forecastDay is MappedForecastDay =>
        forecastDay !== null && overlappingDateSet.has(forecastDay.date)
    );

  if (mappedDays.length === 0) {
    return undefined;
  }

  const destination =
    cleanOptionalText(input.response.location?.name) ??
    cleanOptionalText(input.request.destination) ??
    input.request.destination;
  const averageHighC = roundMean(mappedDays.map((day) => day.maxTempC));
  const averageLowC = roundMean(mappedDays.map((day) => day.minTempC));
  const averageTempC = roundMean(mappedDays.map((day) => day.avgTempC));
  const summary = buildWeatherSummaryText({
    forecastDays: mappedDays,
    averageHighC,
    averageLowC,
    averageTempC,
  });

  if (!summary) {
    return undefined;
  }

  return (
    normalizeWeatherSummary({
      destination,
      summary,
      dailyNotes: buildDailyNotes(mappedDays),
      ...(averageHighC !== undefined ? { averageHighC } : {}),
      ...(averageLowC !== undefined ? { averageLowC } : {}),
    }) ?? undefined
  );
}

function mapForecastDay(
  input: WeatherApiForecastDayResponse
): MappedForecastDay | null {
  const date = cleanOptionalText(input.date);
  const day = input.day;

  if (!date || typeof day !== "object" || day === null) {
    return null;
  }

  return {
    date,
    conditionText: cleanOptionalText(day.condition?.text),
    maxTempC: asNumber(day.maxtemp_c),
    minTempC: asNumber(day.mintemp_c),
    avgTempC: asNumber(day.avgtemp_c),
    maxWindKph: asNumber(day.maxwind_kph),
    totalPrecipMm: asNumber(day.totalprecip_mm),
    uv: asNumber(day.uv),
    willRain: parseBooleanFlag(day.daily_will_it_rain),
    willSnow: parseBooleanFlag(day.daily_will_it_snow),
    chanceOfRain: asNumber(day.daily_chance_of_rain),
    chanceOfSnow: asNumber(day.daily_chance_of_snow),
  };
}

function buildWeatherSummaryText(input: {
  forecastDays: readonly MappedForecastDay[];
  averageHighC?: number;
  averageLowC?: number;
  averageTempC?: number;
}): string | undefined {
  const dominantConditionText = resolveDominantConditionText(input.forecastDays);

  if (dominantConditionText) {
    if (
      input.averageHighC !== undefined &&
      input.averageLowC !== undefined
    ) {
      return `Expect ${dominantConditionText.toLowerCase()} conditions with average highs near ${input.averageHighC}C and lows near ${input.averageLowC}C.`;
    }

    if (input.averageHighC !== undefined) {
      return `Expect ${dominantConditionText.toLowerCase()} conditions with daytime temperatures near ${input.averageHighC}C.`;
    }

    if (input.averageLowC !== undefined) {
      return `Expect ${dominantConditionText.toLowerCase()} conditions with cooler periods near ${input.averageLowC}C.`;
    }

    if (input.averageTempC !== undefined) {
      return `Expect ${dominantConditionText.toLowerCase()} conditions with average temperatures near ${input.averageTempC}C.`;
    }

    return `Expect ${dominantConditionText.toLowerCase()} conditions during this trip.`;
  }

  if (input.averageHighC !== undefined && input.averageLowC !== undefined) {
    return `Expect average highs near ${input.averageHighC}C and lows near ${input.averageLowC}C.`;
  }

  if (input.averageHighC !== undefined) {
    return `Expect daytime temperatures near ${input.averageHighC}C.`;
  }

  if (input.averageLowC !== undefined) {
    return `Expect cooler periods near ${input.averageLowC}C.`;
  }

  if (input.averageTempC !== undefined) {
    return `Expect average temperatures near ${input.averageTempC}C.`;
  }

  return undefined;
}

function buildDailyNotes(input: readonly MappedForecastDay[]): string[] {
  return input
    .map((forecastDay) => buildDayNote(forecastDay))
    .filter((note): note is DayNote => note !== undefined)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.date.localeCompare(right.date);
    })
    .slice(0, MAX_DAILY_NOTES)
    .map((note) => note.text);
}

function buildDayNote(input: MappedForecastDay): DayNote | undefined {
  const dateLabel = formatForecastDate(input.date);
  const chanceOfSnow = input.chanceOfSnow ?? 0;
  const chanceOfRain = input.chanceOfRain ?? 0;
  const precipitation = input.totalPrecipMm ?? 0;
  const maxWind = input.maxWindKph ?? 0;
  const uv = input.uv ?? 0;

  if (input.willSnow || chanceOfSnow >= SNOW_CHANCE_THRESHOLD) {
    return {
      date: input.date,
      score: 90 + chanceOfSnow,
      text: `Snow or wintry conditions are possible around ${dateLabel}; keep transit and walking plans flexible.`,
    };
  }

  if (
    input.willRain ||
    chanceOfRain >= RAIN_CHANCE_THRESHOLD ||
    precipitation >= PRECIP_THRESHOLD_MM
  ) {
    return {
      date: input.date,
      score: 70 + Math.max(chanceOfRain, precipitation),
      text: `Rain is likely around ${dateLabel}; keep a rain layer and one indoor backup option handy.`,
    };
  }

  if (maxWind >= WIND_THRESHOLD_KPH) {
    return {
      date: input.date,
      score: 50 + maxWind,
      text: `Breezy conditions are possible around ${dateLabel}; prioritize sheltered outdoor time when possible.`,
    };
  }

  if (uv >= UV_THRESHOLD) {
    return {
      date: input.date,
      score: 30 + uv,
      text: `Strong sun exposure is likely around ${dateLabel}; sunscreen and shade breaks are worth planning.`,
    };
  }

  return undefined;
}

function resolveDominantConditionText(
  input: readonly MappedForecastDay[]
): string | undefined {
  const conditionCounts = new Map<
    string,
    {
      count: number;
      text: string;
    }
  >();

  for (const forecastDay of input) {
    const text = forecastDay.conditionText;

    if (!text) {
      continue;
    }

    const key = text.toLowerCase();
    const existingValue = conditionCounts.get(key);

    if (existingValue) {
      conditionCounts.set(key, {
        text: existingValue.text,
        count: existingValue.count + 1,
      });
      continue;
    }

    conditionCounts.set(key, {
      text,
      count: 1,
    });
  }

  let dominantCondition:
    | {
        count: number;
        text: string;
      }
    | undefined;

  for (const condition of conditionCounts.values()) {
    if (!dominantCondition || condition.count > dominantCondition.count) {
      dominantCondition = condition;
    }
  }

  return dominantCondition?.text;
}

function roundMean(input: readonly (number | undefined)[]): number | undefined {
  const values = input.filter((value): value is number => value !== undefined);

  if (values.length === 0) {
    return undefined;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function parseBooleanFlag(value: unknown): boolean | undefined {
  const parsedValue = asNumber(value);

  if (parsedValue === undefined) {
    return undefined;
  }

  return parsedValue === 1;
}

function formatForecastDate(input: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return input;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${input}T00:00:00Z`));
}
