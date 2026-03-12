import { PlanningRunOutputSummarySchema } from "@atlas-graph/core/schemas";
import type { PlanningRunOutputSummary, TripPlan } from "@atlas-graph/core/types";

export function buildPlanningRunOutputSummary(
  plan: TripPlan
): PlanningRunOutputSummary {
  return PlanningRunOutputSummarySchema.parse({
    destinationSummary: plan.destinationSummary,
    tripStyleSummary: plan.tripStyleSummary,
    dayCount: plan.days.length,
    topRecommendationCount: plan.topRecommendations.length,
    warningCount: plan.warnings.length,
  });
}
