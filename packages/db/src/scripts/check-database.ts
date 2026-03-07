import "dotenv/config";

import { disconnectPrismaClient, getDatabaseHealth } from "../index";

async function main(): Promise<void> {
  const result = await getDatabaseHealth();

  if (!result.ok) {
    console.error(
      `Database check failed: ${result.message ?? "Unknown error"}`,
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `Database check succeeded in ${result.latencyMs}ms at ${result.checkedAt}.`,
  );
}

main()
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown database check error");
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectPrismaClient();
  });
