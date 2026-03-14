import type { PlaceCategory } from "@atlas-graph/core/types";

import { normalizeComparisonText } from "../../normalization/text-cleaning";

const GOOGLE_PLACE_CATEGORY_MAP: Record<string, PlaceCategory> = {
  lodging: "hotel",
  hotel: "hotel",
  hostel: "hotel",
  "bed and breakfast": "hotel",
  "resort hotel": "hotel",
  restaurant: "restaurant",
  cafe: "restaurant",
  bar: "restaurant",
  bakery: "restaurant",
  "meal takeaway": "restaurant",
  "meal delivery": "restaurant",
  "tourist attraction": "attraction",
  museum: "attraction",
  "art gallery": "attraction",
  "historical landmark": "attraction",
  "landmark and historical building": "attraction",
  church: "attraction",
  "hindu temple": "attraction",
  synagogue: "attraction",
  mosque: "attraction",
  monument: "attraction",
  park: "activity",
  "amusement park": "activity",
  "amusement center": "activity",
  "bowling alley": "activity",
  "night club": "activity",
  "shopping mall": "activity",
  market: "activity",
  zoo: "activity",
  aquarium: "activity",
  "sports complex": "activity",
  spa: "activity",
};

export interface GooglePlaceCategoryMappingInput {
  primaryType?: string;
  types?: readonly string[];
  fallbackCategory?: PlaceCategory;
}

export function mapGooglePlaceCategory(
  input: GooglePlaceCategoryMappingInput
): PlaceCategory | null {
  const normalizedTypes = [
    normalizeComparisonText(input.primaryType),
    ...(input.types ?? []).map((type) => normalizeComparisonText(type)),
  ].filter((type): type is string => type !== undefined);

  for (const type of normalizedTypes) {
    const category = GOOGLE_PLACE_CATEGORY_MAP[type];

    if (category) {
      return category;
    }
  }

  return input.fallbackCategory ?? null;
}
