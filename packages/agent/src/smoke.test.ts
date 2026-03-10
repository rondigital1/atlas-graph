import { describe, expect, it } from "vitest";

import {
  plannerModuleStatus,
  PLANNER_PROMPT_VERSION,
  promptRegistry,
  toolRegistry,
} from "./index";

describe("agent package", () => {
  it("exposes implemented planner and prompt assets", () => {
    expect(plannerModuleStatus.implemented).toBe(true);
    expect(promptRegistry.planner.version).toBe(PLANNER_PROMPT_VERSION);
    expect(promptRegistry.planner.systemPrompt).toContain("Return valid JSON only.");
    expect(Object.keys(toolRegistry)).toHaveLength(0);
  });
});
