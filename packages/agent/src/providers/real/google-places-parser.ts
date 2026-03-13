import { cleanOptionalText } from "../../normalization/text-cleaning";
import { asRecord, asStringArray } from "./type-parsing";
import type { GooglePlaceSearchResult, GooglePlaceAddressComponent } from "./google-places-client";

export function parseGooglePlacesResponse(payload: unknown): GooglePlaceSearchResult[] {
  const record = asRecord(payload);
  const places = record?.["places"];

  if (places === undefined) {
    return [];
  }

  if (!Array.isArray(places)) {
    throw new Error("Google Places Text Search returned an invalid places payload.");
  }

  return places
    .map((item) => parsePlace(item))
    .filter((item): item is GooglePlaceSearchResult => item !== null);
}

function parsePlace(value: unknown): GooglePlaceSearchResult | null {
  const place = asRecord(value);

  if (!place) {
    return null;
  }

  const displayName = cleanOptionalText(asRecord(place?.["displayName"])?.["text"]);

  if (!displayName) {
    return null;
  }

  return {
    displayName,
    formattedAddress: cleanOptionalText(place["formattedAddress"]),
    primaryType: cleanOptionalText(place["primaryType"]),
    addressComponents: parseAddressComponents(place["addressComponents"]),
  };
}

function parseAddressComponents(value: unknown): GooglePlaceAddressComponent[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const component = asRecord(item);
      const longText = cleanOptionalText(component?.["longText"]);
      const types = asStringArray(component?.["types"]);

      if (!longText || types.length === 0) {
        return null;
      }

      return {
        longText,
        types,
      };
    })
    .filter((item): item is GooglePlaceAddressComponent => item !== null);
}
