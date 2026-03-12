import {
  DevelopmentPlannerModel,
  LangChainPlannerModel,
  PLANNER_PROMPT_VERSION,
} from "@atlas-graph/agent";
import type { PlannerMetadata, PlannerModel } from "@atlas-graph/agent";
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

interface PlannerRuntimeConfig {
  provider: string;
  modelName: string;
  apiKey?: string;
  useDevelopmentPlanner: boolean;
}

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

function resolvePlannerRuntimeConfig(
  environment: PlannerModelEnvironment = process.env
): PlannerRuntimeConfig {
  const parsedEnvironment = plannerModelEnvSchema.parse(environment);

  if (parsedEnvironment.ATLASGRAPH_USE_DEV_PLANNER === "true") {
    return {
      provider: "development",
      modelName: "development-planner",
      useDevelopmentPlanner: true,
    };
  }

  if (!parsedEnvironment.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is required when ATLASGRAPH_USE_DEV_PLANNER is not true."
    );
  }

  return {
    provider: "openai",
    modelName: parsedEnvironment.ATLASGRAPH_OPENAI_MODEL ?? DEFAULT_OPENAI_PLANNER_MODEL,
    apiKey: parsedEnvironment.OPENAI_API_KEY,
    useDevelopmentPlanner: false,
  };
}

export function createPlannerMetadata(
  environment: PlannerModelEnvironment = process.env
): PlannerMetadata {
  const runtimeConfig = resolvePlannerRuntimeConfig(environment);

  return {
    provider: runtimeConfig.provider,
    model: runtimeConfig.modelName,
    version: PLANNER_PROMPT_VERSION,
  };
}

export function createPlannerModel(
  environment: PlannerModelEnvironment = process.env
): PlannerModel {
  const runtimeConfig = resolvePlannerRuntimeConfig(environment);

  if (runtimeConfig.useDevelopmentPlanner) {
    return createDevelopmentPlannerModel();
  }

  return createLangChainPlannerModel({
    apiKey: runtimeConfig.apiKey!,
    modelName: runtimeConfig.modelName,
  });
}
