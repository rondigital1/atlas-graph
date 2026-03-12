import {
  PlanningContextSchema,
  TripPlanSchema,
  TripRequestSchema,
} from "@atlas-graph/core/schemas";
import type {
  ActivityItem,
  PlanningContext,
  TripPlan,
  TripRequest,
} from "@atlas-graph/core/types";
import { MockDestinationInfoProvider } from "../providers/mock/mock-destination-info-provider";
import { MockPlacesProvider } from "../providers/mock/mock-places-provider";
import { MockWeatherProvider } from "../providers/mock/mock-weather-provider";
import { TravelPlanningService } from "../services/travel-planning-service";
import type { PlannerRunner } from "../planner/planner-types";
import type { PlannerEvalFixture } from "./fixtures/trip-request-fixtures";
import { plannerEvalFixtures } from "./fixtures/trip-request-fixtures";

export interface PlannerEvalCheck {
  id: string;
  passed: boolean;
  details: string;
}

export interface PlannerEvalResult {
  fixture: PlannerEvalFixture;
  context: PlanningContext;
  rawPlan?: unknown;
  plan?: TripPlan;
  checks: PlannerEvalCheck[];
  passed: boolean;
  executionError?: string;
}

export interface PlannerEvalSuiteResult {
  results: PlannerEvalResult[];
  fixtureCount: number;
  passedCount: number;
  failedCount: number;
}

export type PlannerEvalContextBuilder = (
  request: TripRequest,
  fixture: PlannerEvalFixture
) => Promise<PlanningContext>;

export interface EvaluatePlannerFixtureInput {
  fixture: PlannerEvalFixture;
  plannerRunner: PlannerRunner;
  buildPlanningContext: PlannerEvalContextBuilder;
}

export interface RunPlannerEvalSuiteInput {
  fixtures?: readonly PlannerEvalFixture[];
  plannerRunner: PlannerRunner;
  buildPlanningContext: PlannerEvalContextBuilder;
}

interface TripPlanShapeCheck {
  check: PlannerEvalCheck;
  parsedPlan?: TripPlan;
}

const UNUSED_PLANNER_RUNNER: PlannerRunner = {
  async run(): Promise<TripPlan> {
    throw new Error("Planner runner is not used when only building eval planning context.");
  },
};

function createCheck(id: string, passed: boolean, details: string): PlannerEvalCheck {
  return {
    id,
    passed,
    details,
  };
}

function createUnavailableCheck(id: string, details: string): PlannerEvalCheck {
  return createCheck(id, false, details);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return true;
}

function getInclusiveDateRange(
  startDate: string,
  endDate: string
): string[] {
  const dates: string[] = [];
  const cursor = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);

  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

function collectActivities(plan: TripPlan): ActivityItem[] {
  return plan.days.flatMap((day) => {
    return [...day.morning, ...day.afternoon, ...day.evening];
  });
}

