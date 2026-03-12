import { PlannerChain } from "@atlas-graph/agent";
import type { PlannerRunner } from "@atlas-graph/agent";

import { createPlannerModel } from "./create-planner-model";

type PlannerRunnerEnvironment = Record<string, string | undefined>;

export function createPlannerRunner(
  environment: PlannerRunnerEnvironment = process.env
): PlannerRunner {
  return new PlannerChain({
    model: createPlannerModel(environment),
  });
}
