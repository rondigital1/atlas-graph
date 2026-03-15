import { NextResponse } from "next/server";

import {
  createInvalidTravelPlanRequestResponse,
  createTravelPlanNotFoundResponse,
  formatValidationDetails,
  parsePlanRouteParams,
} from "../../../../../src/server/api/travel-plan-response";
import {
  createTravelPlanVersionListInternalErrorResponse,
  createTravelPlanVersionListSuccessResponse,
} from "../../../../../src/server/api/travel-plan-version-response";
import { createTravelPlanVersionQueryService } from "../../../../../src/server/create-travel-plan-version-query-service";

interface PlanVersionsRouteContext {
  params: Promise<{
    planId: string;
  }>;
}

export async function GET(
  _request: Request,
  context: PlanVersionsRouteContext,
): Promise<Response> {
  const parsedParams = parsePlanRouteParams(await context.params);

  if (!parsedParams.success) {
    return NextResponse.json(
      createInvalidTravelPlanRequestResponse(
        formatValidationDetails(parsedParams.error),
      ),
      { status: 400 },
    );
  }

  try {
    const queryService = createTravelPlanVersionQueryService();
    const versions = await queryService.listVersionsForPlan(
      parsedParams.data.planId,
    );

    if (!versions) {
      return NextResponse.json(createTravelPlanNotFoundResponse(), {
        status: 404,
      });
    }

    return NextResponse.json(
      createTravelPlanVersionListSuccessResponse(versions),
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      createTravelPlanVersionListInternalErrorResponse(),
      { status: 500 },
    );
  }
}
