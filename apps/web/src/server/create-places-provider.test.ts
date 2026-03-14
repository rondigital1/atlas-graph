import { GooglePlacesProvider, MockPlacesProvider } from "@atlas-graph/agent";
import { describe, expect, it } from "vitest";

import { createPlacesProvider } from "./create-places-provider";

describe("createPlacesProvider", () => {
  it("returns the mock provider when GOOGLE_MAPS_API_KEY is missing", () => {
    const result = createPlacesProvider({});

    expect(result).toBeInstanceOf(MockPlacesProvider);
  });

  it("returns the real provider when GOOGLE_MAPS_API_KEY is configured", () => {
    const result = createPlacesProvider({
      GOOGLE_MAPS_API_KEY: "test-key",
    });

    expect(result).toBeInstanceOf(GooglePlacesProvider);
  });
});
