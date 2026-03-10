import {
  type PlanningContext,
  type TripPlan,
  PlanningContextSchema,
  TripPlanSchema,
} from "@atlas-graph/core";
import { buildPlannerPromptInput } from "../prompts/build-planner-prompt-input";
import { PLANNER_SYSTEM_PROMPT } from "../prompts/planner-system-prompt";
import {
  PlannerModelResponseError,
  PlannerOutputValidationError,
} from "./errors";
import type { PlannerModel, PlannerRunner } from "./planner-types";
import { parseTripPlanFromModelText } from "./parse-trip-plan";

export interface PlannerChainDeps {
  model: PlannerModel;
}

export class PlannerChain implements PlannerRunner {
  private readonly deps: PlannerChainDeps;

  public constructor(deps: PlannerChainDeps) {
    this.deps = deps;
  }

  public async run(input: PlanningContext): Promise<TripPlan> {
    const validatedInput = PlanningContextSchema.parse(input);

    const userPrompt = buildPlannerPromptInput(validatedInput);

    const modelResponse = await this.deps.model.generate({
      systemPrompt: PLANNER_SYSTEM_PROMPT,
      userPrompt,
    });

    if (!modelResponse || typeof modelResponse.text !== "string") {
      throw new PlannerModelResponseError(
        "Planner model returned a response without usable text."
      );
    }

    const rawText = modelResponse.text;

    if (rawText.trim().length === 0) {
      throw new PlannerModelResponseError(
        "Planner model returned an empty response.",
        rawText
      );
    }

    const parsed = parseTripPlanFromModelText(rawText);
    const validationResult = TripPlanSchema.safeParse(parsed);

    if (!validationResult.success) {
      throw new PlannerOutputValidationError(
        "Planner output failed TripPlanSchema validation.",
        rawText,
        validationResult.error
      );
    }

    return validationResult.data;
  }
}
