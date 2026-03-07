import { describe, expect, it } from "vitest";

import {
  createPrismaClient,
  databaseClientStatus,
  repositoryStatus,
} from "./index";

describe("db package", () => {
  it("exposes placeholder database wiring", () => {
    const client = createPrismaClient();

    expect(client).toBeDefined();
    expect(databaseClientStatus.generated).toBe(false);
    expect(repositoryStatus.implemented).toBe(false);
  });
});
