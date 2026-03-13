import type { TripPlan } from "../../schemas/trip-plan";
import type { TravelPlanInput } from "../plan";

export const GENERATION_RUN_STATUS_VALUES = [
  "pending",
  "running",
  "done",
  "error",
] as const;

export type GenerationRunStatus = (typeof GENERATION_RUN_STATUS_VALUES)[number];

export type ItineraryContent = TripPlan;

export interface ItineraryVersion {
  id: string;
  planId: string;
  versionNumber: number;
  content: ItineraryContent;
  generatedAt: Date;
  runId: string;
  isCurrent: boolean;
}

export interface GenerationRun {
  id: string;
  planId: string;
  versionId?: string;
  status: GenerationRunStatus;
  inputSnapshot: TravelPlanInput;
  providerData?: unknown;
  durationMs: number;
  error?: string;
}
