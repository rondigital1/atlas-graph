import { describe, expect, it } from "vitest";

import { plannerModuleStatus, promptRegistry, toolRegistry } from "./index";

describe("agent package", () => {
  it("stays stubbed for T-001", () => {
    expect(plannerModuleStatus.implemented).toBe(false);
    expect(Object.keys(promptRegistry)).toHaveLength(0);
    expect(Object.keys(toolRegistry)).toHaveLength(0);
  });
});
