import { PlanningContextSchema } from "@atlas-graph/core/schemas";
import type {
  DestinationSummary,
  PlaceCandidate,
  PlaceCategory,
  PlanningContext,
  WeatherSummary,
} from "@atlas-graph/core/types";

const CATEGORY_ORDER: PlaceCategory[] = [
  "attraction",
  "activity",
  "restaurant",
  "hotel",
];

const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  attraction: "Attractions",
  activity: "Activities",
  restaurant: "Restaurants",
  hotel: "Hotels",
};

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function parseUtcDateString(value: string): Date {
  const [yearPart, monthPart, dayPart] = value.split("-");

  if (!yearPart || !monthPart || !dayPart) {
    throw new Error(`Expected a YYYY-MM-DD date string but received "${value}".`);
  }

  return new Date(
    Date.UTC(Number(yearPart), Number(monthPart) - 1, Number(dayPart))
  );
}

function formatDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const endDateValue = parseUtcDateString(endDate).getTime();
  let cursor = parseUtcDateString(startDate).getTime();

  while (cursor <= endDateValue) {
    dates.push(new Date(cursor).toISOString().slice(0, 10));
    cursor += MILLISECONDS_PER_DAY;
  }

  return dates;
}

function formatStringList(values: readonly string[]): string {
  if (values.length === 0) {
    return "none";
  }

  return values.join("; ");
}

function renderDestinationSummary(
  destinationSummary: DestinationSummary | undefined
): string[] {
  if (!destinationSummary) {
    return ["- No destination summary was provided."];
  }

  const lines = [
    `- destination: ${destinationSummary.destination}`,
    `- summary: ${destinationSummary.summary}`,
  ];

  if (destinationSummary.country) {
    lines.push(`- country: ${destinationSummary.country}`);
  }

  if (destinationSummary.bestAreas.length > 0) {
    lines.push(`- bestAreas: ${formatStringList(destinationSummary.bestAreas)}`);
  }

  if (destinationSummary.notes.length > 0) {
    lines.push(`- notes: ${formatStringList(destinationSummary.notes)}`);
  }

  return lines;
}

function renderWeatherSummary(weatherSummary: WeatherSummary | undefined): string[] {
  if (!weatherSummary) {
    return ["- No weather summary was provided."];
  }

  const lines = [
    `- destination: ${weatherSummary.destination}`,
    `- summary: ${weatherSummary.summary}`,
  ];

  if (
    weatherSummary.averageHighC !== undefined &&
    weatherSummary.averageLowC !== undefined
  ) {
    lines.push(
      `- temperaturesC: high ${weatherSummary.averageHighC}, low ${weatherSummary.averageLowC}`
    );
  }

  if (weatherSummary.dailyNotes.length > 0) {
    lines.push(`- dailyNotes: ${formatStringList(weatherSummary.dailyNotes)}`);
  }

  return lines;
}

function renderPlaceCandidate(candidate: PlaceCandidate): string {
  const parts = [
    `id: ${candidate.id}`,
    `name: ${candidate.name}`,
    `category: ${candidate.category}`,
  ];

  if (candidate.summary) {
    parts.push(`summary: ${candidate.summary}`);
  }

  if (candidate.rating !== undefined) {
    parts.push(`rating: ${candidate.rating}`);
  }

  if (candidate.priceLevel !== undefined) {
    parts.push(`priceLevel: ${candidate.priceLevel}`);
  }

  if (candidate.address) {
    parts.push(`address: ${candidate.address}`);
  }

  return `- ${parts.join(" | ")}`;
}

export function renderPlannerPlaceCandidates(
  placeCandidates: readonly PlaceCandidate[]
): string {
  if (placeCandidates.length === 0) {
    return "- No named place candidates were provided.";
  }

  const lines: string[] = [];

  for (const category of CATEGORY_ORDER) {
    const candidatesInCategory = placeCandidates.filter((candidate) => {
      return candidate.category === category;
    });

    if (candidatesInCategory.length === 0) {
      continue;
    }

    lines.push(`Category: ${CATEGORY_LABELS[category]}`);

    for (const candidate of candidatesInCategory) {
      lines.push(renderPlaceCandidate(candidate));
    }
  }

  return lines.join("\n");
}

export function buildPlannerPromptInput(context: PlanningContext): string {
  const parsedContext = PlanningContextSchema.parse(context);
  const { request } = parsedContext;
  const tripDates = formatDateRange(request.startDate, request.endDate);

  return [
    "Use only the planning context below to build the trip plan.",
    "",
    "User request",
    `- destination: ${request.destination}`,
    `- dates: ${request.startDate} to ${request.endDate}`,
    `- tripDateCount: ${tripDates.length}`,
    `- requiredDates: ${tripDates.join(", ")}`,
    `- budget: ${request.budget}`,
    `- travelStyle: ${request.travelStyle}`,
    `- groupType: ${request.groupType}`,
    `- interests: ${formatStringList(request.interests)}`,
    "",
    "Explicit constraints",
    "- Use only the provided normalized planning context.",
    "- Use exact placeId values when referring to supported places.",
    "- Do not invent named places when candidate coverage is weak; use generic activities instead.",
    "- Keep pacing realistic, weather-aware, and matched to the requested travelStyle.",
    "- Respect the requested budget in tone and recommendations.",
    "- Return strict JSON only. No markdown, no code fences, no extra commentary.",
    "- Keep empty arrays as [] and never use null for optional collections.",
    "",
    "Destination summary",
    ...renderDestinationSummary(parsedContext.destinationSummary),
    "",
    "Weather summary",
    ...renderWeatherSummary(parsedContext.weatherSummary),
    "",
    "Place candidates",
    renderPlannerPlaceCandidates(parsedContext.placeCandidates),
  ].join("\n");
}
