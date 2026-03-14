import { notFound } from "next/navigation";

import { Header } from "../../components/header";
import { getDestinationBackground } from "../../lib/mock/destination-backgrounds";
import { getActivitiesForDestination } from "../../lib/mock/recommended-activities";
import { getRestaurantsForDestination } from "../../lib/mock/recommended-restaurants";
import { createPlanningRunQueryService } from "../../../src/server/create-planning-run-query-service";
import { createPlanDetailViewModel } from "../../../src/server/plan-detail-view-models";
import { getRunStatusPresentation } from "../../../src/server/view-model-utils";
import { PlanDayMap } from "./components/plan-day-map";
import { PlanDestinationHero } from "./components/plan-destination-hero";
import { PlanDetailActions } from "./components/plan-detail-actions";
import { PlanDetailOverview } from "./components/plan-detail-overview";
import { PlanDetailSidebar } from "./components/plan-detail-sidebar";
import { PlanErrorState } from "./components/plan-error-state";
import { PlanItineraryTimeline } from "./components/plan-itinerary-timeline";
import { PlanPendingState } from "./components/plan-pending-state";
import { PlanActivitiesSection } from "./components/plan-activities-section";
import { PlanRestaurantsSection } from "./components/plan-restaurants-section";

interface PlanPageContext {
  params: Promise<{
    planId: string;
  }>;
}

export default async function PlanPage(context: PlanPageContext) {
  const { planId } = await context.params;
  const planningRunQueryService = createPlanningRunQueryService();

  let detail;
  try {
    detail = await planningRunQueryService.getRunDetailById(planId);
  } catch {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <PlanErrorState />
        </main>
      </div>
    );
  }

  if (!detail) {
    notFound();
  }

  const status = getRunStatusPresentation(detail.run.status);
  const planDetail = createPlanDetailViewModel(detail);

  if (!planDetail) {
    const isPending =
      detail.run.status === "PENDING" || detail.run.status === "RUNNING";

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {isPending ? (
            <PlanPendingState statusLabel={status.label} />
          ) : (
            <PlanErrorState />
          )}
        </main>
      </div>
    );
  }

  const backgroundUrl = getDestinationBackground(
    planDetail.overview.destination,
  );
  const restaurants = getRestaurantsForDestination(
    planDetail.overview.destination,
  );
  const recommendedActivities = getActivitiesForDestination(
    planDetail.overview.destination,
  );

  return (
    <div className="relative min-h-screen bg-background">
      <PlanDestinationHero
        destination={planDetail.overview.destination}
        backgroundUrl={backgroundUrl}
      />
      <Header />
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="space-y-6">
          <PlanDetailActions
            planId={planId}
            destination={planDetail.overview.destination}
          />
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <PlanDetailOverview overview={planDetail.overview} />
            <PlanDayMap days={planDetail.days} />
            <PlanRestaurantsSection
              planId={planId}
              restaurants={restaurants}
              days={planDetail.days}
            />
            <PlanActivitiesSection
              planId={planId}
              activities={recommendedActivities}
              days={planDetail.days}
            />
            <PlanItineraryTimeline days={planDetail.days} />
          </div>
          <PlanDetailSidebar
            recommendations={planDetail.topRecommendations}
            warnings={planDetail.overview.warnings}
            practicalNotes={planDetail.overview.practicalNotes}
          />
        </div>
      </main>
    </div>
  );
}
