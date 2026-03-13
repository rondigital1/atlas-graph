import { TripRequestSchema } from "@atlas-graph/core/schemas";
import type { Budget, GroupType, TravelStyle, TripRequest } from "@atlas-graph/core/types";

import {
  ACCOMMODATION_TYPES,
  CONSTRAINTS,
  DESTINATION_TYPES,
  FLIGHT_PREFERENCES,
  INTERESTS,
} from "./mock/wizard-options";
import type { PlannerFormState } from "./types";

const BUDGET_MAP: Record<string, Budget> = {
  budget: "low",
  luxury: "high",
  moderate: "medium",
  premium: "high",
};

const GROUP_TYPE_MAP: Record<string, GroupType> = {
  couple: "couple",
  family: "family",
  friends: "friends",
  solo: "solo",
};

const TRAVEL_STYLE_MAP: Record<string, TravelStyle> = {
  balanced: "balanced",
  "fast-paced": "packed",
  relaxed: "relaxed",
};

const LABEL_LOOKUPS = {
  accommodation: createLabelLookup(ACCOMMODATION_TYPES),
  constraints: createLabelLookup(CONSTRAINTS),
  destinationType: createLabelLookup(DESTINATION_TYPES),
  flightPreference: createLabelLookup(FLIGHT_PREFERENCES),
  interests: createLabelLookup(INTERESTS),
};

export class PlannerFormValidationError extends Error {
  public readonly issues: string[];

  public constructor(issues: string[]) {
    super(issues[0] ?? "Complete the required trip details before generating.");
    this.name = "PlannerFormValidationError";
    this.issues = issues;
  }
}

export function buildTripRequestFromForm(formState: PlannerFormState): TripRequest {
  const issues: string[] = [];
  const destination = formState.destination.trim();

  if (destination.length === 0) {
    issues.push("Enter a destination.");
  }

  if (formState.startDate.length === 0) {
    issues.push("Choose a start date.");
  }

  if (formState.endDate.length === 0) {
    issues.push("Choose an end date.");
  }

  const budgetSelection = formState.selections.budget[0];
  const budget = budgetSelection ? BUDGET_MAP[budgetSelection] : undefined;
  if (!budget) {
    issues.push("Choose a budget.");
  }

  const tripTypeSelection = formState.selections.tripType[0];
  const groupType = tripTypeSelection ? GROUP_TYPE_MAP[tripTypeSelection] : undefined;
  if (!groupType) {
    issues.push("Choose who is traveling.");
  }

  const travelPaceSelection = formState.selections.travelPace[0];
  const travelStyle = travelPaceSelection
    ? TRAVEL_STYLE_MAP[travelPaceSelection]
    : undefined;
  if (!travelStyle) {
    issues.push("Choose a travel pace.");
  }

  const interests = buildInterestLabels(formState);
  if (interests.length === 0) {
    issues.push("Select at least one interest or trip preference.");
  }

  if (issues.length > 0) {
    throw new PlannerFormValidationError(issues);
  }

  const parsedRequest = TripRequestSchema.safeParse({
    budget,
    destination,
    endDate: formState.endDate,
    groupType,
    interests,
    startDate: formState.startDate,
    travelStyle,
  });

  if (!parsedRequest.success) {
    throw new PlannerFormValidationError(extractSchemaIssues(parsedRequest.error));
  }

  return parsedRequest.data;
}

function buildInterestLabels(formState: PlannerFormState): string[] {
  const interestLabels = [
    ...collectLabels(formState.selections.interests, LABEL_LOOKUPS.interests),
    ...collectLabels(
      formState.selections.destinationType,
      LABEL_LOOKUPS.destinationType
    ),
    ...collectLabels(formState.selections.constraints, LABEL_LOOKUPS.constraints),
    ...collectLabels(
      formState.selections.accommodation,
      LABEL_LOOKUPS.accommodation
    ),
    ...collectLabels(
      formState.selections.flightPreference,
      LABEL_LOOKUPS.flightPreference
    ),
  ];

  const deduped = new Set<string>();
  const normalized: string[] = [];

  for (const label of interestLabels) {
    const dedupeKey = label.toLowerCase();
    if (deduped.has(dedupeKey)) {
      continue;
    }

    deduped.add(dedupeKey);
    normalized.push(label);

    if (normalized.length === 10) {
      break;
    }
  }

  return normalized;
}

function collectLabels(selectionIds: string[], lookup: Map<string, string>): string[] {
  const labels: string[] = [];

  for (const selectionId of selectionIds) {
    const label = lookup.get(selectionId);
    if (!label) {
      continue;
    }

    labels.push(label);
  }

  return labels;
}

function createLabelLookup(
  options: ReadonlyArray<{
    id: string;
    label: string;
  }>
): Map<string, string> {
  const lookup = new Map<string, string>();

  for (const option of options) {
    lookup.set(option.id, option.label);
  }

  return lookup;
}

function extractSchemaIssues(error: {
  flatten: () => {
    fieldErrors: Partial<Record<keyof TripRequest, string[]>>;
    formErrors: string[];
  };
}): string[] {
  const { fieldErrors, formErrors } = error.flatten();
  const orderedFields: Array<keyof TripRequest> = [
    "destination",
    "startDate",
    "endDate",
    "budget",
    "travelStyle",
    "groupType",
    "interests",
  ];

  const issues: string[] = [];

  for (const field of orderedFields) {
    const messages = fieldErrors[field];
    if (!messages) {
      continue;
    }

    for (const message of messages) {
      issues.push(message);
    }
  }

  for (const message of formErrors) {
    issues.push(message);
  }

  if (issues.length === 0) {
    issues.push("Complete the required trip details before generating.");
  }

  return issues;
}
