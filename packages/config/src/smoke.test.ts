import { describe, expect, it } from "vitest";

import { parseAtlasEnv } from "./index";

describe("config package", () => {
  it("parses placeholder env input", () => {
    const result = parseAtlasEnv({
      DATABASE_URL: "postgresql://localhost:5432/atlas_graph",
    });

    expect(result.DATABASE_URL).toContain("atlas_graph");
  });

  it("treats blank optional keys as unset", () => {
    const result = parseAtlasEnv({
      DATABASE_URL: "postgresql://localhost:5432/atlas_graph",
      GOOGLE_MAPS_API_KEY: "",
      LANGSMITH_API_KEY: "",
      OPENAI_API_KEY: "",
      OPENWEATHER_API_KEY: "",
    });

    expect(result).toEqual({
      DATABASE_URL: "postgresql://localhost:5432/atlas_graph",
    });
  });
});
