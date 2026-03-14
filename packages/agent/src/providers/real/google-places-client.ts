import { parseGooglePlacesResponse } from "./google-places-parser";
import { buildDestinationPlacesFieldMask } from "./google-places-field-mask";

const GOOGLE_PLACES_TEXT_SEARCH_ENDPOINT =
  "https://places.googleapis.com/v1/places:searchText";

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_LOCATION_BIAS_RADIUS_METERS = 25_000;

export interface GooglePlaceAddressComponent {
  longText: string;
  types: string[];
}

export interface GooglePlaceLocation {
  lat: number;
  lng: number;
}

export interface GooglePlaceSearchResult {
  id?: string;
  displayName: string;
  formattedAddress?: string;
  primaryType?: string;
  types?: string[];
  addressComponents: GooglePlaceAddressComponent[];
  location?: GooglePlaceLocation;
  rating?: number;
  priceLevel?: string;
}

export interface GooglePlacesSearchTextInput {
  textQuery: string;
  center?: {
    lat: number;
    lng: number;
  };
  fieldMask?: string;
  pageSize?: number;
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
    const requestBody: Record<string, unknown> = {
      textQuery: input.textQuery,
      pageSize: input.pageSize ?? this.pageSize,
    };

    if (input.center) {
      requestBody["locationBias"] = {
        circle: {
          center: {
            latitude: input.center.lat,
            longitude: input.center.lng,
          },
          radius: DEFAULT_LOCATION_BIAS_RADIUS_METERS,
        },
      };
    }

    const response = await this.fetchFn(GOOGLE_PLACES_TEXT_SEARCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.apiKey,
        "X-Goog-FieldMask":
          input.fieldMask ?? buildDestinationPlacesFieldMask(),
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Google Places Text Search failed with status ${response.status}.`);
    }

    return parseGooglePlacesResponse(await response.json());
  }
}
