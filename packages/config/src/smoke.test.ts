import { describe, expect, it } from "vitest";

import { parseAtlasEnv } from "./index";

describe("config package", () => {
  it("parses placeholder env input", () => {
    const result = parseAtlasEnv({
      DATABASE_URL: "postgresql://localhost:5432/atlas_graph",
    });

    expect(result.DATABASE_URL).toContain("atlas_graph");
  });
});
