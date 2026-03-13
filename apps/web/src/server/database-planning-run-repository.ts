import {
  buildPlanningRunOutputSummary,
  type CreatePlanningRunInput,
  type MarkPlanningRunFailedInput,
  type MarkPlanningRunSucceededInput,
  type PlanningRunListOptions,
  type PlanningRunRepository,
} from "@atlas-graph/agent";
import { PlanningRunSchema, TripPlanSchema, TripRequestSchema } from "@atlas-graph/core/schemas";
import type { PlanningRun, PlanningRunStatus, TripPlan, TripRequest } from "@atlas-graph/core/types";
import { PlannerRunStatus, Prisma, prisma, type PrismaClient } from "@atlas-graph/db";

const UNKNOWN_PLANNER_PROVIDER = "unknown-provider";
const UNKNOWN_PLANNER_MODEL = "unknown-model";
const UNKNOWN_PLANNER_VERSION = "unknown-version";

interface PersistedInputMetadata {
  plannerProvider: string;
  sessionId: string | null;
  userId: string | null;
}

interface PersistedInputEnvelope {
  inputSnapshot: TripRequest;
  metadata?: PersistedInputMetadata;
  normalizedInput: TripRequest;
}

interface PersistedPlannerRunRecord {
  budget: string | null;
  completedAt: Date | null;
  createdAt: Date;
  destination: string | null;
  endDate: Date | null;
  errors: Array<{
    createdAt: Date;
    details: unknown;
    errorType: string | null;
    message: string;
  }>;
  groupType: string | null;
  id: string;
  input: {
    createdAt: Date;
    payload: unknown;
  } | null;
  modelName: string | null;
  output: {
    createdAt: Date;
    outputFormat: string | null;
    payload: unknown;
  } | null;
  promptVersion: string | null;
  requestId: string | null;
  startDate: Date | null;
  startedAt: Date | null;
  status: PlannerRunStatus;
  travelStyle: string | null;
  updatedAt: Date;
}

function mapStatusToPrisma(status: PlanningRunStatus): PlannerRunStatus {
  switch (status) {
    case "running":
      return PlannerRunStatus.RUNNING;
    case "succeeded":
      return PlannerRunStatus.SUCCEEDED;
    case "failed":
      return PlannerRunStatus.FAILED;
    case "partial":
      return PlannerRunStatus.RUNNING;
  }
}

function mapStatusFromPrisma(status: PlannerRunStatus): PlanningRunStatus {
  switch (status) {
    case PlannerRunStatus.PENDING:
    case PlannerRunStatus.RUNNING:
      return "running";
    case PlannerRunStatus.SUCCEEDED:
      return "succeeded";
    case PlannerRunStatus.FAILED:
      return "failed";
  }
}

function buildPersistedInputPayload(
  input: CreatePlanningRunInput
): PersistedInputEnvelope {
  return {
    inputSnapshot: TripRequestSchema.parse(input.inputSnapshot),
    normalizedInput: TripRequestSchema.parse(input.normalizedInput),
    metadata: {
      plannerProvider: input.plannerProvider,
      sessionId: input.sessionId,
      userId: input.userId,
    },
  };
}

