import { TripRequestSchema } from "@atlas-graph/core/schemas";
import { NextResponse } from "next/server";

import { createPlanningRunQueryService } from "../../../../src/server/create-planning-run-query-service";

interface PlanRouteContext {
  params: Promise<{
    planId: string;
  }>;
}

export async function PATCH(
  request: Request,
  context: PlanRouteContext
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

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_REQUEST",
          message: "Request validation failed",
          details: {
            body: ["Malformed JSON body."],
          },
        },
      },
      { status: 400 }
    );
  }

  const parsedRequest = TripRequestSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_REQUEST",
          message: "Request validation failed",
          details: parsedRequest.error.flatten(),
        },
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    id: planId,
  });
}
