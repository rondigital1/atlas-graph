import { NextResponse } from "next/server";

import {
  createInvalidTravelPlanRequestResponse,
  createTravelPlanNotFoundResponse,
  formatValidationDetails,
  parsePlanRouteParams,
} from "../../../../../src/server/api/travel-plan-response";
import { createPlanTripWorkflowService } from "../../../../../src/server/create-plan-trip-workflow-service";
import { createPlanningRunQueryService } from "../../../../../src/server/create-planning-run-query-service";
import { createTravelPlanRepository } from "../../../../../src/server/create-travel-plan-repository";

interface PlanGenerateRouteContext {
  params: Promise<{
    planId: string;
  }>;
}

export async function POST(
  _request: Request,
  context: PlanGenerateRouteContext
): Promise<Response> {
  const parsedParams = parsePlanRouteParams(await context.params);

  if (!parsedParams.success) {
    return NextResponse.json(
      createInvalidTravelPlanRequestResponse(
        formatValidationDetails(parsedParams.error)
      ),
      { status: 400 }
    );
  }

  const planId = parsedParams.data.planId;
  const repository = createTravelPlanRepository();
  const persistedPlan = await repository.getPlanById(planId);

  if (!persistedPlan) {
    const planningRunQueryService = createPlanningRunQueryService();
    const existingRun = await planningRunQueryService.getRunDetailById(planId);

    if (!existingRun) {
      return NextResponse.json(createTravelPlanNotFoundResponse(), {
        status: 404,
      });
    }

    return NextResponse.json({
      id: planId,
    });
  }

  await setPlanStatusSafely(repository, planId, "generating");

  try {
    const workflowService = createPlanTripWorkflowService();
    const result = await workflowService.planTripWithRun({
      request: persistedPlan.input,
      userId: persistedPlan.userId,
    });

    await setPlanStatusSafely(repository, planId, "done");

    return NextResponse.json({
      id: result.runId,
    });
  } catch {
    await setPlanStatusSafely(repository, planId, "error");

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to generate plan",
        },
      },
      { status: 500 }
    );
  }
}

async function setPlanStatusSafely(
  repository: ReturnType<typeof createTravelPlanRepository>,
  planId: string,
  status: "done" | "error" | "generating"
): Promise<void> {
  try {
    await repository.updatePlan(planId, {
      status,
    });
  } catch {
    return;
  }
}
