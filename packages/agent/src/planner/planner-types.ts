import type { PlanningContext, TripPlan } from "@atlas-graph/core";

export interface PlannerModel {
  generate(input: {
    systemPrompt: string;
    userPrompt: string;
  }): Promise<{ text: string }>;
}

export interface PlannerRunner {
  run(context: PlanningContext): Promise<TripPlan>;
}