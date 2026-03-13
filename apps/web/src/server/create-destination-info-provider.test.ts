import {
  GoogleDestinationInfoProvider,
  MockDestinationInfoProvider,
} from "@atlas-graph/agent";
import { describe, expect, it } from "vitest";

import { createDestinationInfoProvider } from "./create-destination-info-provider";

describe("createDestinationInfoProvider", () => {
  it("returns the mock provider when GOOGLE_MAPS_API_KEY is missing", () => {
    const result = createDestinationInfoProvider({});

    expect(result).toBeInstanceOf(MockDestinationInfoProvider);
  });

  it("returns the real provider when GOOGLE_MAPS_API_KEY is configured", () => {
    const result = createDestinationInfoProvider({
      GOOGLE_MAPS_API_KEY: "test-key",
    });

    expect(result).toBeInstanceOf(GoogleDestinationInfoProvider);
  });
});