function parsePersistedInputPayload(payload: unknown): PersistedInputEnvelope {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    const request = TripRequestSchema.parse(payload);

    return {
      inputSnapshot: request,
      normalizedInput: request,
    };
  }

  const record = payload as Record<string, unknown>;
  const inputSnapshot = TripRequestSchema.parse(
    record["inputSnapshot"] ?? payload
  );
  const normalizedInput = TripRequestSchema.parse(
    record["normalizedInput"] ?? record["inputSnapshot"] ?? payload
  );
  const metadataValue = record["metadata"];
  let metadata: PersistedInputMetadata | undefined;

  if (
    metadataValue &&
    typeof metadataValue === "object" &&
    !Array.isArray(metadataValue)
  ) {
    const metadataRecord = metadataValue as Record<string, unknown>;

    metadata = {
      plannerProvider:
        typeof metadataRecord["plannerProvider"] === "string" &&
        metadataRecord["plannerProvider"].trim().length > 0
          ? metadataRecord["plannerProvider"]
          : UNKNOWN_PLANNER_PROVIDER,
      sessionId:
        typeof metadataRecord["sessionId"] === "string"
          ? metadataRecord["sessionId"]
          : metadataRecord["sessionId"] === null
            ? null
            : null,
      userId:
        typeof metadataRecord["userId"] === "string"
          ? metadataRecord["userId"]
          : metadataRecord["userId"] === null
            ? null
            : null,
    };
  }

  return {
    inputSnapshot,
    normalizedInput,
    metadata,
  };
}

function parseOutputPlan(payload: unknown): TripPlan | null {
  const parsed = TripPlanSchema.safeParse(payload);

  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}

function toPrismaJsonValue(
  value: unknown
): Prisma.InputJsonValue | Prisma.JsonNullValueInput {
  if (value === null) {
    return Prisma.JsonNull;
  }

  return value as Prisma.InputJsonValue;
}

function buildPlanningRunFromRecord(record: PersistedPlannerRunRecord): PlanningRun {
  if (!record || !record.input) {
    throw new Error("Planner run record is missing its persisted input payload.");
  }

  const inputPayload = parsePersistedInputPayload(record.input.payload);
  const outputPlan = record.output ? parseOutputPlan(record.output.payload) : null;
  const firstError = record.errors[0] ?? null;

  return PlanningRunSchema.parse({
    id: record.id,
    userId: inputPayload.metadata?.userId ?? null,
    sessionId: inputPayload.metadata?.sessionId ?? null,
    requestId: record.requestId ?? record.id,
    status: mapStatusFromPrisma(record.status),
    inputSnapshot: inputPayload.inputSnapshot,
    normalizedInput: inputPayload.normalizedInput,
    plannerProvider:
      inputPayload.metadata?.plannerProvider ?? UNKNOWN_PLANNER_PROVIDER,
    plannerModel: record.modelName ?? UNKNOWN_PLANNER_MODEL,
    plannerVersion: record.promptVersion ?? UNKNOWN_PLANNER_VERSION,
    outputPlan,
    outputSummary: outputPlan ? buildPlanningRunOutputSummary(outputPlan) : null,
    errorCode: firstError?.errorType ?? null,
    errorMessage: firstError?.message ?? null,
    errorDetails: firstError?.details ?? null,
    startedAt: record.startedAt,
    completedAt: record.completedAt,
    durationMs:
      record.startedAt && record.completedAt
        ? record.completedAt.getTime() - record.startedAt.getTime()
        : null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });
}

function createDetailInclude() {
  return {
    input: true,
    output: true,
    errors: {
      orderBy: {
        createdAt: "asc" as const,
      },
    },
  };
}

export class DatabasePlanningRunRepository implements PlanningRunRepository {
  private readonly client: PrismaClient;

  public constructor(client: PrismaClient = prisma) {
    this.client = client;
  }

  public async createRun(input: CreatePlanningRunInput): Promise<PlanningRun> {
    await this.client.plannerRun.create({
      data: {
        id: input.id,
        status: PlannerRunStatus.RUNNING,
        requestId: input.requestId,
        destination: input.normalizedInput.destination,
        startDate: new Date(`${input.normalizedInput.startDate}T00:00:00.000Z`),
        endDate: new Date(`${input.normalizedInput.endDate}T00:00:00.000Z`),
        budget: input.normalizedInput.budget,
        travelStyle: input.normalizedInput.travelStyle,
        groupType: input.normalizedInput.groupType,
        modelName: input.plannerModel,
        promptVersion: input.plannerVersion,
        startedAt: input.startedAt,
        createdAt: input.createdAt,
        input: {
          create: {
            payload: toPrismaJsonValue(buildPersistedInputPayload(input)),
          },
        },
      },
    });

    return await this.getRequiredRunById(input.id);
  }

