import { NextResponse } from "next/server";
import { z } from "zod";

import { createPlanningRunQueryService } from "../../../../../src/server/create-planning-run-query-service";

const ReviseDayRequestSchema = z.object({
  dayNumber: z.number().int().positive(),
  prompt: z.string().min(1).max(2000),
});

interface ReviseDayRouteContext {
  params: Promise<{
    planId: string;
  }>;
}

export async function POST(
  request: Request,
  context: ReviseDayRouteContext
): Promise<Response> {
  const { planId } = await context.params;
  const service = createPlanningRunQueryService();
  const existing = await service.getRunDetailById(planId);

  if (!existing) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Plan not found" } },
      { status: 404 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_REQUEST", message: "Malformed JSON body" } },
      { status: 400 }
    );
  }

  const parsed = ReviseDayRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_REQUEST",
          message: "Request validation failed",
          details: parsed.error.flatten(),
        },
      },
      { status: 400 }
    );
  }

  // TODO: Wire to planner service for actual AI-powered day revision
  return NextResponse.json({
    id: planId,
    dayNumber: parsed.data.dayNumber,
    status: "accepted",
  });
}
