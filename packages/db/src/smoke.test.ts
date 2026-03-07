import { describe, expect, it } from "vitest";

import {
  PlannerRunStatus,
  createPrismaClient,
  getDatabaseHealth,
  plannerRunRepository,
  prisma,
} from "./index";

describe("db package", () => {
  it("exposes prisma wiring without forcing a connection on import", () => {
    expect(PlannerRunStatus.PENDING).toBe("PENDING");
    expect(prisma).toBeDefined();
    expect(createPrismaClient).toBeTypeOf("function");
    expect(getDatabaseHealth).toBeTypeOf("function");
    expect(plannerRunRepository.create).toBeTypeOf("function");
  });
});
