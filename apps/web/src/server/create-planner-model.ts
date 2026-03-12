import {
  DevelopmentPlannerModel,
  LangChainPlannerModel,
} from "@atlas-graph/agent";
import type { PlannerModel } from "@atlas-graph/agent";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

function blankStringToUndefined(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  if (value.trim().length === 0) {
    return undefined;
  }

  return value;
}

const plannerModelEnvSchema = z
  .object({
    ATLASGRAPH_USE_DEV_PLANNER: z.enum(["true", "false"]).optional(),
    ATLASGRAPH_OPENAI_MODEL: z.preprocess(
      blankStringToUndefined,
      z.string().min(1).optional()
    ),
    OPENAI_API_KEY: z.preprocess(
      blankStringToUndefined,
      z.string().min(1).optional()
    ),
  })
  .strip();

const DEFAULT_OPENAI_PLANNER_MODEL = "gpt-4.1-mini";
type PlannerModelEnvironment = Record<string, string | undefined>;

export interface CreateLangChainPlannerModelInput {
  apiKey: string;
  modelName?: string;
}

export function createDevelopmentPlannerModel(): PlannerModel {
  return new DevelopmentPlannerModel();
}

export function createLangChainPlannerModel(
  input: CreateLangChainPlannerModelInput
): PlannerModel {
  return new LangChainPlannerModel(
    new ChatOpenAI({
      apiKey: input.apiKey,
      model: input.modelName ?? DEFAULT_OPENAI_PLANNER_MODEL,
      temperature: 0,
    })
  );
}

export function createPlannerModel(
  environment: PlannerModelEnvironment = process.env
): PlannerModel {
  const parsedEnvironment = plannerModelEnvSchema.parse(environment);

  if (parsedEnvironment.ATLASGRAPH_USE_DEV_PLANNER === "true") {
    return createDevelopmentPlannerModel();
  }

  if (!parsedEnvironment.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is required when ATLASGRAPH_USE_DEV_PLANNER is not true."
    );
  }

  return createLangChainPlannerModel({
    apiKey: parsedEnvironment.OPENAI_API_KEY,
    modelName: parsedEnvironment.ATLASGRAPH_OPENAI_MODEL,
  });
}
