const DESTINATION_GOOGLE_PLACES_FIELDS = [
  "places.displayName",
  "places.formattedAddress",
  "places.addressComponents",
  "places.primaryType",
] as const;

const PLACE_CANDIDATE_GOOGLE_PLACES_FIELDS = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.primaryType",
  "places.types",
  "places.location",
  "places.rating",
  "places.priceLevel",
] as const;

function buildGooglePlacesFieldMask(fields: readonly string[]): string {
  return fields.join(",");
}

export function buildDestinationPlacesFieldMask(): string {
  return buildGooglePlacesFieldMask(DESTINATION_GOOGLE_PLACES_FIELDS);
}

export function buildPlaceCandidateFieldMask(): string {
  return buildGooglePlacesFieldMask(PLACE_CANDIDATE_GOOGLE_PLACES_FIELDS);
}
