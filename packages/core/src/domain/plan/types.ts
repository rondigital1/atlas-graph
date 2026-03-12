export const PLAN_STATUS_VALUES = [
  "draft",
  "generating",
  "done",
  "error",
] as const;

export type PlanStatus = (typeof PLAN_STATUS_VALUES)[number];

export interface TravelPlanInput {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budgetUsd?: number;
  preferences?: string[];
}

export interface TravelDraft {
  id: string;
  userId: string;
  status: PlanStatus;
  input: TravelPlanInput;
  createdAt: Date;
  updatedAt: Date;
}

export interface TravelPlan extends TravelDraft {
  currentVersionId?: string;
}
