import type { PrismaClient } from "../generated/prisma/client";

import { prisma } from "./client/index";

export interface DatabaseHealthResult {
  readonly checkedAt: string;
  readonly latencyMs: number;
  readonly ok: boolean;
  readonly message?: string;
}

export async function assertDatabaseConnection(
  client: PrismaClient = prisma,
): Promise<void> {
  await client.$queryRawUnsafe("SELECT 1");
}

export async function getDatabaseHealth(
  client: PrismaClient = prisma,
): Promise<DatabaseHealthResult> {
  const startedAt = Date.now();

  try {
    await assertDatabaseConnection(client);

    return {
      checkedAt: new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
      ok: true,
    };
  } catch (error) {
    return {
      checkedAt: new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
      message:
        error instanceof Error ? error.message : "Unknown database error",
      ok: false,
    };
  }
}
