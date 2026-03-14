import type { TripRequest } from "@atlas-graph/core/types";

export const FORECAST_LOOKAHEAD_DAYS = 13;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export interface ForecastOverlap {
  overlappingDates: string[];
  requestDays: number;
}

export function buildForecastOverlap(
  input: TripRequest,
  now: Date
): ForecastOverlap | undefined {
  const today = formatDateOnly(now);
  const forecastWindowEnd = addDays(today, FORECAST_LOOKAHEAD_DAYS);
  const overlapStart = input.startDate > today ? input.startDate : today;
  const overlapEnd =
    input.endDate < forecastWindowEnd ? input.endDate : forecastWindowEnd;

  if (overlapStart > overlapEnd) {
    return undefined;
  }

  return {
    overlappingDates: listDateRange(overlapStart, overlapEnd),
    requestDays: differenceInDays(today, overlapEnd) + 1,
  };
}

function formatDateOnly(input: Date): string {
  return input.toISOString().slice(0, 10);
}

function addDays(date: string, days: number): string {
  const parsedDate = parseDateOnly(date);

  return new Date(parsedDate.getTime() + days * MILLISECONDS_PER_DAY)
    .toISOString()
    .slice(0, 10);
}

function differenceInDays(startDate: string, endDate: string): number {
  return Math.round(
    (parseDateOnly(endDate).getTime() - parseDateOnly(startDate).getTime()) /
      MILLISECONDS_PER_DAY
  );
}

function listDateRange(startDate: string, endDate: string): string[] {
  const totalDays = differenceInDays(startDate, endDate);
  const dateRange: string[] = [];

  for (let index = 0; index <= totalDays; index += 1) {
    dateRange.push(addDays(startDate, index));
  }

  return dateRange;
}

function parseDateOnly(input: string): Date {
  return new Date(`${input}T00:00:00.000Z`);
}
