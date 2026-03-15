import type { TripRequest } from "@atlas-graph/core/types";

import type { createPlan, generatePlan, updatePlan } from "./plans-api";

export type SubmissionStage = "idle" | "saving" | "generating";

type ActiveSubmissionStage = Exclude<SubmissionStage, "idle">;

export interface SubmitPlanFlowInput {
  onStageChange?: (stage: ActiveSubmissionStage) => void;
  persistedPlanId: string | null;
  request: TripRequest;
}

export interface SubmitPlanFlowResult {
  generatedPlanId: string;
  persistedPlanId: string;
}

export interface SubmitPlanFlowDeps {
  createPlan: typeof createPlan;
  generatePlan: typeof generatePlan;
  updatePlan: typeof updatePlan;
}

export class SubmitPlanFlowError extends Error {
  public readonly persistedPlanId: string | null;
  public readonly stage: ActiveSubmissionStage;

  public constructor(
    stage: ActiveSubmissionStage,
    persistedPlanId: string | null,
    message: string
  ) {
    super(message);
    this.name = "SubmitPlanFlowError";
    this.persistedPlanId = persistedPlanId;
    this.stage = stage;
  }
}

export function createSingleFlightSubmitter<TInput, TResult>(
  submit: (input: TInput) => Promise<TResult>
): (input: TInput) => Promise<TResult> {
  let inFlight: Promise<TResult> | null = null;

  return (input: TInput) => {
    if (inFlight) {
      return inFlight;
    }

    const next = submit(input).finally(() => {
      inFlight = null;
    });

    inFlight = next;
    return next;
  };
}

export async function submitPlanFlow(
  input: SubmitPlanFlowInput,
  deps: SubmitPlanFlowDeps
): Promise<SubmitPlanFlowResult> {
  input.onStageChange?.("saving");

  const savedPlanId = await savePlan(input, deps);

  input.onStageChange?.("generating");

  try {
    const generatedPlan = await deps.generatePlan(savedPlanId);

    return {
      generatedPlanId: generatedPlan.id,
      persistedPlanId: savedPlanId,
    };
  } catch (error) {
    throw new SubmitPlanFlowError(
      "generating",
      savedPlanId,
      prefixMessage(
        "Plan saved, but generation failed.",
        getErrorMessage(error, "Please try again.")
      )
    );
  }
}

async function savePlan(
  input: SubmitPlanFlowInput,
  deps: SubmitPlanFlowDeps
): Promise<string> {
  try {
    if (input.persistedPlanId) {
      const updatedPlan = await deps.updatePlan(input.persistedPlanId, input.request);
      return updatedPlan.id;
    }

    const createdPlan = await deps.createPlan(input.request);
    return createdPlan.id;
  } catch (error) {
    throw new SubmitPlanFlowError(
      "saving",
      input.persistedPlanId,
      prefixMessage(
        "Failed to save your trip request.",
        getErrorMessage(error, "Please review the form and try again.")
      )
    );
  }
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error) || error.message.trim().length === 0) {
    return fallback;
  }

  return error.message;
}

function prefixMessage(prefix: string, suffix: string): string {
  if (trimSentence(prefix) === trimSentence(suffix)) {
    return `${trimSentence(prefix)}.`;
  }

  return `${trimSentence(prefix)}. ${trimSentence(suffix)}.`.trim();
}

function trimSentence(value: string): string {
  return value.trim().replace(/[.]+$/u, "");
}
