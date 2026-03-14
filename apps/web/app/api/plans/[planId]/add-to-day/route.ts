import { TripPlanSchema } from "@atlas-graph/core/schemas";
import { Prisma, prisma } from "@atlas-graph/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const AddToDayBodySchema = z.object({
  dayNumber: z.number().int().positive(),
  timeSlot: z.enum(["morning", "afternoon", "evening"]),
  activity: z.object({
    title: z.string().min(1),
    description: z.string(),
  }),
});

interface RouteContext {
  params: Promise<{ planId: string }>;
}

export async function POST(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const { planId } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_REQUEST", message: "Malformed JSON body." } },
      { status: 400 },
    );
  }

  const parsed = AddToDayBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_REQUEST",
          message: "Validation failed.",
          details: parsed.error.flatten(),
        },
      },
      { status: 400 },
    );
  }

  const { dayNumber, timeSlot, activity } = parsed.data;

  const output = await prisma.plannerRunOutput.findFirst({
    where: { plannerRunId: planId },
    select: { id: true, payload: true },
  });

  if (!output) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Plan output not found." } },
      { status: 404 },
    );
  }

  const planParsed = TripPlanSchema.safeParse(output.payload);
  if (!planParsed.success) {
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Stored plan data is invalid." } },
      { status: 500 },
    );
  }

  const plan = planParsed.data;
  const day = plan.days.find((d) => d.dayNumber === dayNumber);

  if (!day) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: `Day ${dayNumber} not found.` } },
      { status: 404 },
    );
  }

  day[timeSlot].push({
    title: activity.title,
    description: activity.description,
  });

  await prisma.plannerRunOutput.update({
    where: { id: output.id },
    data: { payload: plan as unknown as Prisma.InputJsonValue },
  });

  return NextResponse.json({
    success: true,
    dayNumber,
    timeSlot,
    activity,
  });
}
