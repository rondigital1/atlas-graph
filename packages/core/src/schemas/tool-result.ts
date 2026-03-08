import { z } from "zod";

import { ToolExecutionStatusSchema } from "./common";

export const ToolResultSchema = z.object({
  toolName: z.string(),
  toolCategory: z.string().optional(),
  provider: z.string().optional(),
  status: ToolExecutionStatusSchema,
  latencyMs: z.number().int().nonnegative().optional(),
  payload: z.unknown(),
});

export type ToolResult = z.infer<typeof ToolResultSchema>;
