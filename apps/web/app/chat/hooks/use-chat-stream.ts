import { useCallback, useRef, useState } from "react";

import type { ChatMessage } from "../../lib/types";

interface UseChatStreamOptions {
  tripId: string | null;
}

interface UseChatStreamReturn {
  messages: ChatMessage[];
  isStreaming: boolean;
  sendMessage: (content: string) => void;
  clearMessages: () => void;
}

let messageCounter = 0;
function nextId(): string {
  messageCounter += 1;
  return `msg-${messageCounter}-${Date.now()}`;
}

export function useChatStream({
  tripId,
}: UseChatStreamOptions): UseChatStreamReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const clearMessages = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setIsStreaming(false);
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isStreaming) {
        return;
      }

      const userMessage: ChatMessage = {
        id: nextId(),
        role: "user",
        content: trimmed,
      };

      const assistantMessage: ChatMessage = {
        id: nextId(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      const apiMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: userMessage.role, content: userMessage.content },
      ];

      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          ...(tripId ? { tripId } : {}),
        }),
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok || !response.body) {
            throw new Error("Chat request failed");
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let accumulated = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }

            accumulated += decoder.decode(value, { stream: true });
            const current = accumulated;

            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessage.id
                  ? { ...m, content: current }
                  : m
              )
            );
          }

          setIsStreaming(false);
        })
        .catch((error) => {
          if (error instanceof Error && error.name === "AbortError") {
            return;
          }

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? {
                    ...m,
                    content:
                      "Sorry, I couldn't process your request. Please try again.",
                  }
                : m
            )
          );
          setIsStreaming(false);
        });
    },
    [isStreaming, messages, tripId]
  );

  return { messages, isStreaming, sendMessage, clearMessages };
}
