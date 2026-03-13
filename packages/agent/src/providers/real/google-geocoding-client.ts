import { parseGeocodingResponse } from "./google-geocoding-parser";

const GOOGLE_GEOCODING_ENDPOINT =
  "https://maps.googleapis.com/maps/api/geocode/json";

export interface ResolvedGoogleDestination {
  destination: string;
  country?: string;
  formattedAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface GoogleGeocodingClientOptions {
  apiKey: string;
  fetch?: typeof fetch;
}

export class GoogleGeocodingClient {
  private readonly apiKey: string;
  private readonly fetchFn: typeof fetch;

  public constructor(input: GoogleGeocodingClientOptions) {
    this.apiKey = input.apiKey;
    this.fetchFn = input.fetch ?? fetch;
  }

  public async geocodeDestination(
    destination: string
  ): Promise<ResolvedGoogleDestination> {
    const requestUrl = new URL(GOOGLE_GEOCODING_ENDPOINT);

    requestUrl.searchParams.set("address", destination);
    requestUrl.searchParams.set("key", this.apiKey);

    const response = await this.fetchFn(requestUrl);

    if (!response.ok) {
      throw new Error(`Google Geocoding request failed with status ${response.status}.`);
    }

    return parseGeocodingResponse(await response.json());
  }
}

