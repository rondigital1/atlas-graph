import { TripPlanSchema } from "@atlas-graph/core/schemas";
import type { TripPlan } from "@atlas-graph/core/types";

import type { PlannerModel } from "./planner-types";

interface PlannerPromptPlaceCandidate {
  id: string;
  name: string;
  category: string;
  summary?: string;
}

function extractPromptValue(prompt: string, label: string): string | undefined {
  const expression = new RegExp(`^- ${label}: (.+)$`, "m");
  const match = prompt.match(expression);

  if (!match?.[1]) {
    return undefined;
  }

  return match[1].trim();
}

function extractRequiredDates(prompt: string): string[] {
  const requiredDates = extractPromptValue(prompt, "requiredDates");

  if (!requiredDates) {
    return [];
  }

  return requiredDates
    .split(",")
    .map((date) => date.trim())
    .filter((date) => date.length > 0);
}

function extractPlaceCandidates(prompt: string): PlannerPromptPlaceCandidate[] {
  const lines = prompt.split("\n");
  const candidates: PlannerPromptPlaceCandidate[] = [];
  let insidePlaceCandidateSection = false;

  for (const line of lines) {
    if (line === "Place candidates") {
      insidePlaceCandidateSection = true;
      continue;
    }

    if (!insidePlaceCandidateSection) {
      continue;
    }

    if (!line.startsWith("- id: ")) {
      continue;
    }

    const record: Record<string, string> = {};

    for (const part of line.slice(2).split(" | ")) {
      const separatorIndex = part.indexOf(":");

      if (separatorIndex === -1) {
        continue;
      }

      const key = part.slice(0, separatorIndex).trim();
      const value = part.slice(separatorIndex + 1).trim();

      if (key.length === 0 || value.length === 0) {
        continue;
      }

      record[key] = value;
    }

    const id = record["id"];
    const name = record["name"];
    const category = record["category"];

    if (!id || !name || !category) {
      continue;
    }

    candidates.push({
      id,
      name,
      category,
      summary: record["summary"],
    });
  }

  return candidates;
}

function buildBudgetLabel(budget: string): string {
  if (budget === "low") {
    return "budget-conscious";
  }

  if (budget === "high") {
    return "premium";
  }

  return "balanced";
}

function buildTravelStyleLabel(travelStyle: string): string {
  if (travelStyle === "relaxed") {
    return "slower-paced";
  }

  if (travelStyle === "packed") {
    return "high-energy";
  }

  return "balanced";
}

function buildDestinationSummaryText(
  destination: string,
  placeCandidates: readonly PlannerPromptPlaceCandidate[]
): string {
  if (placeCandidates.length === 0) {
    return `${destination} is being planned from limited mock context with generic fallback activities.`;
  }

  return `${destination} offers a workable mix of ${placeCandidates.length} grounded mock recommendations across sightseeing, food, and practical trip planning.`;
}

function buildTripPlanFromPrompt(userPrompt: string): TripPlan {
  const destination = extractPromptValue(userPrompt, "destination") ?? "Trip";
  const budget = extractPromptValue(userPrompt, "budget") ?? "medium";
  const travelStyle = extractPromptValue(userPrompt, "travelStyle") ?? "balanced";
  const requiredDates = extractRequiredDates(userPrompt);
  const placeCandidates = extractPlaceCandidates(userPrompt);
  const restaurantCandidate = placeCandidates.find((candidate) => {
    return candidate.category === "restaurant";
  });
  const sparseContext =
    userPrompt.includes("No destination summary was provided.") ||
    userPrompt.includes("No weather summary was provided.") ||
    userPrompt.includes("No named place candidates were provided.");

  return TripPlanSchema.parse({
    destinationSummary: buildDestinationSummaryText(destination, placeCandidates),
    tripStyleSummary: `A ${buildTravelStyleLabel(travelStyle)} ${budget} itinerary for ${destination} with realistic daily pacing.`,
    practicalNotes: sparseContext
      ? ["Context is limited, so some itinerary blocks stay generic and conservative."]
      : ["Use the named mock place candidates as anchors and keep transit between neighborhoods practical."],
    days: requiredDates.map((date, index) => {
      const namedCandidate = placeCandidates[index % Math.max(placeCandidates.length, 1)];
      const morningActivity =
        namedCandidate
          ? {
              title: `Start at ${namedCandidate.name}`,
              placeId: namedCandidate.id,
              description:
                namedCandidate.summary ??
                `Use ${namedCandidate.name} as an anchored ${travelStyle} starting point for the day.`,
            }
          : {
              title: `${destination} orientation walk`,
              description: `Keep the day ${buildTravelStyleLabel(travelStyle)} and ${buildBudgetLabel(budget)} with a flexible neighborhood walk.`,
            };
      const afternoonActivity =
        restaurantCandidate
          ? [
              {
                title: `Lunch near ${restaurantCandidate.name}`,
                placeId: restaurantCandidate.id,
                description:
                  restaurantCandidate.summary ??
                  `Use ${restaurantCandidate.name} for a grounded meal break that matches the ${budget} budget.`,
              },
            ]
          : [];

      return {
        dayNumber: index + 1,
        date,
        theme: `${destination} day ${index + 1}`,
        morning: [morningActivity],
        afternoon: afternoonActivity,
        evening: [],
      };
    }),
    topRecommendations: placeCandidates.slice(0, 3).map((candidate) => {
      return {
        placeId: candidate.id,
        name: candidate.name,
        reason: `It is grounded in the mock planning context and fits the ${travelStyle} ${budget} trip framing.`,
      };
    }),
    warnings: sparseContext
      ? ["Planning context was sparse, so the itinerary stays intentionally generic."]
      : [],
    rationale: `The plan stays ${buildBudgetLabel(budget)} in tone, reflects a ${travelStyle} travel style, and only references grounded mock planning context.`,
  });
}

export class DevelopmentPlannerModel implements PlannerModel {
  public async generate(input: {
    systemPrompt: string;
    userPrompt: string;
  }): Promise<{ text: string }> {
    const tripPlan = buildTripPlanFromPrompt(input.userPrompt);

    return {
      text: JSON.stringify(tripPlan),
    };
  }
}
