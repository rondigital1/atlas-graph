import { ToolResultSchema } from "@atlas-graph/core/schemas";
import type { PlanningContext, ToolResult } from "@atlas-graph/core/types";

const NORMALIZED_TOOL_CATEGORY = "normalized-context";
const NORMALIZED_TOOL_PROVIDER = "normalized-provider";

function createToolResult(input: {
  toolName: string;
  status: "SUCCEEDED" | "PARTIAL";
  payload: unknown;
}): ToolResult {
  return ToolResultSchema.parse({
    toolName: input.toolName,
    toolCategory: NORMALIZED_TOOL_CATEGORY,
    provider: NORMALIZED_TOOL_PROVIDER,
    status: input.status,
    payload: input.payload,
  });
}

export function buildPlanningToolResults(context: PlanningContext): ToolResult[] {
  return [
    createToolResult({
      toolName: "destination-summary",
      status: context.destinationSummary ? "SUCCEEDED" : "PARTIAL",
      payload: context.destinationSummary ?? null,
    }),
    createToolResult({
      toolName: "weather-summary",
      status: context.weatherSummary ? "SUCCEEDED" : "PARTIAL",
      payload: context.weatherSummary ?? null,
    }),
    createToolResult({
      toolName: "place-candidates",
      status: "SUCCEEDED",
      payload: context.placeCandidates,
    }),
  ];
}
