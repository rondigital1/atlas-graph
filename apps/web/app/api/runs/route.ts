import { NextResponse } from "next/server";

import { createPlanningRunQueryService } from "../../../src/server/create-planning-run-query-service";
import {
  createPlanningRunListInternalErrorResponse,
  createPlanningRunListSuccessResponse,
} from "../../../src/server/api/planning-run-response";

export async function GET(): Promise<Response> {
  try {
    const planningRunQueryService = createPlanningRunQueryService();
    const runs = await planningRunQueryService.listRecentRuns();

    return NextResponse.json(createPlanningRunListSuccessResponse(runs), {
      status: 200,
    });
  } catch {
    return NextResponse.json(createPlanningRunListInternalErrorResponse(), {
      status: 500,
    });
  }
}
