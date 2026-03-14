"use client";

import { Check, Sparkles } from "lucide-react";
import Image from "next/image";

import type { ChatTripCardViewModel } from "../../lib/types";

interface Props {
  trips: ChatTripCardViewModel[];
  selectedTripId: string | null;
  onSelect: (id: string | null) => void;
}

function GeneralChatOption({
  isSelected,
  onSelect,
}: {
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-xl border p-3 transition-all ${
        isSelected
          ? "border-primary bg-primary/10"
          : "border-border-muted bg-surface hover:border-border"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
        <Sparkles size={18} className="text-primary" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-foreground">General Chat</p>
        <p className="text-xs text-muted-foreground">
          Ask anything about travel
        </p>
      </div>
      {isSelected && <Check size={16} className="text-primary" />}
    </button>
  );
}

function TripCard({
  trip,
  isSelected,
  onSelect,
}: {
  trip: ChatTripCardViewModel;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full overflow-hidden rounded-xl border transition-all ${
        isSelected
          ? "border-primary ring-1 ring-primary"
          : "border-border-muted hover:border-border"
      }`}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={trip.backgroundUrl}
          alt={trip.destination}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="300px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {isSelected && (
          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
            <Check size={14} className="text-primary-foreground" />
          </div>
        )}
        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-left text-sm font-semibold text-white">
            {trip.countryFlag && (
              <span className="mr-1.5">{trip.countryFlag}</span>
            )}
            {trip.destination}
          </p>
          <p className="text-left text-xs text-white/70">{trip.tripDates}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 bg-surface px-3 py-2">
        {trip.budget && (
          <span className="rounded bg-surface-elevated px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {trip.budget}
          </span>
        )}
        {trip.travelStyle && (
          <span className="rounded bg-surface-elevated px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {trip.travelStyle}
          </span>
        )}
      </div>
    </button>
  );
}

export function TripSelector({ trips, selectedTripId, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">Your Trips</h2>
      <GeneralChatOption
        isSelected={selectedTripId === null}
        onSelect={() => onSelect(null)}
      />
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          isSelected={selectedTripId === trip.id}
          onSelect={() => onSelect(trip.id)}
        />
      ))}
      {trips.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No saved trips yet. Create a trip to chat about it!
        </p>
      )}
    </div>
  );
}
