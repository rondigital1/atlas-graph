import { TravelPlanDeleteConflictError } from "@atlas-graph/db";
import { NextResponse } from "next/server";

import {
  createInvalidTravelPlanRequestResponse,
  createMalformedJsonBodyDetails,
  createTravelPlanDeleteConflictResponse,
  createTravelPlanDeleteInternalErrorResponse,
  createTravelPlanDetailInternalErrorResponse,
  createTravelPlanNotFoundResponse,
  createTravelPlanSuccessResponse,
  createTravelPlanUpdateInternalErrorResponse,
  formatValidationDetails,
  parsePlanRouteParams,
  parseUpdateTravelPlanBody,
} from "../../../../src/server/api/travel-plan-response";
import { createTravelPlanRepository } from "../../../../src/server/create-travel-plan-repository";

interface PlanRouteContext {
  params: Promise<{
    planId: string;
  }>;
}

export async function GET(
  _request: Request,
  context: PlanRouteContext
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

  try {
    const repository = createTravelPlanRepository();
    const plan = await repository.getPlanById(parsedParams.data.planId);

    if (!plan) {
      return NextResponse.json(createTravelPlanNotFoundResponse(), {
        status: 404,
      });
    }

    return NextResponse.json(createTravelPlanSuccessResponse(plan), {
      status: 200,
    });
  } catch {
    return NextResponse.json(createTravelPlanDetailInternalErrorResponse(), {
      status: 500,
    });
  }
}

export async function PATCH(
  request: Request,
  context: PlanRouteContext
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

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      createInvalidTravelPlanRequestResponse(createMalformedJsonBodyDetails()),
      { status: 400 }
    );
  }

  const parsedBody = parseUpdateTravelPlanBody(requestBody);

  if (!parsedBody.success) {
    return NextResponse.json(
      createInvalidTravelPlanRequestResponse(
        formatValidationDetails(parsedBody.error)
      ),
      { status: 400 }
    );
  }

  try {
    const repository = createTravelPlanRepository();
    const plan = await repository.updatePlan(
      parsedParams.data.planId,
      parsedBody.data
    );

    if (!plan) {
      return NextResponse.json(createTravelPlanNotFoundResponse(), {
        status: 404,
      });
    }

    return NextResponse.json(createTravelPlanSuccessResponse(plan), {
      status: 200,
    });
  } catch {
    return NextResponse.json(createTravelPlanUpdateInternalErrorResponse(), {
      status: 500,
    });
  }
}

export async function DELETE(
  _request: Request,
  context: PlanRouteContext
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

  try {
    const repository = createTravelPlanRepository();
    const deletedPlan = await repository.deletePlan(parsedParams.data.planId);

    if (!deletedPlan) {
      return NextResponse.json(createTravelPlanNotFoundResponse(), {
        status: 404,
      });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof TravelPlanDeleteConflictError) {
      return NextResponse.json(createTravelPlanDeleteConflictResponse(), {
        status: 409,
      });
    }

    return NextResponse.json(createTravelPlanDeleteInternalErrorResponse(), {
      status: 500,
    });
  }
}
