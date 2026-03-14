"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ChatTripCardViewModel } from "../../lib/types";
import { useChatStream } from "../hooks/use-chat-stream";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { TripSelector } from "./trip-selector";

interface Props {
  trips: ChatTripCardViewModel[];
}

export function ChatPageShell({ trips }: Props) {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const prevTripId = useRef<string | null>(null);

  const { messages, isStreaming, sendMessage, clearMessages } = useChatStream({
    tripId: selectedTripId,
  });

  const handleSelectTrip = useCallback(
    (id: string | null) => {
      setSelectedTripId(id);
    },
    []
  );

  useEffect(() => {
    if (prevTripId.current !== selectedTripId) {
      clearMessages();
      prevTripId.current = selectedTripId;
    }
  }, [selectedTripId, clearMessages]);

  const selectedTrip = trips.find((t) => t.id === selectedTripId);
  const destination = selectedTrip?.destination ?? null;

  const placeholder = destination
    ? `Ask about your ${destination} trip...`
    : "Ask me anything about travel...";

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* Trip selector — sidebar on desktop, horizontal strip on mobile */}
      <div className="shrink-0 border-b border-border-muted lg:w-[300px] lg:border-b-0 lg:border-r">
        <div className="max-h-[200px] overflow-y-auto p-4 lg:max-h-none lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          {/* Mobile: horizontal scroll */}
          <div className="flex gap-3 overflow-x-auto pb-2 lg:hidden">
            <button
              type="button"
              onClick={() => handleSelectTrip(null)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                selectedTripId === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-elevated text-muted-foreground"
              }`}
            >
              General
            </button>
            {trips.map((trip) => (
              <button
                key={trip.id}
                type="button"
                onClick={() => handleSelectTrip(trip.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  selectedTripId === trip.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-elevated text-muted-foreground"
                }`}
              >
                {trip.countryFlag && `${trip.countryFlag} `}
                {trip.destination}
              </button>
            ))}
          </div>

          {/* Desktop: full card selector */}
          <div className="hidden lg:block">
            <TripSelector
              trips={trips}
              selectedTripId={selectedTripId}
              onSelect={handleSelectTrip}
            />
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex min-h-0 flex-1 flex-col">
        <MessageList
          messages={messages}
          isStreaming={isStreaming}
          selectedDestination={destination}
        />
        <ChatInput
          onSend={sendMessage}
          disabled={isStreaming}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
