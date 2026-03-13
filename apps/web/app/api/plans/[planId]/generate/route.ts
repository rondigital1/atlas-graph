import { NextResponse } from "next/server";

import { createPlanningRunQueryService } from "../../../../../src/server/create-planning-run-query-service";

interface PlanGenerateRouteContext {
  params: Promise<{
    planId: string;
  }>;
}

export async function POST(
  _request: Request,
  context: PlanGenerateRouteContext
): Promise<Response> {
  const { planId } = await context.params;
  const planningRunQueryService = createPlanningRunQueryService();
  const existingRun = await planningRunQueryService.getRunDetailById(planId);

  if (!existingRun) {
    return NextResponse.json(
      {
        error: {
          code: "NOT_FOUND",
          message: "Plan not found",
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: planId,
  });
}