function containsAnyKeyword(text: string, keywords: readonly string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function buildSparseContextWarningRequired(context: PlanningContext): boolean {
  if (!context.destinationSummary || !context.weatherSummary) {
    return true;
  }

  if (context.placeCandidates.length < 2) {
    return true;
  }

  return false;
}

export function assertTripPlanShapeIsValid(plan: unknown): TripPlanShapeCheck {
  const parsedPlan = TripPlanSchema.safeParse(plan);

  if (!parsedPlan.success) {
    return {
      check: createCheck(
        "trip-plan-schema-valid",
        false,
        parsedPlan.error.issues.map((issue) => issue.message).join("; ")
      ),
    };
  }

  return {
    check: createCheck(
      "trip-plan-schema-valid",
      true,
      "Planner output satisfies TripPlanSchema."
    ),
    parsedPlan: parsedPlan.data,
  };
}

export function assertTripPlanArrayFieldsPresent(plan: unknown): PlannerEvalCheck {
  if (!isRecord(plan)) {
    return createCheck(
      "trip-plan-arrays-present",
      false,
      "Planner output is not an object, so array fields could not be verified."
    );
  }

  const failures: string[] = [];
  const topLevelArrayFields = [
    "practicalNotes",
    "days",
    "topRecommendations",
    "warnings",
  ] as const;

  for (const field of topLevelArrayFields) {
    if (!Array.isArray(plan[field])) {
      failures.push(`${field} must be an array`);
    }
  }

  const rawDays = plan["days"];

  if (Array.isArray(rawDays)) {
    rawDays.forEach((day, index) => {
      if (!isRecord(day)) {
        failures.push(`days[${index}] must be an object`);
        return;
      }

      const dayParts = ["morning", "afternoon", "evening"] as const;

      for (const dayPart of dayParts) {
        if (!Array.isArray(day[dayPart])) {
          failures.push(`days[${index}].${dayPart} must be an array`);
        }
      }
    });
  }

  if (failures.length > 0) {
    return createCheck("trip-plan-arrays-present", false, failures.join("; "));
  }

  return createCheck(
    "trip-plan-arrays-present",
    true,
    "Planner output uses arrays for all required collection fields."
  );
}

export function assertTripPlanMatchesDateRange(
  plan: TripPlan | undefined,
  request: TripRequest
): PlannerEvalCheck {
  if (!plan) {
    return createUnavailableCheck(
      "trip-plan-date-range",
      "Planner output was not schema-valid, so date-range checks were skipped."
    );
  }

  const expectedDates = getInclusiveDateRange(request.startDate, request.endDate);

  if (plan.days.length === 0) {
    return createCheck(
      "trip-plan-date-range",
      false,
      "Planner output contains no day plans."
    );
  }

  if (plan.days.length !== expectedDates.length) {
    return createCheck(
      "trip-plan-date-range",
      false,
      `Expected ${expectedDates.length} day plans but received ${plan.days.length}.`
    );
  }

  for (const [index, day] of plan.days.entries()) {
    const expectedDate = expectedDates[index];
    const expectedDayNumber = index + 1;

    if (day.date !== expectedDate) {
      return createCheck(
        "trip-plan-date-range",
        false,
        `Day ${expectedDayNumber} should use date ${expectedDate}, received ${day.date}.`
      );
    }

    if (day.dayNumber !== expectedDayNumber) {
      return createCheck(
        "trip-plan-date-range",
        false,
        `Day ${expectedDayNumber} should use dayNumber ${expectedDayNumber}, received ${day.dayNumber}.`
      );
    }
  }

  return createCheck(
    "trip-plan-date-range",
    true,
    `Planner output covers the full ${expectedDates.length}-day request range.`
  );
}

export function assertTripPlanHasUsableActivities(
  plan: TripPlan | undefined
): PlannerEvalCheck {
  if (!plan) {
    return createUnavailableCheck(
      "trip-plan-usable-activities",
      "Planner output was not schema-valid, so activity checks were skipped."
    );
  }

  const activities = collectActivities(plan);

  if (activities.length === 0) {
    return createCheck(
      "trip-plan-usable-activities",
      false,
      "Planner output does not contain any itinerary activities."
    );
  }

  const invalidActivity = activities.find((activity) => {
    if (activity.title.trim().length === 0) {
      return true;
    }

    if (activity.description.trim().length === 0) {
      return true;
    }

    return false;
  });

  if (invalidActivity) {
    return createCheck(
      "trip-plan-usable-activities",
      false,
      "Planner output contains an activity with a blank title or description."
    );
  }

  return createCheck(
    "trip-plan-usable-activities",
    true,
    `Planner output contains ${activities.length} non-empty activities.`
  );
}

export function assertTripPlanReflectsFixturePreferences(
  plan: TripPlan | undefined,
  fixture: PlannerEvalFixture
): PlannerEvalCheck {
  if (!plan) {
    return createUnavailableCheck(
      "trip-plan-preference-signals",
      "Planner output was not schema-valid, so preference checks were skipped."
    );
  }

  const comparisonText = `${plan.tripStyleSummary} ${plan.rationale}`.toLowerCase();
  const hasBudgetSignal = containsAnyKeyword(
    comparisonText,
    fixture.expectedSignals.budgetKeywords
  );
  const hasStyleSignal = containsAnyKeyword(
    comparisonText,
    fixture.expectedSignals.styleKeywords
  );

  if (!hasBudgetSignal || !hasStyleSignal) {
    const missingSignals: string[] = [];

    if (!hasBudgetSignal) {
      missingSignals.push(
        `budget signal missing (${fixture.expectedSignals.budgetKeywords.join(", ")})`
      );
    }

    if (!hasStyleSignal) {
      missingSignals.push(
        `travel-style signal missing (${fixture.expectedSignals.styleKeywords.join(", ")})`
      );
    }

    return createCheck(
      "trip-plan-preference-signals",
      false,
      missingSignals.join("; ")
    );
  }

  return createCheck(
    "trip-plan-preference-signals",
    true,
    "Planner output reflects both budget and travel-style expectations."
  );
}

export function assertTripPlanWarningsForSparseContext(
  plan: TripPlan | undefined,
  context: PlanningContext
): PlannerEvalCheck {
  if (!plan) {
    return createUnavailableCheck(
      "trip-plan-sparse-context-warnings",
      "Planner output was not schema-valid, so sparse-context warning checks were skipped."
    );
  }

  if (!buildSparseContextWarningRequired(context)) {
    return createCheck(
      "trip-plan-sparse-context-warnings",
      true,
      "Context is not sparse enough to require warnings."
    );
  }

  const usableWarnings = plan.warnings.filter((warning) => warning.trim().length > 0);

  if (usableWarnings.length === 0) {
    return createCheck(
      "trip-plan-sparse-context-warnings",
      false,
      "Sparse planning context should produce at least one planner warning."
    );
  }

  return createCheck(
    "trip-plan-sparse-context-warnings",
    true,
    `Planner output contains ${usableWarnings.length} warning(s) for sparse context.`
  );
}

export function createMockPlannerEvalContextBuilder(): PlannerEvalContextBuilder {
  const service = new TravelPlanningService({
    destinationInfoProvider: new MockDestinationInfoProvider(),
    placesProvider: new MockPlacesProvider(),
    plannerRunner: UNUSED_PLANNER_RUNNER,
    weatherProvider: new MockWeatherProvider(),
  });

  return async (request: TripRequest): Promise<PlanningContext> => {
    return PlanningContextSchema.parse(await service.buildPlanningContext(request));
  };
}

export async function evaluatePlannerFixture(
  input: EvaluatePlannerFixtureInput
): Promise<PlannerEvalResult> {
  const request = TripRequestSchema.parse(input.fixture.input);
  const context = PlanningContextSchema.parse(
    await input.buildPlanningContext(request, input.fixture)
  );

  try {
    const rawPlan = (await input.plannerRunner.run(context)) as unknown;
    const arrayCheck = assertTripPlanArrayFieldsPresent(rawPlan);
    const shape = assertTripPlanShapeIsValid(rawPlan);
    const checks: PlannerEvalCheck[] = [
      arrayCheck,
      shape.check,
      assertTripPlanMatchesDateRange(shape.parsedPlan, request),
      assertTripPlanHasUsableActivities(shape.parsedPlan),
      assertTripPlanReflectsFixturePreferences(shape.parsedPlan, input.fixture),
      assertTripPlanWarningsForSparseContext(shape.parsedPlan, context),
    ];

    return {
      fixture: input.fixture,
      context,
      rawPlan,
      plan: shape.parsedPlan,
      checks,
      passed: checks.every((check) => check.passed),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown planner evaluation error.";

    return {
      fixture: input.fixture,
      context,
      checks: [
        createCheck(
          "planner-runner-executed",
          false,
          `Planner runner execution failed: ${message}`
        ),
      ],
      passed: false,
      executionError: message,
    };
  }
}

export async function runPlannerEvalSuite(
  input: RunPlannerEvalSuiteInput
): Promise<PlannerEvalSuiteResult> {
  const fixtures = input.fixtures ?? plannerEvalFixtures;
  const results: PlannerEvalResult[] = [];

  for (const fixture of fixtures) {
    results.push(
      await evaluatePlannerFixture({
        fixture,
        plannerRunner: input.plannerRunner,
        buildPlanningContext: input.buildPlanningContext,
      })
    );
  }

  const passedCount = results.filter((result) => result.passed).length;

  return {
    results,
    fixtureCount: fixtures.length,
    passedCount,
    failedCount: fixtures.length - passedCount,
  };
}
