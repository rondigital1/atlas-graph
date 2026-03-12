"use client";

import { useState } from "react";
import type { FlightOption } from "../../lib/types";
import { outboundFlights, returnFlights } from "../../lib/mock/itinerary-data";

interface FlightCardProps {
  flight: FlightOption;
  isSelected: boolean;
  onSelect: () => void;
}

function FlightCard({ flight, isSelected, onSelect }: FlightCardProps) {
  const isChecking = flight.status === "checking";

  if (isChecking) {
    return (
      <div className="relative w-full rounded-lg border border-dashed border-border-muted bg-surface p-4 opacity-70">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="animate-spin text-muted-foreground"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">
              {flight.airline}
            </div>
            <div className="text-xs text-muted-foreground">
              Checking availability…
            </div>
          </div>
          <div className="text-right">
            <div className="h-5 w-16 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      aria-label={`${flight.airline}, ${flight.departure} to ${flight.arrival}, $${flight.price}${flight.isRecommended ? ", Recommended" : ""}`}
      className={`relative w-full rounded-lg border p-4 text-left transition-all ${
        flight.isRecommended ? "mt-3" : ""
      } ${
        isSelected
          ? "border-primary bg-primary-subtle"
          : "border-border-muted bg-surface hover:border-border"
      }`}
    >
      {flight.isRecommended && (
        <div
          aria-hidden="true"
          className="absolute -top-2 right-3 rounded bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground"
        >
          Recommended
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Selection indicator */}
        <div
          aria-hidden="true"
          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
            isSelected
              ? "border-primary bg-primary"
              : "border-muted-foreground bg-transparent"
          }`}
        >
          {isSelected && (
            <svg
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary-foreground"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </div>

        <div className="flex flex-1 items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {flight.airline}
              </span>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {flight.cabinClass}
              </span>
            </div>

            <div className="mb-2 flex items-center gap-3">
              <span className="text-sm text-foreground">{flight.departure}</span>
              <div className="flex items-center gap-1.5 text-subtle">
                <div aria-hidden="true" className="h-px w-4 bg-border" />
                {flight.layovers === 0 ? (
                  <span className="text-[10px] text-success">Direct</span>
                ) : (
                  <span className="text-[10px]">
                    {flight.layovers} stop ({flight.layoverCities?.join(", ")})
                  </span>
                )}
                <div aria-hidden="true" className="h-px w-4 bg-border" />
              </div>
              <span className="text-sm text-foreground">{flight.arrival}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{flight.duration}</span>
              <span aria-hidden="true" className="text-subtle">
                |
              </span>
              <span className="flex items-center gap-1">
                <svg
                  aria-hidden="true"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-warning"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {flight.comfortScore}
              </span>
            </div>

            {flight.reason && (
              <p className="mt-2 text-xs text-muted-foreground">{flight.reason}</p>
            )}
          </div>

          <div className="text-right">
            <div className="text-lg font-semibold text-foreground">
              ${flight.price}
            </div>
            <div className="text-xs text-muted-foreground">per person</div>
          </div>
        </div>
      </div>
    </button>
  );
}

type OptimizeMode = "balanced" | "cheapest" | "shortest" | "comfort";

export function FlightsSection() {
  const [selectedOutbound, setSelectedOutbound] = useState("out-1");
  const [selectedReturn, setSelectedReturn] = useState("ret-1");
  const [optimizeFor, setOptimizeFor] = useState<OptimizeMode>("balanced");

  return (
    <div className="rounded-lg border border-border-muted bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </svg>
          <h3 className="text-base font-semibold text-foreground">Flights</h3>
        </div>

        <div
          role="group"
          aria-label="Optimize flights for"
          className="flex items-center gap-1 rounded-md bg-muted p-0.5"
        >
          {(["balanced", "cheapest", "shortest", "comfort"] as const).map(
            (opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setOptimizeFor(opt)}
                aria-pressed={optimizeFor === opt}
                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                  optimizeFor === opt
                    ? "bg-surface-elevated text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Outbound */}
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Outbound
          </span>
          <span className="text-xs text-subtle">JFK to BCN - Oct 15</span>
        </div>
        <div className="space-y-2">
          {outboundFlights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              isSelected={selectedOutbound === flight.id}
              onSelect={() => setSelectedOutbound(flight.id)}
            />
          ))}
        </div>
      </div>

      {/* Return */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Return
          </span>
          <span className="text-xs text-subtle">NCE to JFK - Oct 24</span>
        </div>
        <div className="space-y-2">
          {returnFlights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              isSelected={selectedReturn === flight.id}
              onSelect={() => setSelectedReturn(flight.id)}
            />
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 flex items-center justify-between border-t border-border-muted pt-4">
        <div className="text-sm text-muted-foreground">
          Total flights for 2 travelers
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-foreground">$2,450</div>
          <div className="text-xs text-muted-foreground">all inclusive</div>
        </div>
      </div>
    </div>
  );
}
