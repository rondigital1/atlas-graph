import { TripRequestSchema } from "@atlas-graph/core/schemas";
import { NextResponse } from "next/server";
import { createTravelPlanningService } from "../../../src/server/create-travel-planning-service";
import {
  createInternalErrorResponse,
  createInvalidRequestResponse,
  createPlanTripSuccessResponse,
} from "../../../src/server/api/plan-trip-response";

export async function POST(request: Request): Promise<Response> {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      createInvalidRequestResponse({
        body: ["Malformed JSON body."],
      }),
      { status: 400 }
    );
  }

  const parsedRequest = TripRequestSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return NextResponse.json(
      createInvalidRequestResponse(parsedRequest.error.flatten()),
      { status: 400 }
    );
  }

  try {
    const service = createTravelPlanningService();
    const plan = await service.generatePlan(parsedRequest.data);

    return NextResponse.json(createPlanTripSuccessResponse(plan), { status: 200 });
  } catch {
    return NextResponse.json(createInternalErrorResponse(), { status: 500 });
  }
}
