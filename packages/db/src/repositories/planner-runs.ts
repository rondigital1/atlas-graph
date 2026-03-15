import type { Prisma, PrismaClient } from "../../generated/prisma/client";

import { prisma } from "../client/index";

export const plannerRunSummarySelect = {
  id: true,
  status: true,
  requestId: true,
  destination: true,
  startDate: true,
  endDate: true,
  budget: true,
  travelStyle: true,
  groupType: true,
  modelName: true,
  promptVersion: true,
  saved: true,
  name: true,
  startedAt: true,
  completedAt: true,
  createdAt: true,
} satisfies Prisma.PlannerRunSelect;

export const plannerRunDetailSelect = {
  ...plannerRunSummarySelect,
  orchestratorVersion: true,
  updatedAt: true,
  input: {
    select: {
      id: true,
      plannerRunId: true,
      payload: true,
      createdAt: true,
    },
  },
  toolResults: {
    select: {
      id: true,
      plannerRunId: true,
      toolName: true,
      toolCategory: true,
      sequence: true,
      status: true,
      provider: true,
      latencyMs: true,
      payload: true,
      createdAt: true,
    },
    orderBy: {
      sequence: "asc",
    },
  },
  output: {
    select: {
      id: true,
      plannerRunId: true,
      outputFormat: true,
      payload: true,
      createdAt: true,
    },
  },
  errors: {
    select: {
      id: true,
      plannerRunId: true,
      errorType: true,
      stepName: true,
      message: true,
      details: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  },
} satisfies Prisma.PlannerRunSelect;

export type PlannerRunSummaryRecord = Prisma.PlannerRunGetPayload<{
  select: typeof plannerRunSummarySelect;
}>;

export type PlannerRunDetailRecord = Prisma.PlannerRunGetPayload<{
  select: typeof plannerRunDetailSelect;
}>;

export interface PlannerRunRepository {
  create(
    args: Prisma.PlannerRunCreateArgs,
  ): ReturnType<PrismaClient["plannerRun"]["create"]>;
  listRecentRuns(
    args?: {
      take?: number;
    },
  ): Promise<PlannerRunSummaryRecord[]>;
  listSavedRuns(
    args?: {
      take?: number;
    },
  ): Promise<PlannerRunSummaryRecord[]>;
  saveRun(
    id: string,
    name: string,
  ): Promise<void>;
  unsaveRun(id: string): Promise<void>;
  findById(
    id: string,
    args?: Omit<Prisma.PlannerRunFindUniqueArgs, "where">,
  ): ReturnType<PrismaClient["plannerRun"]["findUnique"]>;
  findDetailById(id: string): Promise<PlannerRunDetailRecord | null>;
  findByRequestId(
    requestId: string,
    args?: Omit<Prisma.PlannerRunFindUniqueArgs, "where">,
  ): ReturnType<PrismaClient["plannerRun"]["findUnique"]>;
  deleteById(id: string): Promise<void>;
}

export function createPlannerRunRepository(
  client: PrismaClient = prisma,
): PlannerRunRepository {
  return {
    create(args) {
      return client.plannerRun.create(args);
    },
    listRecentRuns(args = {}) {
      return client.plannerRun.findMany({
        take: args.take ?? 50,
        orderBy: [
          {
            createdAt: "desc",
          },
          {
            id: "desc",
          },
        ],
        select: plannerRunSummarySelect,
      });
    },
    listSavedRuns(args = {}) {
      return client.plannerRun.findMany({
        where: { saved: true },
        take: args.take ?? 50,
        orderBy: [
          {
            createdAt: "desc",
          },
          {
            id: "desc",
          },
        ],
        select: plannerRunSummarySelect,
      });
    },
    async saveRun(id, name) {
      await client.plannerRun.update({
        where: { id },
        data: { saved: true, name },
      });
    },
    async unsaveRun(id) {
      await client.plannerRun.update({
        where: { id },
        data: { saved: false, name: null },
      });
    },
    findById(id, args = {}) {
      return client.plannerRun.findUnique({
        ...args,
        where: {
          id,
        },
      });
    },
    findDetailById(id) {
      return client.plannerRun.findUnique({
        where: {
          id,
        },
        select: plannerRunDetailSelect,
      });
    },
    findByRequestId(requestId, args = {}) {
      return client.plannerRun.findUnique({
        ...args,
        where: {
          requestId,
        },
      });
    },
    async deleteById(id) {
      await client.plannerRun.delete({ where: { id } });
    },
  };
}

export const plannerRunRepository = createPlannerRunRepository();
