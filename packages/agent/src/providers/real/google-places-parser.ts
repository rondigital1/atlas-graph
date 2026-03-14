import { cleanOptionalText } from "../../normalization/text-cleaning";
import { asNumber, asRecord, asStringArray } from "./type-parsing";
import type {
  GooglePlaceAddressComponent,
  GooglePlaceLocation,
  GooglePlaceSearchResult,
} from "./google-places-client";

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

  const id = cleanOptionalText(place["id"]);
  const formattedAddress = cleanOptionalText(place["formattedAddress"]);
  const primaryType = cleanOptionalText(place["primaryType"]);
  const types = asStringArray(place["types"]);
  const location = parseLocation(place["location"]);
  const rating = asNumber(place["rating"]);
  const priceLevel = cleanOptionalText(place["priceLevel"]);

  return {
    displayName,
    addressComponents: parseAddressComponents(place["addressComponents"]),
    ...(id ? { id } : {}),
    ...(formattedAddress ? { formattedAddress } : {}),
    ...(primaryType ? { primaryType } : {}),
    ...(types.length > 0 ? { types } : {}),
    ...(location ? { location } : {}),
    ...(rating !== undefined ? { rating } : {}),
    ...(priceLevel ? { priceLevel } : {}),
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

function parseLocation(value: unknown): GooglePlaceLocation | undefined {
  const location = asRecord(value);
  const lat = asNumber(location?.["latitude"]);
  const lng = asNumber(location?.["longitude"]);

  if (lat === undefined || lng === undefined) {
    return undefined;
  }

  return {
    lat,
    lng,
  };
}
