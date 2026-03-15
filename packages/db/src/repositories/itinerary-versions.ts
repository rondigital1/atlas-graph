import {
  GenerationRunStatusSchema,
  TripPlanSchema,
  type GenerationRunStatus,
  type TripPlan,
} from "@atlas-graph/core";
import { Prisma, type PrismaClient } from "../../generated/prisma/client";

import { prisma } from "../client/index";

export const itineraryVersionListSelect = {
  id: true,
  travelPlanId: true,
  versionNumber: true,
  content: true,
  generatedAt: true,
  generationRunId: true,
  isCurrent: true,
  generationRun: {
    select: {
      id: true,
      travelPlanId: true,
      status: true,
      modelProvider: true,
      modelName: true,
      modelVersion: true,
      durationMs: true,
      errorMessage: true,
      startedAt: true,
      completedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.ItineraryVersionSelect;

type ItineraryVersionRecord = Prisma.ItineraryVersionGetPayload<{
  select: typeof itineraryVersionListSelect;
}>;

export interface PersistedItineraryVersionGenerationRun {
  id: string;
  planId: string;
  status: GenerationRunStatus;
  modelProvider: string | null;
  modelName: string | null;
  modelVersion: string | null;
  durationMs: number;
  errorMessage: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersistedItineraryVersion {
  id: string;
  planId: string;
  versionNumber: number;
  content: TripPlan;
  generatedAt: Date;
  runId: string;
  isCurrent: boolean;
  generationRun: PersistedItineraryVersionGenerationRun;
}

export interface ItineraryVersionRepository {
  listVersionsForPlan(planId: string): Promise<PersistedItineraryVersion[]>;
}

function parseTripPlan(value: unknown): TripPlan {
  return TripPlanSchema.parse(structuredClone(value));
}

function parseGenerationRunStatus(value: unknown): GenerationRunStatus {
  return GenerationRunStatusSchema.parse(value);
}

function mapRecordToPersistedItineraryVersion(
  record: ItineraryVersionRecord,
): PersistedItineraryVersion {
  return {
    id: record.id,
    planId: record.travelPlanId,
    versionNumber: record.versionNumber,
    content: parseTripPlan(record.content),
    generatedAt: record.generatedAt,
    runId: record.generationRunId,
    isCurrent: record.isCurrent,
    generationRun: {
      id: record.generationRun.id,
      planId: record.generationRun.travelPlanId,
      status: parseGenerationRunStatus(record.generationRun.status),
      modelProvider: record.generationRun.modelProvider,
      modelName: record.generationRun.modelName,
      modelVersion: record.generationRun.modelVersion,
      durationMs: record.generationRun.durationMs,
      errorMessage: record.generationRun.errorMessage,
      startedAt: record.generationRun.startedAt,
      completedAt: record.generationRun.completedAt,
      createdAt: record.generationRun.createdAt,
      updatedAt: record.generationRun.updatedAt,
    },
  };
}

export function createItineraryVersionRepository(
  client: PrismaClient = prisma,
): ItineraryVersionRepository {
  return {
    async listVersionsForPlan(planId) {
      const records = await client.itineraryVersion.findMany({
        where: {
          travelPlanId: planId,
        },
        orderBy: [
          {
            versionNumber: "desc",
          },
          {
            generatedAt: "desc",
          },
          {
            id: "desc",
          },
        ],
        select: itineraryVersionListSelect,
      });

      return records.map((record) => mapRecordToPersistedItineraryVersion(record));
    },
  };
}

export const itineraryVersionRepository = createItineraryVersionRepository();
