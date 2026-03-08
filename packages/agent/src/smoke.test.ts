import { describe, expect, it } from "vitest";

import { plannerModuleStatus, promptRegistry, toolRegistry } from "./index";

describe("agent package", () => {
  it("keeps planner, prompt, and tool stubs in place", () => {
    expect(plannerModuleStatus.implemented).toBe(false);
    expect(Object.keys(promptRegistry)).toHaveLength(0);
    expect(Object.keys(toolRegistry)).toHaveLength(0);
  });
});
