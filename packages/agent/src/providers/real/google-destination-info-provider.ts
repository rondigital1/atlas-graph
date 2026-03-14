import { DestinationSummarySchema } from "@atlas-graph/core/schemas";
import type { DestinationSummary, TripRequest } from "@atlas-graph/core/types";

import {
  AREA_QUERY_DEFINITIONS,
  buildBestAreas,
  buildLandmarkNames,
  buildNotes,
  buildSummary,
  LANDMARK_QUERY_DEFINITION,
} from "./google-destination-summary-builder";
import type { DestinationInfoProvider } from "../ports";
import {
  GoogleGeocodingClient,
  type ResolvedGoogleDestination,
} from "./google-geocoding-client";
import {
  GooglePlacesClient,
  type GooglePlaceSearchResult,
} from "./google-places-client";

export interface GoogleDestinationInfoProviderDependencies {
  geocodingClient: {
    geocodeDestination(destination: string): Promise<ResolvedGoogleDestination>;
  };
  placesClient: {
    searchText(input: {
      textQuery: string;
      center: {
        lat: number;
        lng: number;
      };
    }): Promise<GooglePlaceSearchResult[]>;
  };
}

export interface GoogleDestinationInfoProviderOptions {
  apiKey?: string;
  geocodingClient?: GoogleDestinationInfoProviderDependencies["geocodingClient"];
  placesClient?: GoogleDestinationInfoProviderDependencies["placesClient"];
}

export class GoogleDestinationInfoProvider implements DestinationInfoProvider {
  private readonly geocodingClient: GoogleDestinationInfoProviderDependencies["geocodingClient"];
  private readonly placesClient: GoogleDestinationInfoProviderDependencies["placesClient"];

  public constructor(input: GoogleDestinationInfoProviderOptions) {
    if (!input.geocodingClient && !input.apiKey) {
      throw new Error(
        "GOOGLE_MAPS_API_KEY is required when a geocoding client is not provided."
      );
    }

    if (!input.placesClient && !input.apiKey) {
      throw new Error(
        "GOOGLE_MAPS_API_KEY is required when a places client is not provided."
      );
    }

    this.geocodingClient =
      input.geocodingClient ?? new GoogleGeocodingClient({ apiKey: input.apiKey! });
    this.placesClient =
      input.placesClient ?? new GooglePlacesClient({ apiKey: input.apiKey! });
  }

  public async getDestinationSummary(
    input: TripRequest
  ): Promise<DestinationSummary> {
    const resolvedDestination = await this.geocodingClient.geocodeDestination(
      input.destination
    );
    const placesEnrichment = await this.fetchPlacesEnrichment(resolvedDestination);
    const bestAreas = buildBestAreas(
      resolvedDestination,
      placesEnrichment.areaPlaces
    );
    const landmarkNames = buildLandmarkNames(
      resolvedDestination,
      placesEnrichment.landmarkPlaces
    );

    return DestinationSummarySchema.parse({
      destination: resolvedDestination.destination,
      ...(resolvedDestination.country
        ? { country: resolvedDestination.country }
        : {}),
      summary: buildSummary(resolvedDestination, bestAreas, landmarkNames),
      bestAreas,
      notes: buildNotes(bestAreas, landmarkNames),
    });
  }

  private async fetchPlacesEnrichment(input: ResolvedGoogleDestination): Promise<{
    areaPlaces: GooglePlaceSearchResult[];
    landmarkPlaces: GooglePlaceSearchResult[];
  }> {
    const areaQueries = AREA_QUERY_DEFINITIONS.map((queryTemplate) => {
      return this.placesClient.searchText({
        textQuery: queryTemplate.replace("{destination}", input.destination),
        center: input.coordinates,
      });
    });
    const landmarkQuery = this.placesClient.searchText({
      textQuery: LANDMARK_QUERY_DEFINITION.replace("{destination}", input.destination),
      center: input.coordinates,
    });

    const [areaResults, landmarkResults] = await Promise.all([
      Promise.allSettled(areaQueries),
      Promise.allSettled([landmarkQuery]),
    ]);

    return {
      areaPlaces: areaResults
        .flatMap((result) => (result.status === "fulfilled" ? result.value : [])),
      landmarkPlaces: landmarkResults
        .flatMap((result) => (result.status === "fulfilled" ? result.value : [])),
    };
  }
}

