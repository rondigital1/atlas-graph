import { describe, expect, it } from "vitest";

import { siteMetadata, travelPlannerPlaceholders } from "./site";

describe("site placeholders", () => {
  it("keeps the branded shell wired", () => {
    expect(siteMetadata.name).toBe("AtlasGraph");
    expect(travelPlannerPlaceholders).toHaveLength(3);
  });
});
