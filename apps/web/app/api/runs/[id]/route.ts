import { NextResponse } from "next/server";

import { createPlanningRunQueryService } from "../../../../src/server/create-planning-run-query-service";
import {
  createPlanningRunDetailInternalErrorResponse,
  createPlanningRunDetailSuccessResponse,
  createPlanningRunNotFoundResponse,
} from "../../../../src/server/api/planning-run-response";

interface GetPlanningRunRouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  context: GetPlanningRunRouteContext
): Promise<Response> {
  try {
    const { id } = await context.params;
    const planningRunQueryService = createPlanningRunQueryService();
    const runDetail = await planningRunQueryService.getRunDetailById(id);

    if (!runDetail) {
      return NextResponse.json(createPlanningRunNotFoundResponse(), {
        status: 404,
      });
    }

    return NextResponse.json(createPlanningRunDetailSuccessResponse(runDetail), {
      status: 200,
    });
  } catch {
    return NextResponse.json(createPlanningRunDetailInternalErrorResponse(), {
      status: 500,
    });
  }
}
