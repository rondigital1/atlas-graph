import { POST as legacyPlanTripPost } from "../plan-trip/route";

export async function POST(request: Request): Promise<Response> {
  return await legacyPlanTripPost(request);
}
