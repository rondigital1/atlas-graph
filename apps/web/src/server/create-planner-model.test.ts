import {
  DevelopmentPlannerModel,
  LangChainPlannerModel,
  PLANNER_PROMPT_VERSION,
} from "@atlas-graph/agent";
import { afterEach, describe, expect, it, vi } from "vitest";

const chatOpenAIConstructor = vi.fn();

vi.mock("@langchain/openai", () => {
  class MockChatOpenAI {
    public constructor(config: Record<string, unknown>) {
      chatOpenAIConstructor(config);
    }
  }

  return {
    ChatOpenAI: MockChatOpenAI,
  };
});

import {
  createPlannerMetadata,
  createPlannerModel,
} from "./create-planner-model";

describe("createPlannerModel", () => {
  afterEach(() => {
    chatOpenAIConstructor.mockReset();
  });

  it("returns the development planner model when explicitly enabled", () => {
    const result = createPlannerModel({
      ATLASGRAPH_USE_DEV_PLANNER: "true",
      OPENAI_API_KEY: "",
    });

    expect(result).toBeInstanceOf(DevelopmentPlannerModel);
    expect(chatOpenAIConstructor).not.toHaveBeenCalled();
  });

  it("falls back to the development planner in non-production when no API key is configured", () => {
    const result = createPlannerModel({
      NODE_ENV: "development",
      OPENAI_API_KEY: "",
    });

    expect(result).toBeInstanceOf(DevelopmentPlannerModel);
    expect(chatOpenAIConstructor).not.toHaveBeenCalled();
  });

  it("throws a clear error when the real planner path is selected without an API key", () => {
    expect(() => {
      createPlannerModel({
        ATLASGRAPH_USE_DEV_PLANNER: "false",
      });
    }).toThrow(
      "OPENAI_API_KEY is required when ATLASGRAPH_USE_DEV_PLANNER is not true."
    );
  });

  it("throws in production when no API key is configured", () => {
    expect(() => {
      createPlannerModel({
        NODE_ENV: "production",
      });
    }).toThrow(
      "OPENAI_API_KEY is required when ATLASGRAPH_USE_DEV_PLANNER is not true."
    );
  });

  it("returns the LangChain planner model with a sane default model name", () => {
    const result = createPlannerModel({
      ATLASGRAPH_USE_DEV_PLANNER: "false",
      OPENAI_API_KEY: "test-key",
    });

    expect(result).toBeInstanceOf(LangChainPlannerModel);
    expect(chatOpenAIConstructor).toHaveBeenCalledWith({
      apiKey: "test-key",
      model: "gpt-4.1-mini",
      temperature: 0,
    });
  });

  it("uses the explicit planner model override when provided", () => {
    createPlannerModel({
      OPENAI_API_KEY: "test-key",
      ATLASGRAPH_OPENAI_MODEL: "gpt-4o-mini",
    });

    expect(chatOpenAIConstructor).toHaveBeenCalledWith({
      apiKey: "test-key",
      model: "gpt-4o-mini",
      temperature: 0,
    });
  });

  it("creates planner metadata that matches the configured runtime", () => {
    expect(
      createPlannerMetadata({
        OPENAI_API_KEY: "test-key",
        ATLASGRAPH_OPENAI_MODEL: "gpt-4o-mini",
      })
    ).toEqual({
      provider: "openai",
      model: "gpt-4o-mini",
      version: PLANNER_PROMPT_VERSION,
    });

    expect(
      createPlannerMetadata({
        ATLASGRAPH_USE_DEV_PLANNER: "true",
      })
    ).toEqual({
      provider: "development",
      model: "development-planner",
      version: PLANNER_PROMPT_VERSION,
    });

    expect(
      createPlannerMetadata({
        NODE_ENV: "development",
      })
    ).toEqual({
      provider: "development",
      model: "development-planner",
      version: PLANNER_PROMPT_VERSION,
    });
  });
});
