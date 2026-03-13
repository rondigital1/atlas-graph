"use client";

import type { TripRequest } from "@atlas-graph/core/types";
import { useRouter } from "next/navigation";
import { startTransition, useRef, useState } from "react";

import { createPlan, generatePlan, updatePlan } from "../lib/plans-api";
import {
  createSingleFlightSubmitter,
  submitPlanFlow,
  SubmitPlanFlowError,
  type SubmissionStage,
} from "../lib/submit-plan-flow";

interface UsePlanSubmissionResult {
  errorMessage: string | null;
  isSubmitting: boolean;
  submissionStage: SubmissionStage;
  submit: (request: TripRequest) => Promise<void>;
}

export function usePlanSubmission(): UsePlanSubmissionResult {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionStage, setSubmissionStage] = useState<SubmissionStage>("idle");
  const persistedPlanIdRef = useRef<string | null>(null);
  const submitterRef = useRef<((request: TripRequest) => Promise<string>) | null>(
    null
  );

  if (!submitterRef.current) {
    submitterRef.current = createSingleFlightSubmitter(async (request) => {
      setErrorMessage(null);

      try {
        const result = await submitPlanFlow(
          {
            onStageChange(stage) {
              setSubmissionStage(stage);
            },
            persistedPlanId: persistedPlanIdRef.current,
            request,
          },
          {
            createPlan,
            generatePlan,
            updatePlan,
          }
        );

        persistedPlanIdRef.current = result.planId;

        startTransition(() => {
          router.push(`/plan/${result.planId}`);
        });

        return result.planId;
      } catch (error) {
        if (error instanceof SubmitPlanFlowError) {
          persistedPlanIdRef.current = error.persistedPlanId;
          setErrorMessage(error.message);
        } else if (error instanceof Error && error.message.trim().length > 0) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Failed to submit your trip request. Please try again.");
        }

        throw error;
      } finally {
        setSubmissionStage("idle");
      }
    });
  }

  async function submit(request: TripRequest): Promise<void> {
    try {
      await submitterRef.current?.(request);
    } catch {
      return;
    }
  }

  return {
    errorMessage,
    isSubmitting: submissionStage !== "idle",
    submissionStage,
    submit,
  };
}
