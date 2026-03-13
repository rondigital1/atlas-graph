import { describe, expect, it } from "vitest";

import {
  GenerationRunStatus,
  PlannerRunStatus,
  TravelPlanStatus,
  ToolExecutionStatus,
  createPrismaClient,
  getDatabaseHealth,
  plannerRunRepository,
  prisma,
} from "./index";

describe("db package", () => {
  it("exposes prisma wiring without forcing a connection on import", () => {
    process.env["DATABASE_URL"] ??=
      "postgresql://postgres:postgres@localhost:5433/atlas_graph?schema=public";

    expect(GenerationRunStatus.pending).toBe("pending");
    expect(PlannerRunStatus.PENDING).toBe("PENDING");
    expect(TravelPlanStatus.DRAFT).toBe("DRAFT");
    expect(ToolExecutionStatus.PARTIAL).toBe("PARTIAL");
    expect(prisma).toBeDefined();
    expect(prisma.generationRun).toBeDefined();
    expect(prisma.itineraryVersion).toBeDefined();
    expect(prisma.travelPlan).toBeDefined();
    expect(createPrismaClient).toBeTypeOf("function");
    expect(getDatabaseHealth).toBeTypeOf("function");
    expect(plannerRunRepository.create).toBeTypeOf("function");
    expect(plannerRunRepository.listRecentRuns).toBeTypeOf("function");
    expect(plannerRunRepository.findDetailById).toBeTypeOf("function");
  });
});
