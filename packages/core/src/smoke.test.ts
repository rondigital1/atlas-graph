import { describe, expect, it } from "vitest";

import { PROJECT_NAME, coreModuleStatus } from "./index";

describe("core package", () => {
  it("exposes placeholder primitives", () => {
    expect(PROJECT_NAME).toBe("AtlasGraph");
    expect(coreModuleStatus.implemented).toBe(false);
  });
});
