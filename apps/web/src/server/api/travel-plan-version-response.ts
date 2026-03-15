import type { PersistedItineraryVersion } from "@atlas-graph/db";
import type { TripPlan } from "@atlas-graph/core";

export interface TravelPlanVersionGenerationRunApiRecord {
  completedAt: string | null;
  createdAt: string;
  durationMs: number;
  errorMessage: string | null;
  id: string;
  modelName: string | null;
  modelProvider: string | null;
  modelVersion: string | null;
  planId: string;
  startedAt: string | null;
  status: string;
  updatedAt: string;
}

export interface TravelPlanVersionApiRecord {
  content: TripPlan;
  generatedAt: string;
  generationRun: TravelPlanVersionGenerationRunApiRecord;
  id: string;
  isCurrent: boolean;
  planId: string;
  runId: string;
  versionNumber: number;
}

export interface TravelPlanVersionListSuccessResponse {
  data: TravelPlanVersionApiRecord[];
}

export interface TravelPlanVersionErrorResponse {
  error: {
    code: "INTERNAL_ERROR";
    message: string;
  };
}

export function createTravelPlanVersionListSuccessResponse(
  versions: PersistedItineraryVersion[],
): TravelPlanVersionListSuccessResponse {
  return {
    data: versions.map((version) => serializeTravelPlanVersion(version)),
  };
}

export function createTravelPlanVersionListInternalErrorResponse(): TravelPlanVersionErrorResponse {
  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "Failed to load plan versions",
    },
  };
}

function serializeTravelPlanVersion(
  version: PersistedItineraryVersion,
): TravelPlanVersionApiRecord {
  return {
    id: version.id,
    planId: version.planId,
    versionNumber: version.versionNumber,
    content: version.content,
    generatedAt: version.generatedAt.toISOString(),
    runId: version.runId,
    isCurrent: version.isCurrent,
    generationRun: {
      id: version.generationRun.id,
      planId: version.generationRun.planId,
      status: version.generationRun.status,
      modelProvider: version.generationRun.modelProvider,
      modelName: version.generationRun.modelName,
      modelVersion: version.generationRun.modelVersion,
      durationMs: version.generationRun.durationMs,
      errorMessage: version.generationRun.errorMessage,
      startedAt: version.generationRun.startedAt?.toISOString() ?? null,
      completedAt: version.generationRun.completedAt?.toISOString() ?? null,
      createdAt: version.generationRun.createdAt.toISOString(),
      updatedAt: version.generationRun.updatedAt.toISOString(),
    },
  };
}
