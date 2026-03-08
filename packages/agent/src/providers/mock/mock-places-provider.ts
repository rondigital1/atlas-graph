import { PlaceCandidateSchema } from "@atlas-graph/core/schemas";
import type { PlaceCandidate, TripRequest } from "@atlas-graph/core/types";

import type { PlacesProvider } from "../../services/interfaces";
import { buildMockPlaceCandidates } from "./mock-data";

const PlaceCandidateListSchema = PlaceCandidateSchema.array();

export class MockPlacesProvider implements PlacesProvider {
  public async searchPlaces(input: TripRequest): Promise<PlaceCandidate[]> {
    return PlaceCandidateListSchema.parse(buildMockPlaceCandidates(input));
  }
}
