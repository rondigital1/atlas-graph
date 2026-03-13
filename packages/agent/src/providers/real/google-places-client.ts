import { parseGooglePlacesResponse } from "./google-places-parser";

const GOOGLE_PLACES_TEXT_SEARCH_ENDPOINT =
  "https://places.googleapis.com/v1/places:searchText";

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_LOCATION_BIAS_RADIUS_METERS = 25_000;
const GOOGLE_PLACES_FIELD_MASK =
  "places.displayName,places.formattedAddress,places.addressComponents,places.primaryType";

export interface GooglePlaceAddressComponent {
  longText: string;
  types: string[];
}

export interface GooglePlaceSearchResult {
  displayName: string;
  formattedAddress?: string;
  primaryType?: string;
  addressComponents: GooglePlaceAddressComponent[];
}

export interface GooglePlacesSearchTextInput {
  textQuery: string;
  center: {
    lat: number;
    lng: number;
  };
}

export interface GooglePlacesClientOptions {
  apiKey: string;
  fetch?: typeof fetch;
  pageSize?: number;
}

export class GooglePlacesClient {
  private readonly apiKey: string;
  private readonly fetchFn: typeof fetch;
  private readonly pageSize: number;

  public constructor(input: GooglePlacesClientOptions) {
    this.apiKey = input.apiKey;
    this.fetchFn = input.fetch ?? fetch;
    this.pageSize = input.pageSize ?? DEFAULT_PAGE_SIZE;
  }

  public async searchText(
    input: GooglePlacesSearchTextInput
  ): Promise<GooglePlaceSearchResult[]> {
    const response = await this.fetchFn(GOOGLE_PLACES_TEXT_SEARCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.apiKey,
        "X-Goog-FieldMask": GOOGLE_PLACES_FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery: input.textQuery,
        pageSize: this.pageSize,
        locationBias: {
          circle: {
            center: {
              latitude: input.center.lat,
              longitude: input.center.lng,
            },
            radius: DEFAULT_LOCATION_BIAS_RADIUS_METERS,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Places Text Search failed with status ${response.status}.`);
    }

    return parseGooglePlacesResponse(await response.json());
  }
}

