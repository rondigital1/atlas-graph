import { describe, expect, it } from "vitest";

import {
  plannerModuleStatus,
  PLANNER_PROMPT_VERSION,
  promptRegistry,
  toolRegistry,
} from "./index";

describe("agent package", () => {
  it("keeps the planner stub in place and exposes prompt assets", () => {
    expect(plannerModuleStatus.implemented).toBe(false);
    expect(promptRegistry.planner.version).toBe(PLANNER_PROMPT_VERSION);
    expect(promptRegistry.planner.systemPrompt).toContain("Return valid JSON only.");
    expect(Object.keys(toolRegistry)).toHaveLength(0);
  });
});
