import {
  PlanningContextSchema,
  TripPlanSchema,
  TripRequestSchema,
} from "@atlas-graph/core/schemas";
import type {
  PlanningContext,
  TripPlan,
  TripRequest,
} from "@atlas-graph/core/types";
import { describe, expect, it } from "vitest";

import type { PlannerRunner } from "../planner/planner-types";
import {
  assertTripPlanArrayFieldsPresent,
  createMockPlannerEvalContextBuilder,
  evaluatePlannerFixture,
  plannerEvalFixtures,
  runPlannerEvalSuite,
} from "./index";
import type { PlannerEvalFixture } from "./fixtures/trip-request-fixtures";

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

function createSparsePlanningContext(request: TripRequest): PlanningContext {
  return PlanningContextSchema.parse({
    request,
    placeCandidates: [],
  });
}

function createValidTripPlan(
  fixture: PlannerEvalFixture,
  context: PlanningContext
): TripPlan {
  const request = TripRequestSchema.parse(fixture.input);
  const dates = getInclusiveDateRange(request.startDate, request.endDate);
  const firstPlace = context.placeCandidates[0];
  const fallbackTitle = `${request.destination} orientation walk`;
  const fallbackDescription = `A ${request.travelStyle} opening block that keeps the ${request.budget} budget in view.`;

  return TripPlanSchema.parse({
    destinationSummary:
      context.destinationSummary?.summary ??
      `${request.destination} is being planned from limited fallback context.`,
    tripStyleSummary: `A ${request.travelStyle} itinerary with ${fixture.expectedSignals.budgetKeywords[0]} choices and realistic pacing.`,
    practicalNotes: context.weatherSummary?.dailyNotes ?? [],
    days: dates.map((date, index) => {
      return {
        dayNumber: index + 1,
        date,
        theme: `${request.destination} day ${index + 1}`,
        morning: [
          {
            title: firstPlace?.name ?? fallbackTitle,
            placeId: firstPlace?.id,
            description: firstPlace?.summary ?? fallbackDescription,
          },
        ],
        afternoon: [],
        evening: [],
      };
    }),
    topRecommendations: firstPlace
      ? [
          {
            placeId: firstPlace.id,
            name: firstPlace.name,
            reason: `It supports a ${request.travelStyle} plan with ${fixture.expectedSignals.budgetKeywords[0]} spending.`,
          },
        ]
      : [],
    warnings:
      !context.destinationSummary || !context.weatherSummary || context.placeCandidates.length < 2
        ? ["Limited supporting context was available, so some recommendations stay conservative."]
        : [],
    rationale: `The plan keeps a ${request.travelStyle} rhythm while staying ${fixture.expectedSignals.budgetKeywords[0]} for this trip request.`,
  });
}

function createStaticPlannerRunner(
  planFactory: (context: PlanningContext, fixture: PlannerEvalFixture) => unknown
): PlannerRunner {
  return {
    async run(context: PlanningContext): Promise<TripPlan> {
      const fixture = plannerEvalFixtures.find((candidate) => {
        return candidate.input.destination === context.request.destination;
      });

      if (!fixture) {
        throw new Error("Missing test fixture for planner runner.");
      }

      return planFactory(context, fixture) as TripPlan;
    },
  };
}

describe("planner eval fixtures", () => {
  it("contains schema-valid TripRequest fixtures", () => {
    expect(plannerEvalFixtures).toHaveLength(5);

    for (const fixture of plannerEvalFixtures) {
      expect(TripRequestSchema.parse(fixture.input)).toEqual(fixture.input);
      expect(fixture.id.length).toBeGreaterThan(0);
      expect(fixture.description.length).toBeGreaterThan(0);
    }
  });

  it("runPlannerEvalSuite executes successfully with a stub planner runner", async () => {
    const buildPlanningContext = createMockPlannerEvalContextBuilder();
    const plannerRunner = createStaticPlannerRunner((context, fixture) => {
      return createValidTripPlan(fixture, context);
    });

    const result = await runPlannerEvalSuite({
      fixtures: plannerEvalFixtures.slice(0, 2),
      plannerRunner,
      buildPlanningContext,
    });

    expect(result.fixtureCount).toBe(2);
    expect(result.passedCount).toBe(2);
    expect(result.failedCount).toBe(0);
    expect(result.results.every((fixtureResult) => fixtureResult.passed)).toBe(true);
  });

  it("evaluatePlannerFixture fails useful checks for schema-valid but weak planner output", async () => {
    const fixture = plannerEvalFixtures.find((candidate) => {
      return candidate.id === "barcelona-low-relaxed";
    });

    if (!fixture) {
      throw new Error("Expected Barcelona fixture.");
    }

    const result = await evaluatePlannerFixture({
      fixture,
      buildPlanningContext: async (request) => createSparsePlanningContext(request),
      plannerRunner: {
        async run(): Promise<TripPlan> {
          return TripPlanSchema.parse({
            destinationSummary: "Barcelona can support multiple city activities.",
            tripStyleSummary: "A city itinerary.",
            practicalNotes: [],
            days: [
              {
                dayNumber: 1,
                date: fixture.input.startDate,
                theme: "City overview",
                morning: [
                  {
                    title: "",
                    description: "",
                  },
                ],
                afternoon: [],
                evening: [],
              },
            ],
            topRecommendations: [],
            warnings: [],
            rationale: "The plan covers main sights.",
          });
        },
      },
    });

    expect(result.passed).toBe(false);
    expect(result.checks.find((check) => check.id === "trip-plan-schema-valid")?.passed).toBe(
      true
    );
    expect(result.checks.find((check) => check.id === "trip-plan-date-range")?.passed).toBe(
      false
    );
    expect(
      result.checks.find((check) => check.id === "trip-plan-usable-activities")?.passed
    ).toBe(false);
    expect(
      result.checks.find((check) => check.id === "trip-plan-preference-signals")?.passed
    ).toBe(false);
    expect(
      result.checks.find((check) => check.id === "trip-plan-sparse-context-warnings")?.passed
    ).toBe(false);
  });

  it("evaluatePlannerFixture flags schema-invalid output with null arrays", async () => {
    const fixture = plannerEvalFixtures[0];

    if (!fixture) {
      throw new Error("Expected planner fixture.");
    }

    const result = await evaluatePlannerFixture({
      fixture,
      buildPlanningContext: async (request) => createSparsePlanningContext(request),
      plannerRunner: {
        async run(): Promise<TripPlan> {
          return {
            destinationSummary: "Paris summary",
            tripStyleSummary: "A balanced city plan.",
            practicalNotes: null,
            days: [
              {
                dayNumber: 1,
                date: fixture.input.startDate,
                theme: "Arrival day",
                morning: null,
                afternoon: [],
                evening: [],
              },
            ],
            topRecommendations: [],
            warnings: null,
            rationale: "Balanced pacing.",
          } as unknown as TripPlan;
        },
      },
    });

    expect(result.passed).toBe(false);
    expect(result.checks.find((check) => check.id === "trip-plan-arrays-present")?.passed).toBe(
      false
    );
    expect(result.checks.find((check) => check.id === "trip-plan-schema-valid")?.passed).toBe(
      false
    );
  });

  it("array-field helper passes for a reasonable valid plan", () => {
    const fixture = plannerEvalFixtures[0];

    if (!fixture) {
      throw new Error("Expected planner fixture.");
    }

    const context = createSparsePlanningContext(fixture.input);
    const plan = createValidTripPlan(fixture, context);

    expect(assertTripPlanArrayFieldsPresent(plan).passed).toBe(true);
  });
});
