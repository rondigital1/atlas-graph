import { NextResponse } from "next/server";
import { z } from "zod";

import { createPlanningRunQueryService } from "../../../../../src/server/create-planning-run-query-service";

const SaveBodySchema = z.object({
  name: z.string().min(1).max(200),
});

interface RouteContext {
  params: Promise<{ planId: string }>;
}

export async function POST(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const { planId } = await context.params;
  const service = createPlanningRunQueryService();

  const existing = await service.getRunDetailById(planId);
  if (!existing) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Plan not found" } },
      { status: 404 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_REQUEST", message: "Malformed JSON body." } },
      { status: 400 },
    );
  }

  const parsed = SaveBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_REQUEST",
          message: "A trip name is required.",
          details: parsed.error.flatten(),
        },
      },
      { status: 400 },
    );
  }

  await service.saveRunById(planId, parsed.data.name);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const { planId } = await context.params;
  const service = createPlanningRunQueryService();

  const existing = await service.getRunDetailById(planId);
  if (!existing) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Plan not found" } },
      { status: 404 },
    );
  }

  await service.unsaveRunById(planId);

  return new Response(null, { status: 204 });
}
