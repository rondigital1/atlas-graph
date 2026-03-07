export interface PrismaClientLike {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
}

class PlaceholderPrismaClient implements PrismaClientLike {
  public async $connect(): Promise<void> {
    throw new Error(
      "Prisma client generation is reserved for a later ticket. Run `pnpm prisma:generate` after the real schema and runtime wiring are implemented.",
    );
  }

  public async $disconnect(): Promise<void> {
    return Promise.resolve();
  }
}

declare global {
  var __atlasGraphPrisma__: PrismaClientLike | undefined;
}

export const databaseClientStatus = {
  generated: false,
  readyForRuntimeUse: false,
  generatedClientOutput: "packages/db/generated/prisma",
} as const;

export function createPrismaClient(): PrismaClientLike {
  return new PlaceholderPrismaClient();
}

export function getPrismaClient(): PrismaClientLike {
  if (globalThis.__atlasGraphPrisma__) {
    return globalThis.__atlasGraphPrisma__;
  }

  const client = createPrismaClient();

  if (process.env["NODE_ENV"] !== "production") {
    globalThis.__atlasGraphPrisma__ = client;
  }

  return client;
}
