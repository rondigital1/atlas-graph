import type { Prisma, PrismaClient } from "../../generated/prisma/client";

import { prisma } from "../client/index";

export interface PlannerRunRepository {
  create(
    args: Prisma.PlannerRunCreateArgs,
  ): ReturnType<PrismaClient["plannerRun"]["create"]>;
  findById(
    id: string,
    args?: Omit<Prisma.PlannerRunFindUniqueArgs, "where">,
  ): ReturnType<PrismaClient["plannerRun"]["findUnique"]>;
  findByRequestId(
    requestId: string,
    args?: Omit<Prisma.PlannerRunFindUniqueArgs, "where">,
  ): ReturnType<PrismaClient["plannerRun"]["findUnique"]>;
}

export function createPlannerRunRepository(
  client: PrismaClient = prisma,
): PlannerRunRepository {
  return {
    create(args) {
      return client.plannerRun.create(args);
    },
    findById(id, args = {}) {
      return client.plannerRun.findUnique({
        ...args,
        where: {
          id,
        },
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
  };
}

export const plannerRunRepository = createPlannerRunRepository();
