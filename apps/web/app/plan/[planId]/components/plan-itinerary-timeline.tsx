"use client";

import { useState } from "react";

import type { PlanActivityViewModel, PlanDayViewModel } from "../../../lib/types";

interface Props {
  days: PlanDayViewModel[];
}

function TimeSlot({
  label,
  activities,
  icon,
}: {
  label: string;
  activities: PlanActivityViewModel[];
  icon: React.ReactNode;
}) {
  if (activities.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md bg-surface-elevated p-2.5">
      <div className="mb-1.5 flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <ul className="space-y-1.5">
        {activities.map((activity, i) => (
          <li key={i}>
            <p className="text-xs font-medium text-foreground">
              {activity.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {activity.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const morningIcon = (
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
);

const afternoonIcon = (
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
);

const eveningIcon = (
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
);

export function PlanItineraryTimeline({ days }: Props) {
  const [expandedDays, setExpandedDays] = useState<string[]>(
    days.slice(0, 2).map((d) => d.id)
  );
  const [selectedDay, setSelectedDay] = useState<string>(days[0]?.id ?? "");

  const toggleDay = (id: string) => {
    setExpandedDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
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
            onClick={() => setExpandedDays(days.map((d) => d.id))}
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
        {days.map((day, index) => {
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
              {index < days.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute -bottom-2 left-6 h-2 w-px bg-border-muted"
                />
              )}

              <button
                type="button"
                onClick={() => toggleDay(day.id)}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                className="flex w-full items-center gap-3 p-3"
              >
                <div
                  aria-hidden="true"
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {day.dayNumber}
                </div>

                <div className="flex flex-1 items-center gap-3 text-left">
                  <div className="flex-1">
                    <span className="font-medium text-foreground">
                      {day.theme}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      Day {day.dayNumber} &middot; {day.date}
                    </div>
                  </div>

                  {!isExpanded && day.morning.length > 0 && (
                    <div
                      aria-hidden="true"
                      className="hidden max-w-xs truncate text-xs text-subtle lg:block"
                    >
                      {day.morning[0]?.title}
                    </div>
                  )}
                </div>

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

              {isExpanded && (
                <div
                  id={panelId}
                  className="border-t border-border-muted px-3 pb-3 pt-3"
                >
                  <div className="ml-11 grid gap-2 sm:grid-cols-3">
                    <TimeSlot
                      label="Morning"
                      activities={day.morning}
                      icon={morningIcon}
                    />
                    <TimeSlot
                      label="Afternoon"
                      activities={day.afternoon}
                      icon={afternoonIcon}
                    />
                    <TimeSlot
                      label="Evening"
                      activities={day.evening}
                      icon={eveningIcon}
                    />
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