  public async markSucceeded(
    input: MarkPlanningRunSucceededInput
  ): Promise<PlanningRun> {
    await this.client.$transaction(async (transactionClient) => {
      await transactionClient.plannerRun.update({
        where: {
          id: input.id,
        },
        data: {
          status: PlannerRunStatus.SUCCEEDED,
          completedAt: input.completedAt,
        },
      });

      await transactionClient.plannerRunOutput.upsert({
        where: {
          plannerRunId: input.id,
        },
        create: {
          plannerRunId: input.id,
          outputFormat: "json",
          payload: toPrismaJsonValue(input.outputPlan),
        },
        update: {
          outputFormat: "json",
          payload: toPrismaJsonValue(input.outputPlan),
        },
      });

      await transactionClient.plannerRunToolResult.deleteMany({
        where: {
          plannerRunId: input.id,
        },
      });

      if (input.toolResults.length > 0) {
        await transactionClient.plannerRunToolResult.createMany({
          data: input.toolResults.map((toolResult, index) => {
            return {
              plannerRunId: input.id,
              toolName: toolResult.toolName,
              toolCategory: toolResult.toolCategory ?? null,
              sequence: index + 1,
              status: toolResult.status,
              provider: toolResult.provider ?? null,
              latencyMs: toolResult.latencyMs ?? null,
              payload: toPrismaJsonValue(toolResult.payload),
            };
          }),
        });
      }
    });

    return await this.getRequiredRunById(input.id);
  }

  public async markFailed(
    input: MarkPlanningRunFailedInput
  ): Promise<PlanningRun> {
    await this.client.$transaction(async (transactionClient) => {
      await transactionClient.plannerRun.update({
        where: {
          id: input.id,
        },
        data: {
          status: PlannerRunStatus.FAILED,
          completedAt: input.completedAt,
        },
      });

      await transactionClient.plannerRunError.create({
        data: {
          plannerRunId: input.id,
          errorType: input.errorCode,
          stepName: "plan-trip",
          message: input.errorMessage,
          details: toPrismaJsonValue(input.errorDetails),
        },
      });
    });

    return await this.getRequiredRunById(input.id);
  }

  public async getRunById(id: string): Promise<PlanningRun | null> {
    const record = await this.client.plannerRun.findUnique({
      where: {
        id,
      },
      include: createDetailInclude(),
    });

    if (!record) {
      return null;
    }

    return buildPlanningRunFromRecord(record);
  }

  public async listRuns(
    options: PlanningRunListOptions = {}
  ): Promise<PlanningRun[]> {
    const records = await this.client.plannerRun.findMany({
      where: {
        requestId: options.requestId,
        status:
          options.status === undefined ? undefined : mapStatusToPrisma(options.status),
      },
      include: createDetailInclude(),
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ],
    });

    const filteredRuns = records
      .map((record) => {
        return buildPlanningRunFromRecord(record);
      })
      .filter((run) => {
        if (options.userId !== undefined && run.userId !== options.userId) {
          return false;
        }

        if (options.sessionId !== undefined && run.sessionId !== options.sessionId) {
          return false;
        }

        return true;
      });

    const limitedRuns =
      typeof options.limit === "number"
        ? filteredRuns.slice(0, options.limit)
        : filteredRuns;

    return limitedRuns;
  }

  private async getRequiredRunById(id: string): Promise<PlanningRun> {
    const run = await this.getRunById(id);

    if (!run) {
      throw new Error(`Planning run not found after persistence: ${id}`);
    }

    return run;
  }
}

export function createDatabasePlanningRunRepository(
  client: PrismaClient = prisma
): PlanningRunRepository {
  return new DatabasePlanningRunRepository(client);
}
