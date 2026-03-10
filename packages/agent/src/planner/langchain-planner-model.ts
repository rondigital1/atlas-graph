import type { PlannerModel } from "./planner-types.js";

/** Minimal interface matching LangChain's BaseChatModel.invoke() signature. */
interface ChatModel {
  invoke(
    messages: [role: string, content: string][],
  ): Promise<{ content: string | unknown[] }>;
}

export class LangChainPlannerModel implements PlannerModel {
  private readonly model: ChatModel;

  public constructor(model: ChatModel) {
    this.model = model;
  }

  public async generate(input: {
    systemPrompt: string;
    userPrompt: string;
  }): Promise<{ text: string }> {
    const response = await this.model.invoke([
      ["system", input.systemPrompt],
      ["user", input.userPrompt],
    ]);

    const text =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    return { text };
  }
}