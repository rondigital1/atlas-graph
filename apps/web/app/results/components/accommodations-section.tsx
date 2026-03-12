"use client";

import { useState } from "react";
import type { ChipOption } from "../../lib/types";
import { accommodations } from "../../lib/mock/itinerary-data";

const alternativeTypes: ChipOption[] = [
  { id: "boutique", label: "Boutique" },
  { id: "hotel", label: "Standard Hotel" },
  { id: "apartment", label: "Apartment" },
  { id: "luxury", label: "Luxury" },
  { id: "budget", label: "Budget" },
];

export function AccommodationsSection() {
  const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>(
    Object.fromEntries(accommodations.map((a) => [a.id, "boutique"])),
  );

  return (
    <div className="rounded-lg border border-border-muted bg-surface p-4">
      <div className="mb-4 flex items-center gap-2">
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
          <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
          <path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16" />
          <path d="M8 7h.01M16 7h.01M12 7h.01M12 11h.01M12 15h.01M16 11h.01M16 15h.01M8 11h.01M8 15h.01" />
        </svg>
        <h3 className="text-base font-semibold text-foreground">
          Accommodations
        </h3>
      </div>

      <div className="space-y-3">
        {accommodations.map((acc) => (
          <div
            key={acc.id}
            className="rounded-lg border border-border-muted bg-surface-elevated p-4"
          >
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {acc.city}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {acc.dates}
                  </span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {acc.nights} nights
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium text-foreground">
                    {acc.name}
                  </span>
                  {acc.isRecommended && (
                    <span className="rounded bg-primary-muted px-1.5 py-0.5 text-[10px] font-medium text-primary">
                      AI Pick
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-foreground">
                  ${acc.pricePerNight}
                </div>
                <div className="text-xs text-muted-foreground">per night</div>
              </div>
            </div>

            {/* Details */}
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-md border border-border-muted bg-surface px-2 py-1 text-foreground">
                {acc.type}
              </span>
              <span className="rounded-md border border-border-muted bg-surface px-2 py-1 text-muted-foreground">
                {acc.neighborhood}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
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
                {acc.rating}
              </span>
            </div>

            {/* Vibe tags */}
            <div className="mb-3 flex flex-wrap gap-1">
              {acc.vibe.map((v) => (
                <span
                  key={v}
                  className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                >
                  {v}
                </span>
              ))}
            </div>

            {/* Features */}
            <ul className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {acc.features.map((f) => (
                <li key={f} className="flex items-center gap-1">
                  <svg
                    aria-hidden="true"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-success"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            {/* Reason */}
            <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
              {acc.reason}
            </p>

            {/* Alternative type selector */}
            <div className="flex items-center gap-2 border-t border-border-muted pt-3">
              <span className="text-xs text-subtle">Alternatives:</span>
              <div
                role="group"
                aria-label={`Accommodation type for ${acc.city}`}
                className="flex flex-wrap gap-1"
              >
                {alternativeTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() =>
                      setSelectedTypes((prev) => ({
                        ...prev,
                        [acc.id]: type.id,
                      }))
                    }
                    aria-pressed={selectedTypes[acc.id] === type.id}
                    className={`rounded px-2 py-1 text-[10px] font-medium transition-colors ${
                      selectedTypes[acc.id] === type.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 flex items-center justify-between border-t border-border-muted pt-4">
        <div className="text-sm text-muted-foreground">
          Total accommodations (9 nights)
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-foreground">$2,550</div>
          <div className="text-xs text-muted-foreground">
            avg $283/night incl. taxes
          </div>
        </div>
      </div>
    </div>
  );
}
