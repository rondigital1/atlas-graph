import {
  PlanStatusSchema,
  TripRequestSchema,
  type PlanStatus,
  type TripRequest,
} from "@atlas-graph/core";
import {
  Prisma,
  TravelPlanStatus as PrismaTravelPlanStatus,
  type PrismaClient,
} from "../../generated/prisma/client";

import { prisma } from "../client/index";

export const travelPlanSelect = {
  id: true,
  userId: true,
  status: true,
  input: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TravelPlanSelect;

type TravelPlanRecord = Prisma.TravelPlanGetPayload<{
  select: typeof travelPlanSelect;
}>;

export interface PersistedTravelPlan {
  id: string;
  userId: string;
  status: PlanStatus;
  input: TripRequest;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTravelPlanInput {
  userId: string;
  input: TripRequest;
  status?: PlanStatus;
}

export interface UpdateTravelPlanInput {
  userId?: string;
  status?: PlanStatus;
  input?: TripRequest;
}

export interface ListTravelPlansOptions {
  userId?: string;
  take?: number;
}

export interface TravelPlanRepository {
  createPlan(input: CreateTravelPlanInput): Promise<PersistedTravelPlan>;
  getPlanById(id: string): Promise<PersistedTravelPlan | null>;
  listPlans(options?: ListTravelPlansOptions): Promise<PersistedTravelPlan[]>;
  updatePlan(
    id: string,
    patch: UpdateTravelPlanInput,
  ): Promise<PersistedTravelPlan | null>;
  deletePlan(id: string): Promise<PersistedTravelPlan | null>;
}

function mapPlanStatusToPrisma(status: PlanStatus): PrismaTravelPlanStatus {
  switch (status) {
    case "draft":
      return PrismaTravelPlanStatus.DRAFT;
    case "generating":
      return PrismaTravelPlanStatus.GENERATING;
    case "done":
      return PrismaTravelPlanStatus.DONE;
    case "error":
      return PrismaTravelPlanStatus.ERROR;
    default: {
      const exhaustiveCheck: never = status;
      throw new Error(`Unsupported plan status: ${String(exhaustiveCheck)}`);
    }
  }
}

function mapPlanStatusFromPrisma(status: PrismaTravelPlanStatus): PlanStatus {
  switch (status) {
    case PrismaTravelPlanStatus.DRAFT:
      return "draft";
    case PrismaTravelPlanStatus.GENERATING:
      return "generating";
    case PrismaTravelPlanStatus.DONE:
      return "done";
    case PrismaTravelPlanStatus.ERROR:
      return "error";
    default: {
      const exhaustiveCheck: never = status;
      throw new Error(`Unsupported persisted plan status: ${String(exhaustiveCheck)}`);
    }
  }
}

function parseTripRequest(value: unknown): TripRequest {
  return TripRequestSchema.parse(structuredClone(value));
}

function parsePlanStatus(value: unknown): PlanStatus {
  return PlanStatusSchema.parse(value);
}

function toPrismaJsonValue(
  value: unknown,
): Prisma.InputJsonValue | Prisma.JsonNullValueInput {
  if (value === null) {
    return Prisma.JsonNull;
  }

  return value as Prisma.InputJsonValue;
}

function isPrismaNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return false;
  }

  return error.code === "P2025";
}

function mapRecordToPersistedTravelPlan(
  record: TravelPlanRecord,
): PersistedTravelPlan {
  return {
    id: record.id,
    userId: record.userId,
    status: mapPlanStatusFromPrisma(record.status),
    input: parseTripRequest(record.input),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function buildCreateData(
  input: CreateTravelPlanInput,
): Prisma.TravelPlanCreateInput {
  const status =
    input.status === undefined ? "draft" : parsePlanStatus(input.status);

  return {
    userId: input.userId,
    status: mapPlanStatusToPrisma(status),
    input: toPrismaJsonValue(parseTripRequest(input.input)),
  };
}

function buildUpdateData(
  patch: UpdateTravelPlanInput,
): Prisma.TravelPlanUpdateInput {
  const data: Prisma.TravelPlanUpdateInput = {};

  if (patch.userId !== undefined) {
    data.userId = patch.userId;
  }

  if (patch.status !== undefined) {
    data.status = mapPlanStatusToPrisma(parsePlanStatus(patch.status));
  }

  if (patch.input !== undefined) {
    data.input = toPrismaJsonValue(parseTripRequest(patch.input));
  }

  return data;
}

export function createTravelPlanRepository(
  client: PrismaClient = prisma,
): TravelPlanRepository {
  return {
    async createPlan(input) {
      const record = await client.travelPlan.create({
        data: buildCreateData(input),
        select: travelPlanSelect,
      });

      return mapRecordToPersistedTravelPlan(record);
    },
    async getPlanById(id) {
      const record = await client.travelPlan.findUnique({
        where: {
          id,
        },
        select: travelPlanSelect,
      });

      if (!record) {
        return null;
      }

      return mapRecordToPersistedTravelPlan(record);
    },
    async listPlans(options = {}) {
      const records = await client.travelPlan.findMany({
        where:
          options.userId === undefined
            ? undefined
            : {
                userId: options.userId,
              },
        take: options.take ?? 50,
        orderBy: [
          {
            updatedAt: "desc",
          },
          {
            id: "desc",
          },
        ],
        select: travelPlanSelect,
      });

      return records.map((record) => mapRecordToPersistedTravelPlan(record));
    },
    async updatePlan(id, patch) {
      const data = buildUpdateData(patch);

      if (Object.keys(data).length === 0) {
        return await this.getPlanById(id);
      }

      try {
        const record = await client.travelPlan.update({
          where: {
            id,
          },
          data,
          select: travelPlanSelect,
        });

        return mapRecordToPersistedTravelPlan(record);
      } catch (error) {
        if (isPrismaNotFoundError(error)) {
          return null;
        }

        throw error;
      }
    },
    async deletePlan(id) {
      try {
        const record = await client.travelPlan.delete({
          where: {
            id,
          },
          select: travelPlanSelect,
        });

        return mapRecordToPersistedTravelPlan(record);
      } catch (error) {
        if (isPrismaNotFoundError(error)) {
          return null;
        }

        throw error;
      }
    },
  };
}

export const travelPlanRepository = createTravelPlanRepository();
