"use client";

import { useState } from "react";

interface FlightOption {
  id: string;
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  layovers: number;
  layoverCities?: string[];
  price: number;
  cabinClass: string;
  comfortScore: number;
  isRecommended?: boolean;
  reason?: string;
}

const outboundFlights: FlightOption[] = [
  {
    id: "out-1",
    airline: "Iberia",
    departure: "JFK 7:15pm",
    arrival: "BCN 8:45am+1",
    duration: "7h 30m",
    layovers: 0,
    price: 645,
    cabinClass: "Economy Plus",
    comfortScore: 4.2,
    isRecommended: true,
    reason: "Best balance of price, timing, and comfort",
  },
  {
    id: "out-2",
    airline: "Delta / Air France",
    departure: "JFK 5:30pm",
    arrival: "BCN 11:15am+1",
    duration: "11h 45m",
    layovers: 1,
    layoverCities: ["Paris CDG"],
    price: 520,
    cabinClass: "Economy",
    comfortScore: 3.5,
    reason: "Lowest price option",
  },
  {
    id: "out-3",
    airline: "British Airways",
    departure: "JFK 9:00pm",
    arrival: "BCN 2:30pm+1",
    duration: "11h 30m",
    layovers: 1,
    layoverCities: ["London LHR"],
    price: 890,
    cabinClass: "Premium Economy",
    comfortScore: 4.6,
    reason: "Most comfortable option",
  },
];

const returnFlights: FlightOption[] = [
  {
    id: "ret-1",
    airline: "Air France",
    departure: "NCE 12:30pm",
    arrival: "JFK 4:45pm",
    duration: "10h 15m",
    layovers: 1,
    layoverCities: ["Paris CDG"],
    price: 580,
    cabinClass: "Economy Plus",
    comfortScore: 4.0,
    isRecommended: true,
    reason: "Good timing for last day exploration",
  },
  {
    id: "ret-2",
    airline: "Swiss",
    departure: "NCE 6:45am",
    arrival: "JFK 12:10pm",
    duration: "11h 25m",
    layovers: 1,
    layoverCities: ["Zurich"],
    price: 495,
    cabinClass: "Economy",
    comfortScore: 3.8,
    reason: "Arrives early, lowest price",
  },
];

export function FlightsSection() {
  const [selectedOutbound, setSelectedOutbound] = useState("out-1");
  const [selectedReturn, setSelectedReturn] = useState("ret-1");
  const [optimizeFor, setOptimizeFor] = useState<
    "balanced" | "cheapest" | "shortest" | "comfort"
  >("balanced");

  const FlightCard = ({
    flight,
    isSelected,
    onSelect,
  }: {
    flight: FlightOption;
    isSelected: boolean;
    onSelect: () => void;
  }) => (
    <button
      onClick={onSelect}
      className={`relative w-full rounded-lg border p-4 text-left transition-all ${
        isSelected
          ? "border-primary bg-primary-subtle"
          : "border-border-muted bg-surface hover:border-border"
      }`}
    >
      {flight.isRecommended && (
        <div className="absolute -top-2 right-3 rounded bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
          Recommended
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
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
              <div className="h-px w-4 bg-border" />
              {flight.layovers === 0 ? (
                <span className="text-[10px] text-success">Direct</span>
              ) : (
                <span className="text-[10px]">
                  {flight.layovers} stop ({flight.layoverCities?.join(", ")})
                </span>
              )}
              <div className="h-px w-4 bg-border" />
            </div>
            <span className="text-sm text-foreground">{flight.arrival}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{flight.duration}</span>
            <span className="text-subtle">|</span>
            <span className="flex items-center gap-1">
              <svg
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

      {/* Selection indicator */}
      <div
        className={`absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 ${
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
            className="absolute -left-0.5 -top-0.5 text-primary-foreground"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </div>
    </button>
  );

  return (
    <div className="rounded-lg border border-border-muted bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
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

        <div className="flex items-center gap-1 rounded-md bg-muted p-0.5">
          {(["balanced", "cheapest", "shortest", "comfort"] as const).map(
            (opt) => (
              <button
                key={opt}
                onClick={() => setOptimizeFor(opt)}
                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                  optimizeFor === opt
                    ? "bg-surface-elevated text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            )
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
