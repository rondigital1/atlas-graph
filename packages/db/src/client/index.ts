import { PrismaPg } from "@prisma/adapter-pg";
import { parseAtlasEnv } from "@atlas-graph/config";

import { PrismaClient } from "../../generated/prisma/client";

let prismaClientSingleton: PrismaClient | undefined;

declare global {
  var __atlasGraphPrisma__: PrismaClient | undefined;
}

function createPrismaAdapter(): PrismaPg {
  const { DATABASE_URL } = parseAtlasEnv();

  return new PrismaPg({
    connectionString: DATABASE_URL,
  });
}

export function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    adapter: createPrismaAdapter(),
  });
}

export function getPrismaClient(): PrismaClient {
  if (
    process.env["NODE_ENV"] !== "production" &&
    globalThis.__atlasGraphPrisma__
  ) {
    return globalThis.__atlasGraphPrisma__;
  }

  if (prismaClientSingleton) {
    return prismaClientSingleton;
  }

  const client = createPrismaClient();
  prismaClientSingleton = client;

  if (process.env["NODE_ENV"] !== "production") {
    globalThis.__atlasGraphPrisma__ = client;
  }

  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property, client);

    if (typeof value === "function") {
      return value.bind(client);
    }

    return value;
  },
});

export async function disconnectPrismaClient(): Promise<void> {
  if (!prismaClientSingleton && !globalThis.__atlasGraphPrisma__) {
    return;
  }

  const client = globalThis.__atlasGraphPrisma__ ?? prismaClientSingleton;

  if (!client) {
    return;
  }

  await client.$disconnect();

  prismaClientSingleton = undefined;
  globalThis.__atlasGraphPrisma__ = undefined;
}
