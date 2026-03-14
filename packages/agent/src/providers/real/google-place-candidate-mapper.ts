import type { PlaceCategory } from "@atlas-graph/core/types";

import { cleanOptionalText } from "../../normalization/text-cleaning";
import { mapGooglePlaceCategory } from "./google-place-category-mapper";
import type { GooglePlaceSearchResult } from "./google-places-client";

const GOOGLE_PLACES_SOURCE = "google-places";

export interface MappedGooglePlaceCandidate {
  id: string;
  name: string;
  category: PlaceCategory;
  source: string;
  address?: string;
  rating?: number;
  priceLevel?: number;
  lat?: number;
  lng?: number;
}

export function mapGooglePlaceToCandidate(
  input: GooglePlaceSearchResult,
  fallbackCategory: PlaceCategory
): MappedGooglePlaceCandidate | null {
  const id = cleanOptionalText(input.id);
  const name = cleanOptionalText(input.displayName);

  if (!id || !name) {
    return null;
  }

  const category = mapGooglePlaceCategory({
    primaryType: input.primaryType,
    types: input.types,
    fallbackCategory,
  });

  if (!category) {
    return null;
  }

  const priceLevel = mapGooglePriceLevel(input.priceLevel);

  return {
    id,
    name,
    category,
    source: GOOGLE_PLACES_SOURCE,
    ...(input.formattedAddress ? { address: input.formattedAddress } : {}),
    ...(input.rating !== undefined ? { rating: input.rating } : {}),
    ...(priceLevel !== undefined ? { priceLevel } : {}),
    ...(input.location?.lat !== undefined ? { lat: input.location.lat } : {}),
    ...(input.location?.lng !== undefined ? { lng: input.location.lng } : {}),
  };
}

function mapGooglePriceLevel(value: string | undefined): number | undefined {
  switch (value) {
    case "PRICE_LEVEL_INEXPENSIVE":
      return 1;
    case "PRICE_LEVEL_MODERATE":
      return 2;
    case "PRICE_LEVEL_EXPENSIVE":
      return 3;
    case "PRICE_LEVEL_VERY_EXPENSIVE":
      return 4;
    default:
      return undefined;
  }
}
