import type { PlaceCandidate, TripRequest } from "@atlas-graph/core/types";

import {
  cleanOptionalText,
  normalizeAndDeduplicatePlaceCandidates,
} from "../../normalization";
import { normalizeComparisonText } from "../../normalization/text-cleaning";
import type { PlacesProvider } from "../ports";
import {
  mapGooglePlaceToCandidate,
  type MappedGooglePlaceCandidate,
} from "./google-place-candidate-mapper";
import { buildPlaceCandidateFieldMask } from "./google-places-field-mask";
import {
  GooglePlacesClient,
  type GooglePlaceSearchResult,
} from "./google-places-client";

const QUERY_PAGE_SIZE = 2;
const MAX_RETURNED_CANDIDATES = 6;

const CULTURAL_INTERESTS = new Set([
  "art",
  "architecture",
  "culture",
  "history",
  "museum",
  "museums",
  "sightseeing",
  "local",
  "photography",
]);

const ACTIVITY_INTERESTS = new Set([
  "walking",
  "nightlife",
  "nature",
  "parks",
  "park",
  "hiking",
  "shopping",
  "entertainment",
  "romance",
  "family",
  "family friendly",
  "beach",
  "beaches",
]);

interface PlacesQueryPlanItem {
  bucket: PlaceCandidate["category"];
  textQuery: string;
}

export interface GooglePlacesProviderDependencies {
  placesClient: {
    searchText(input: {
      textQuery: string;
      fieldMask?: string;
      pageSize?: number;
      center?: {
        lat: number;
        lng: number;
      };
    }): Promise<GooglePlaceSearchResult[]>;
  };
}

export interface GooglePlacesProviderOptions {
  apiKey?: string;
  placesClient?: GooglePlacesProviderDependencies["placesClient"];
}

export class GooglePlacesProvider implements PlacesProvider {
  private readonly placesClient: GooglePlacesProviderDependencies["placesClient"];

  public constructor(input: GooglePlacesProviderOptions) {
    if (!input.placesClient && !input.apiKey) {
      throw new Error(
        "GOOGLE_MAPS_API_KEY is required when a places client is not provided."
      );
    }

    this.placesClient =
      input.placesClient ?? new GooglePlacesClient({ apiKey: input.apiKey! });
  }

  public async searchPlaces(input: TripRequest): Promise<PlaceCandidate[]> {
    const queryPlan = buildPlacesQueryPlan(input);
    const queryResults = await Promise.allSettled(
      queryPlan.map((query) => {
        return this.placesClient.searchText({
          textQuery: query.textQuery,
          fieldMask: buildPlaceCandidateFieldMask(),
          pageSize: QUERY_PAGE_SIZE,
        });
      })
    );

    const mappedCandidates = queryPlan.flatMap((query, index) => {
      const queryResult = queryResults[index];

      if (!queryResult || queryResult.status === "rejected") {
        return [];
      }

      return queryResult.value
        .map((place) => mapGooglePlaceToCandidate(place, query.bucket))
        .filter(
          (candidate): candidate is MappedGooglePlaceCandidate => candidate !== null
        );
    });

    return normalizeAndDeduplicatePlaceCandidates(mappedCandidates).slice(
      0,
      MAX_RETURNED_CANDIDATES
    );
  }
}

function buildPlacesQueryPlan(input: TripRequest): PlacesQueryPlanItem[] {
  const destination = cleanOptionalText(input.destination) ?? input.destination;
  const normalizedInterests = new Set(
    input.interests
      .map((interest) => normalizeComparisonText(interest))
      .filter((interest): interest is string => interest !== undefined)
  );
  const includeAttractions = hasInterestMatch(normalizedInterests, CULTURAL_INTERESTS);
  const includeActivities = hasInterestMatch(normalizedInterests, ACTIVITY_INTERESTS);
  const queryPlan: PlacesQueryPlanItem[] = [
    {
      bucket: "hotel",
      textQuery: `hotels in ${destination}`,
    },
    {
      bucket: "restaurant",
      textQuery: `best restaurants in ${destination}`,
    },
  ];

  if (includeAttractions || (!includeAttractions && !includeActivities)) {
    queryPlan.push({
      bucket: "attraction",
      textQuery: `top attractions in ${destination}`,
    });
  }

  if (includeActivities || (!includeAttractions && !includeActivities)) {
    queryPlan.push({
      bucket: "activity",
      textQuery: `top activities in ${destination}`,
    });
  }

  return queryPlan;
}

function hasInterestMatch(
  interests: ReadonlySet<string>,
  candidateInterests: ReadonlySet<string>
): boolean {
  for (const interest of interests) {
    if (candidateInterests.has(interest)) {
      return true;
    }
  }

  return false;
}
