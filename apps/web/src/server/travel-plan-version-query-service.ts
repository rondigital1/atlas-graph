import type {
  ItineraryVersionRepository,
  PersistedItineraryVersion,
  TravelPlanRepository,
} from "@atlas-graph/db";

export interface TravelPlanVersionQueryService {
  listVersionsForPlan(planId: string): Promise<PersistedItineraryVersion[] | null>;
}

export class DefaultTravelPlanVersionQueryService
  implements TravelPlanVersionQueryService
{
  private readonly itineraryVersionRepository: ItineraryVersionRepository;
  private readonly travelPlanRepository: TravelPlanRepository;

  public constructor(input: {
    itineraryVersionRepository: ItineraryVersionRepository;
    travelPlanRepository: TravelPlanRepository;
  }) {
    this.itineraryVersionRepository = input.itineraryVersionRepository;
    this.travelPlanRepository = input.travelPlanRepository;
  }

  public async listVersionsForPlan(
    planId: string,
  ): Promise<PersistedItineraryVersion[] | null> {
    const plan = await this.travelPlanRepository.getPlanById(planId);

    if (!plan) {
      return null;
    }

    return await this.itineraryVersionRepository.listVersionsForPlan(planId);
  }
}
