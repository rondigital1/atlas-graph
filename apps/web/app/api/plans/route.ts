import { NextResponse } from "next/server";

import {
  createInvalidTravelPlanRequestResponse,
  createMalformedJsonBodyDetails,
  createTravelPlanCreateInternalErrorResponse,
  createTravelPlanListInternalErrorResponse,
  createTravelPlanListSuccessResponse,
  createTravelPlanSuccessResponse,
  formatValidationDetails,
  parseCreateTravelPlanBody,
  parseListPlansQuery,
} from "../../../src/server/api/travel-plan-response";
import { createTravelPlanRepository } from "../../../src/server/create-travel-plan-repository";

export async function GET(request: Request): Promise<Response> {
  const parsedQuery = parseListPlansQuery(request.url);

  if (!parsedQuery.success) {
    return NextResponse.json(
      createInvalidTravelPlanRequestResponse(
        formatValidationDetails(parsedQuery.error)
      ),
      { status: 400 }
    );
  }

  try {
    const repository = createTravelPlanRepository();
    const plans = await repository.listPlans(parsedQuery.data);

    return NextResponse.json(createTravelPlanListSuccessResponse(plans), {
      status: 200,
    });
  } catch {
    return NextResponse.json(createTravelPlanListInternalErrorResponse(), {
      status: 500,
    });
  }
}

export async function POST(request: Request): Promise<Response> {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      createInvalidTravelPlanRequestResponse(createMalformedJsonBodyDetails()),
      { status: 400 }
    );
  }

  const parsedBody = parseCreateTravelPlanBody(requestBody);

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
    const plan = await repository.createPlan(parsedBody.data);

    return NextResponse.json(createTravelPlanSuccessResponse(plan), {
      status: 201,
    });
  } catch {
    return NextResponse.json(createTravelPlanCreateInternalErrorResponse(), {
      status: 500,
    });
  }
}
