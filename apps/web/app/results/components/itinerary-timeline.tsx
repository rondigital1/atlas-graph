"use client";

import { useState } from "react";
import { itineraryDays } from "../../lib/mock/itinerary-data";

export function ItineraryTimeline() {
  const [expandedDays, setExpandedDays] = useState<string[]>(["1", "2"]);
  const [selectedDay, setSelectedDay] = useState<string>("1");

  const toggleDay = (id: string) => {
    setExpandedDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
    setSelectedDay(id);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Day-by-Day Itinerary
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExpandedDays(itineraryDays.map((d) => d.id))}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Expand all
          </button>
          <span aria-hidden="true" className="text-subtle">
            |
          </span>
          <button
            type="button"
            onClick={() => setExpandedDays([])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Collapse all
          </button>
        </div>
      </div>

      <ol className="space-y-2">
        {itineraryDays.map((day, index) => {
          const isExpanded = expandedDays.includes(day.id);
          const isSelected = selectedDay === day.id;
          const panelId = `day-panel-${day.id}`;

          return (
            <li
              key={day.id}
              className={`group relative rounded-lg border transition-all ${
                isSelected
                  ? "border-primary/50 bg-primary-subtle"
                  : "border-border-muted bg-surface hover:border-border"
              }`}
            >
              {/* Timeline connector */}
              {index < itineraryDays.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute -bottom-2 left-6 h-2 w-px bg-border-muted"
                />
              )}

              {/* Header */}
              <button
                type="button"
                onClick={() => toggleDay(day.id)}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                className="flex w-full items-center gap-3 p-3"
              >
                {/* Day number */}
                <div
                  aria-hidden="true"
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    day.isTransit
                      ? "bg-warning-muted text-warning"
                      : isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                  }`}
                >
                  {day.day}
                </div>

                {/* Main info */}
                <div className="flex flex-1 items-center gap-3 text-left">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {day.city}
                      </span>
                      {day.isTransit && (
                        <span className="rounded bg-warning-muted px-1.5 py-0.5 text-[10px] font-medium text-warning">
                          Transit
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {day.date}
                      {day.neighborhood ? ` - ${day.neighborhood}` : ""}
                    </div>
                  </div>

                  {/* Preview when collapsed */}
                  {!isExpanded && (
                    <div
                      aria-hidden="true"
                      className="hidden max-w-xs truncate text-xs text-subtle lg:block"
                    >
                      {day.morning}
                    </div>
                  )}
                </div>

                {/* Expand icon */}
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`text-muted-foreground transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div
                  id={panelId}
                  className="border-t border-border-muted px-3 pb-3 pt-3"
                >
                  <div className="ml-11 space-y-3">
                    {/* Time slots */}
                    <div className="grid gap-2 sm:grid-cols-3">
                      {day.morning && (
                        <div className="rounded-md bg-surface-elevated p-2.5">
                          <div className="mb-1 flex items-center gap-1.5">
                            <svg
                              aria-hidden="true"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-warning"
                            >
                              <circle cx="12" cy="12" r="4" />
                              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                            </svg>
                            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                              Morning
                            </span>
                          </div>
                          <p className="text-xs text-foreground">
                            {day.morning}
                          </p>
                        </div>
                      )}
                      {day.afternoon && (
                        <div className="rounded-md bg-surface-elevated p-2.5">
                          <div className="mb-1 flex items-center gap-1.5">
                            <svg
                              aria-hidden="true"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-primary"
                            >
                              <circle cx="12" cy="12" r="4" />
                              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                            </svg>
                            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                              Afternoon
                            </span>
                          </div>
                          <p className="text-xs text-foreground">
                            {day.afternoon}
                          </p>
                        </div>
                      )}
                      {day.evening && (
                        <div className="rounded-md bg-surface-elevated p-2.5">
                          <div className="mb-1 flex items-center gap-1.5">
                            <svg
                              aria-hidden="true"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-muted-foreground"
                            >
                              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                            </svg>
                            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                              Evening
                            </span>
                          </div>
                          <p className="text-xs text-foreground">
                            {day.evening}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Dining & Notes row */}
                    <div className="flex flex-wrap items-center gap-3">
                      {day.dining && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <svg
                            aria-hidden="true"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-muted-foreground"
                          >
                            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                          </svg>
                          <span className="text-muted-foreground">
                            {day.dining}
                          </span>
                        </div>
                      )}
                      {day.notes && (
                        <div className="flex items-center gap-1.5 rounded-md bg-warning-muted px-2 py-1 text-xs text-warning">
                          <svg
                            aria-hidden="true"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4M12 8h.01" />
                          </svg>
                          {day.notes}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <button
                        type="button"
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Edit day
                      </button>
                      <span aria-hidden="true" className="text-subtle">
                        |
                      </span>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Regenerate
                      </button>
                      <span aria-hidden="true" className="text-subtle">
                        |
                      </span>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Add activity
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
