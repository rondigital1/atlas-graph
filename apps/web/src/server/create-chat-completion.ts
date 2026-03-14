import OpenAI from "openai";

import { getMockChatResponse } from "./chat-mock-responses";

interface ChatCompletionMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function hasApiKey(): boolean {
  const key = process.env["OPENAI_API_KEY"];
  return typeof key === "string" && key.trim().length > 0;
}

function isDevMode(): boolean {
  if (process.env["ATLASGRAPH_USE_DEV_PLANNER"] === "true") {
    return true;
  }

  if (
    process.env["ATLASGRAPH_USE_DEV_PLANNER"] !== "false" &&
    process.env["NODE_ENV"] !== "production" &&
    !hasApiKey()
  ) {
    return true;
  }

  return false;
}

function createMockStream(
  destination: string | null,
): ReadableStream<Uint8Array> {
  const text = getMockChatResponse(destination);
  const encoder = new TextEncoder();

  let index = 0;

  return new ReadableStream({
    async pull(controller) {
      if (index >= text.length) {
        controller.close();
        return;
      }

      const chunkSize = Math.min(3 + Math.floor(Math.random() * 5), text.length - index);
      const chunk = text.slice(index, index + chunkSize);
      index += chunkSize;

      controller.enqueue(encoder.encode(chunk));
      await new Promise((r) => setTimeout(r, 20));
    },
  });
}

function createOpenAIStream(
  messages: ChatCompletionMessage[],
): ReadableStream<Uint8Array> {
  const client = new OpenAI();
  const model = process.env["ATLASGRAPH_OPENAI_MODEL"] ?? "gpt-4.1-mini";
  const encoder = new TextEncoder();

  let streamPromise: Promise<AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>> | null = null;
  let iterator: AsyncIterator<OpenAI.Chat.Completions.ChatCompletionChunk> | null = null;

  return new ReadableStream({
    async start() {
      streamPromise = client.chat.completions.create({
        model,
        stream: true,
        messages,
      }) as Promise<AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>>;
    },
    async pull(controller) {
      try {
        if (!iterator) {
          const stream = await streamPromise!;
          iterator = stream[Symbol.asyncIterator]();
        }

        const { done, value } = await iterator.next();

        if (done) {
          controller.close();
          return;
        }

        const text = value.choices[0]?.delta?.content;
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

export function createChatStream(
  systemPrompt: string,
  userMessages: { role: "user" | "assistant"; content: string }[],
  destination: string | null,
): ReadableStream<Uint8Array> {
  if (isDevMode()) {
    return createMockStream(destination);
  }

  const messages: ChatCompletionMessage[] = [
    { role: "system", content: systemPrompt },
    ...userMessages,
  ];

  return createOpenAIStream(messages);
}
