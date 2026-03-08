import { DestinationSummarySchema } from "@atlas-graph/core/schemas";
import type { DestinationSummary, TripRequest } from "@atlas-graph/core/types";

import type { DestinationInfoProvider } from "../../services/interfaces";
import { buildMockDestinationSummary } from "./mock-data";

export class MockDestinationInfoProvider implements DestinationInfoProvider {
  public async getDestinationSummary(
    input: TripRequest
  ): Promise<DestinationSummary> {
    return DestinationSummarySchema.parse(buildMockDestinationSummary(input));
  }
}
