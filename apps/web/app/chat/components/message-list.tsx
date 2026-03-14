"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";

import type { ChatMessage } from "../../lib/types";

interface Props {
  messages: ChatMessage[];
  isStreaming: boolean;
  selectedDestination: string | null;
}

function renderMarkdown(text: string): React.ReactNode[] {
  const paragraphs = text.split(/\n\n+/);

  return paragraphs.map((paragraph, pi) => {
    const trimmed = paragraph.trim();
    if (!trimmed) {
      return null;
    }

    if (trimmed.startsWith("## ") || trimmed.startsWith("### ")) {
      const level = trimmed.startsWith("### ") ? 3 : 2;
      const content = trimmed.slice(level + 1);
      return (
        <p key={pi} className="mb-1 mt-3 text-sm font-semibold text-foreground first:mt-0">
          {formatInline(content)}
        </p>
      );
    }

    const lines = trimmed.split("\n");
    const isList = lines.every((l) => l.startsWith("- "));

    if (isList) {
      return (
        <ul key={pi} className="mb-2 space-y-0.5">
          {lines.map((line, li) => (
            <li key={li} className="flex gap-1.5 text-sm">
              <span className="mt-1.5 block h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />
              <span>{formatInline(line.slice(2))}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={pi} className="mb-2 text-sm">
        {formatInline(trimmed.replace(/\n/g, " "))}
      </p>
    );
  });
}

function formatInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    key += 1;

    if (token.startsWith("**")) {
      parts.push(
        <strong key={key} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code
          key={key}
          className="rounded bg-surface-elevated px-1 py-0.5 text-xs font-mono"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("*")) {
      parts.push(
        <em key={key}>{token.slice(1, -1)}</em>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 px-1 py-2">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
    </div>
  );
}

function EmptyState({ destination }: { destination: string | null }) {
  const suggestions = destination
    ? [
        `What should I pack for ${destination}?`,
        `What's the best local food to try?`,
        `Any tips for getting around?`,
        `Tell me about the culture and customs`,
      ]
    : [
        "Compare beach vs mountain destinations",
        "Best destinations for solo travel",
        "How to plan a 2-week Europe trip",
        "Budget travel tips for beginners",
      ];

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <MessageCircle size={24} className="text-primary" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">
        {destination ? `Ask about ${destination}` : "Travel Chat"}
      </h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        {destination
          ? "Ask me anything about your trip — tips, logistics, activities, and more."
          : "Select a trip or ask general travel questions."}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <span
            key={s}
            className="rounded-full border border-border-muted bg-surface px-3 py-1.5 text-xs text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MessageList({
  messages,
  isStreaming,
  selectedDestination,
}: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return <EmptyState destination={selectedDestination} />;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mx-auto max-w-2xl space-y-4">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  isUser
                    ? "bg-primary/15 text-foreground"
                    : "bg-surface-elevated text-foreground"
                }`}
              >
                {isUser ? (
                  <p className="text-sm">{message.content}</p>
                ) : message.content ? (
                  <div className="text-muted-foreground">
                    {renderMarkdown(message.content)}
                  </div>
                ) : (
                  <TypingIndicator />
                )}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
    </div>
  );
}
