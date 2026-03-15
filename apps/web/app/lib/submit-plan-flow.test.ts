import { describe, expect, it, vi } from "vitest";

import type { TripRequest } from "@atlas-graph/core/types";

import {
  createSingleFlightSubmitter,
  submitPlanFlow,
  SubmitPlanFlowError,
} from "./submit-plan-flow";

function createRequest(): TripRequest {
  return {
    budget: "medium",
    destination: "Lisbon, Portugal",
    endDate: "2026-06-18",
    groupType: "couple",
    interests: ["Food & Dining", "Walkable"],
    startDate: "2026-06-12",
    travelStyle: "balanced",
  };
}

describe("submitPlanFlow", () => {
  it("creates a plan and then triggers generation", async () => {
    const stageChanges: string[] = [];
    const createPlan = vi.fn().mockResolvedValue({ id: "plan-1" });
    const updatePlan = vi.fn();
    const generatePlan = vi.fn().mockResolvedValue({ id: "run-1" });

    const result = await submitPlanFlow(
      {
        onStageChange(stage) {
          stageChanges.push(stage);
        },
        persistedPlanId: null,
        request: createRequest(),
      },
      {
        createPlan,
        generatePlan,
        updatePlan,
      }
    );

    expect(result).toEqual({
      generatedPlanId: "run-1",
      persistedPlanId: "plan-1",
    });
    expect(createPlan).toHaveBeenCalledWith(createRequest());
    expect(generatePlan).toHaveBeenCalledWith("plan-1");
    expect(updatePlan).not.toHaveBeenCalled();
    expect(stageChanges).toEqual(["saving", "generating"]);
  });

  it("stops before generate when plan creation fails", async () => {
    const createPlan = vi
      .fn()
      .mockRejectedValue(new Error("Request validation failed"));
    const updatePlan = vi.fn();
    const generatePlan = vi.fn();

    expect.assertions(5);

    try {
      await submitPlanFlow(
        {
          persistedPlanId: null,
          request: createRequest(),
        },
        {
          createPlan,
          generatePlan,
          updatePlan,
        }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(SubmitPlanFlowError);
      expect((error as SubmitPlanFlowError).message).toBe(
        "Failed to save your trip request. Request validation failed."
      );
      expect((error as SubmitPlanFlowError).persistedPlanId).toBeNull();
      expect((error as SubmitPlanFlowError).stage).toBe("saving");
    }

    expect(generatePlan).not.toHaveBeenCalled();
  });

  it("preserves the created plan id when generate fails so retries use update", async () => {
    const createPlan = vi.fn().mockResolvedValue({ id: "plan-7" });
    const updatePlan = vi.fn().mockResolvedValue({ id: "plan-7" });
    const generatePlan = vi
      .fn()
      .mockRejectedValueOnce(new Error("Timed out"))
      .mockResolvedValueOnce({ id: "run-8" });

    let persistedPlanId: string | null = null;

    try {
      await submitPlanFlow(
        {
          persistedPlanId,
          request: createRequest(),
        },
        {
          createPlan,
          generatePlan,
          updatePlan,
        }
      );
    } catch (error) {
      persistedPlanId = (error as SubmitPlanFlowError).persistedPlanId;
    }

    expect(persistedPlanId).toBe("plan-7");

    const retryResult = await submitPlanFlow(
      {
        persistedPlanId,
        request: {
          ...createRequest(),
          interests: ["Food & Dining", "Architecture"],
        },
      },
      {
        createPlan,
        generatePlan,
        updatePlan,
      }
    );

    expect(retryResult).toEqual({
      generatedPlanId: "run-8",
      persistedPlanId: "plan-7",
    });
    expect(createPlan).toHaveBeenCalledTimes(1);
    expect(updatePlan).toHaveBeenCalledTimes(1);
    expect(updatePlan).toHaveBeenCalledWith("plan-7", {
      ...createRequest(),
      interests: ["Food & Dining", "Architecture"],
    });
  });

  it("guards against duplicate submissions while a request is in flight", async () => {
    let releaseGenerate: (() => void) | undefined;
    const createPlan = vi.fn().mockResolvedValue({ id: "plan-1" });
    const updatePlan = vi.fn();
    const generatePlan = vi.fn().mockImplementation(
      () =>
        new Promise<{ id: string }>((resolve) => {
          releaseGenerate = () => {
            resolve({
              id: "run-1",
            });
          };
        })
    );

    const submit = createSingleFlightSubmitter((request: TripRequest) =>
      submitPlanFlow(
        {
          persistedPlanId: null,
          request,
        },
        {
          createPlan,
          generatePlan,
          updatePlan,
        }
      )
    );

    const first = submit(createRequest());
    const second = submit(createRequest());

    await Promise.resolve();
    await Promise.resolve();

    expect(first).toBe(second);
    expect(createPlan).toHaveBeenCalledTimes(1);
    expect(generatePlan).toHaveBeenCalledTimes(1);

    if (!releaseGenerate) {
      throw new Error("Expected the generate promise to be created.");
    }

    releaseGenerate();

    await expect(first).resolves.toEqual({
      generatedPlanId: "run-1",
      persistedPlanId: "plan-1",
    });
  });
});
