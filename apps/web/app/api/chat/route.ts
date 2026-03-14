import { TripPlanSchema } from "@atlas-graph/core/schemas";
import { z } from "zod";

import { createPlanningRunQueryService } from "../../../src/server/create-planning-run-query-service";
import {
  buildChatSystemPrompt,
  buildGeneralChatSystemPrompt,
} from "../../../src/server/chat-prompt";
import { createChatStream } from "../../../src/server/create-chat-completion";

const ChatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(10000),
      })
    )
    .min(1)
    .max(50),
  tripId: z.string().uuid().optional(),
});

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: { code: "INVALID_REQUEST", message: "Malformed JSON body" } },
      { status: 400 }
    );
  }

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
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

  const { messages, tripId } = parsed.data;
  let systemPrompt: string;
  let destination: string | null = null;

  if (tripId) {
    const service = createPlanningRunQueryService();
    const detail = await service.getRunDetailById(tripId);

    if (!detail || !detail.output) {
      return Response.json(
        { error: { code: "NOT_FOUND", message: "Trip not found or has no plan data" } },
        { status: 404 }
      );
    }

    const planParsed = TripPlanSchema.safeParse(detail.output.payload);
    if (!planParsed.success) {
      return Response.json(
        { error: { code: "INVALID_DATA", message: "Trip plan data is invalid" } },
        { status: 422 }
      );
    }

    destination = detail.run.destination ?? planParsed.data.destinationSummary;
    systemPrompt = buildChatSystemPrompt(planParsed.data, destination);
  } else {
    systemPrompt = buildGeneralChatSystemPrompt();
  }

  const stream = createChatStream(systemPrompt, messages, destination);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    },
  });
}
