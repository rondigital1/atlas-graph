import { TripPlanSchema } from "@atlas-graph/core/schemas";

import type {
  PlanActivityViewModel,
  PlanDayViewModel,
  PlanDetailViewModel,
  PlanOverviewViewModel,
  PlanRecommendationViewModel,
} from "../../app/lib/types";
import type { PlanningRunDetail } from "./planning-run-query-service";
import {
  formatEnumLabel,
  formatTripDates,
  getRunStatusPresentation,
} from "./view-model-utils";

function mapActivities(
  items: Array<{ title: string; description: string }>
): PlanActivityViewModel[] {
  return items.map((item) => ({
    title: item.title,
    description: item.description,
  }));
}

function mapDays(
  days: Array<{
    dayNumber: number;
    date: string;
    theme: string;
    morning: Array<{ title: string; description: string }>;
    afternoon: Array<{ title: string; description: string }>;
    evening: Array<{ title: string; description: string }>;
  }>
): PlanDayViewModel[] {
  return days.map((day) => ({
    id: `day-${day.dayNumber}`,
    dayNumber: day.dayNumber,
    date: day.date,
    theme: day.theme,
    morning: mapActivities(day.morning),
    afternoon: mapActivities(day.afternoon),
    evening: mapActivities(day.evening),
  }));
}

function mapRecommendations(
  recs: Array<{ name: string; reason: string }>
): PlanRecommendationViewModel[] {
  return recs.map((rec) => ({
    name: rec.name,
    reason: rec.reason,
  }));
}

export function createPlanDetailViewModel(
  detail: PlanningRunDetail
): PlanDetailViewModel | null {
  if (!detail.output) {
    return null;
  }

  const parsed = TripPlanSchema.safeParse(detail.output.payload);

  if (!parsed.success) {
    return null;
  }

  const plan = parsed.data;
  const status = getRunStatusPresentation(detail.run.status);

  const overview: PlanOverviewViewModel = {
    destination: plan.destinationSummary,
    tripStyleSummary: plan.tripStyleSummary,
    dates: formatTripDates(detail.run.startDate, detail.run.endDate),
    budget: formatEnumLabel(detail.run.budget),
    statusLabel: status.label,
    statusTone: status.tone,
    practicalNotes: plan.practicalNotes,
    warnings: plan.warnings,
    rationale: plan.rationale,
  };

  return {
    overview,
    days: mapDays(plan.days),
    topRecommendations: mapRecommendations(plan.topRecommendations),
  };
}
