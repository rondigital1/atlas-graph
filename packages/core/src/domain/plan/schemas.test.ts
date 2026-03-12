import { describe, expect, it } from "vitest";

import {
  PLAN_STATUS_VALUES,
  PlanStatusSchema,
  TravelDraftSchema,
  TravelPlanInputSchema,
  TravelPlanSchema,
} from "./index";

function createValidTravelPlanInput() {
  return {
    origin: "New York",
    destination: "Tokyo",
    startDate: "2026-04-10",
    endDate: "2026-04-15",
    travelers: 2,
    budgetUsd: 3500,
    preferences: ["food", "culture"],
  };
}

function createValidTravelDraft() {
  return {
    id: "draft-123",
    userId: "user-123",
    status: "draft" as const,
    input: createValidTravelPlanInput(),
    createdAt: new Date("2026-03-01T10:00:00.000Z"),
    updatedAt: new Date("2026-03-02T12:30:00.000Z"),
  };
}

function getIssuePaths(input: unknown): string[] {
  const result = TravelPlanInputSchema.safeParse(input);

  if (result.success) {
    return [];
  }

  return result.error.issues.map((issue) => issue.path.join("."));
}

describe("PlanStatusSchema", () => {
  it.each(PLAN_STATUS_VALUES)("accepts %s", (status) => {
    const result = PlanStatusSchema.safeParse(status);

    expect(result.success).toBe(true);
  });
});

describe("TravelPlanInputSchema", () => {
  it("parses a valid travel plan input with all fields", () => {
    const result = TravelPlanInputSchema.safeParse(createValidTravelPlanInput());

    expect(result.success).toBe(true);
  });

  it("parses a valid travel plan input without optional fields", () => {
    const { budgetUsd, preferences, ...input } = createValidTravelPlanInput();
    const result = TravelPlanInputSchema.safeParse(input);

    expect(result.success).toBe(true);
    expect(budgetUsd).toBeDefined();
    expect(preferences).toBeDefined();
  });

  it("rejects an empty origin", () => {
    expect(getIssuePaths({ ...createValidTravelPlanInput(), origin: "" })).toContain(
      "origin"
    );
  });

  it("rejects an empty destination", () => {
    expect(
      getIssuePaths({ ...createValidTravelPlanInput(), destination: "" })
    ).toContain("destination");
  });

  it("rejects an invalid startDate", () => {
    expect(
      getIssuePaths({
        ...createValidTravelPlanInput(),
        startDate: "2026-02-30",
      })
    ).toContain("startDate");
  });

  it("rejects an invalid endDate", () => {
    expect(
      getIssuePaths({
        ...createValidTravelPlanInput(),
        endDate: "2026-02-30",
      })
    ).toContain("endDate");
  });

  it("rejects travelers that are not positive integers", () => {
    expect(
      getIssuePaths({
        ...createValidTravelPlanInput(),
        travelers: 0,
      })
    ).toContain("travelers");
  });

  it("rejects a negative budgetUsd", () => {
    expect(
      getIssuePaths({
        ...createValidTravelPlanInput(),
        budgetUsd: -1,
      })
    ).toContain("budgetUsd");
  });

  it("rejects empty preferences", () => {
    expect(
      getIssuePaths({
        ...createValidTravelPlanInput(),
        preferences: ["", "culture"],
      })
    ).toContain("preferences.0");
  });

  it("rejects when endDate is before startDate", () => {
    expect(
      getIssuePaths({
        ...createValidTravelPlanInput(),
        startDate: "2026-04-15",
        endDate: "2026-04-10",
      })
    ).toContain("endDate");
  });
});

describe("TravelDraftSchema", () => {
  it("parses a valid travel draft", () => {
    const result = TravelDraftSchema.safeParse(createValidTravelDraft());

    expect(result.success).toBe(true);
  });

  it("rejects an empty id", () => {
    const result = TravelDraftSchema.safeParse({
      ...createValidTravelDraft(),
      id: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["id"]);
  });

  it("rejects an empty userId", () => {
    const result = TravelDraftSchema.safeParse({
      ...createValidTravelDraft(),
      userId: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["userId"]);
  });

  it("rejects an invalid status", () => {
    const result = TravelDraftSchema.safeParse({
      ...createValidTravelDraft(),
      status: "generated",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["status"]);
  });

  it("rejects an invalid input object", () => {
    const result = TravelDraftSchema.safeParse({
      ...createValidTravelDraft(),
      input: null,
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["input"]);
  });

  it("rejects a non-Date createdAt", () => {
    const result = TravelDraftSchema.safeParse({
      ...createValidTravelDraft(),
      createdAt: "2026-03-01T10:00:00.000Z",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["createdAt"]);
  });

  it("rejects a non-Date updatedAt", () => {
    const result = TravelDraftSchema.safeParse({
      ...createValidTravelDraft(),
      updatedAt: "2026-03-02T12:30:00.000Z",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["updatedAt"]);
  });
});

describe("TravelPlanSchema", () => {
  it("parses a valid travel plan without currentVersionId", () => {
    const result = TravelPlanSchema.safeParse(createValidTravelDraft());

    expect(result.success).toBe(true);
  });

  it("parses a valid travel plan with currentVersionId", () => {
    const result = TravelPlanSchema.safeParse({
      ...createValidTravelDraft(),
      currentVersionId: "version-123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty currentVersionId", () => {
    const result = TravelPlanSchema.safeParse({
      ...createValidTravelDraft(),
      currentVersionId: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["currentVersionId"]);
  });
});
