import { describe, expect, it } from "vitest";

import { mapGooglePlaceCategory } from "./google-place-category-mapper";

describe("mapGooglePlaceCategory", () => {
  it("maps recognized Google place types to AtlasGraph place categories", () => {
    expect(
      mapGooglePlaceCategory({
        primaryType: "restaurant",
        types: ["food", "point_of_interest"],
      })
    ).toBe("restaurant");

    expect(
      mapGooglePlaceCategory({
        primaryType: "museum",
      })
    ).toBe("attraction");
  });

  it("falls back to the originating query bucket when the Google type is unmapped", () => {
    expect(
      mapGooglePlaceCategory({
        primaryType: "tourist_information_center",
        fallbackCategory: "activity",
      })
    ).toBe("activity");
  });

  it("returns null when no mapping exists and no fallback is available", () => {
    expect(
      mapGooglePlaceCategory({
        primaryType: "tourist_information_center",
      })
    ).toBeNull();
  });
});
