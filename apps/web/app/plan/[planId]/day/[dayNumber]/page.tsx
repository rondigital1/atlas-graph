import { notFound } from "next/navigation";

import { Header } from "../../../../components/header";
import { createPlanningRunQueryService } from "../../../../../src/server/create-planning-run-query-service";
import { createPlanDetailViewModel } from "../../../../../src/server/plan-detail-view-models";
import { DayDetailHeader } from "./components/day-detail-header";
import { DayTimeSection } from "./components/day-time-section";

interface DayPageContext {
  params: Promise<{
    planId: string;
    dayNumber: string;
  }>;
}

export default async function DayDetailPage(context: DayPageContext) {
  const { planId, dayNumber: dayNumberParam } = await context.params;
  const dayNumber = parseInt(dayNumberParam, 10);

  if (isNaN(dayNumber) || dayNumber < 1) {
    notFound();
  }

  const service = createPlanningRunQueryService();
  const detail = await service.getRunDetailById(planId);

  if (!detail) {
    notFound();
  }

  const planDetail = createPlanDetailViewModel(detail);

  if (!planDetail) {
    notFound();
  }

  const day = planDetail.days.find((d) => d.dayNumber === dayNumber);

  if (!day) {
    notFound();
  }

  const destination = planDetail.overview.destination;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="space-y-8">
          <DayDetailHeader
            planId={planId}
            destination={destination}
            dayNumber={day.dayNumber}
            date={day.date}
            theme={day.theme}
          />

          <DayTimeSection
            timeOfDay="morning"
            activities={day.morning}
            destination={destination}
          />
          <DayTimeSection
            timeOfDay="afternoon"
            activities={day.afternoon}
            destination={destination}
          />
          <DayTimeSection
            timeOfDay="evening"
            activities={day.evening}
            destination={destination}
          />
        </div>
      </main>
    </div>
  );
}
