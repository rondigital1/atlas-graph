import { cleanOptionalText } from "../../normalization/text-cleaning";
import { asRecord, asArray, asStringArray, asNumber } from "./type-parsing";
import type { ResolvedGoogleDestination } from "./google-geocoding-client";

const DESTINATION_COMPONENT_PRIORITY = [
  "locality",
  "postal_town",
  "administrative_area_level_1",
  "country",
] as const;

interface GoogleGeocodingAddressComponent {
  longName: string;
  types: string[];
}

export function parseGeocodingResponse(payload: unknown): ResolvedGoogleDestination {
  const record = asRecord(payload);

  if (!record) {
    throw new Error("Google Geocoding returned an invalid payload.");
  }

  const status = cleanOptionalText(record?.["status"]);

  if (status !== "OK") {
    const errorMessage = cleanOptionalText(record?.["error_message"]);

    throw new Error(
      errorMessage
        ? `Google Geocoding failed with status ${status}: ${errorMessage}`
        : `Google Geocoding failed with status ${status ?? "UNKNOWN"}.`
    );
  }

  const results = asArray(record["results"]);
  const firstResult = asRecord(results[0]);

  if (!firstResult) {
    throw new Error("Google Geocoding returned no results.");
  }

  const formattedAddress = cleanOptionalText(firstResult["formatted_address"]);
  const components = parseAddressComponents(firstResult["address_components"]);
  const coordinates = parseCoordinates(firstResult["geometry"]);

  if (!formattedAddress) {
    throw new Error("Google Geocoding returned a result without formatted_address.");
  }

  const destination =
    extractDestinationName(components) ??
    cleanOptionalText(formattedAddress.split(",")[0]);

  if (!destination) {
    throw new Error("Google Geocoding returned a result without a usable destination.");
  }

  return {
    destination,
    country: findComponentLongName(components, "country"),
    formattedAddress,
    coordinates,
  };
}

function parseAddressComponents(value: unknown): GoogleGeocodingAddressComponent[] {
  return asArray(value)
    .map((item) => {
      const component = asRecord(item);
      const longName = cleanOptionalText(component?.["long_name"]);
      const types = asStringArray(component?.["types"]);

      if (!longName || types.length === 0) {
        return null;
      }

      return {
        longName,
        types,
      };
    })
    .filter((item): item is GoogleGeocodingAddressComponent => item !== null);
}

function parseCoordinates(value: unknown): { lat: number; lng: number } {
  const geometry = asRecord(value);
  const location = asRecord(geometry?.["location"]);
  const lat = asNumber(location?.["lat"]);
  const lng = asNumber(location?.["lng"]);

  if (lat === undefined || lng === undefined) {
    throw new Error("Google Geocoding returned invalid coordinates.");
  }

  return { lat, lng };
}

function extractDestinationName(
  components: readonly GoogleGeocodingAddressComponent[]
): string | undefined {
  for (const componentType of DESTINATION_COMPONENT_PRIORITY) {
    const match = findComponentLongName(components, componentType);

    if (match) {
      return match;
    }
  }

  return undefined;
}

function findComponentLongName(
  components: readonly GoogleGeocodingAddressComponent[],
  componentType: string
): string | undefined {
  return components.find((component) => component.types.includes(componentType))
    ?.longName;
}
