import { buildPlannerPromptInput } from "./build-planner-prompt-input";
import { PLANNER_PROMPT_VERSION } from "./planner-prompt-version";
import { PLANNER_SYSTEM_PROMPT } from "./planner-system-prompt";

export * from "./build-planner-prompt-input";
export * from "./planner-prompt-version";
export * from "./planner-system-prompt";

export const promptRegistry = {
  planner: {
    buildPromptInput: buildPlannerPromptInput,
    systemPrompt: PLANNER_SYSTEM_PROMPT,
    version: PLANNER_PROMPT_VERSION,
  },
} as const;
