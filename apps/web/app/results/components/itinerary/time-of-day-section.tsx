"use client";

import { useState } from "react";
import { Sunrise, Sun, Moon, ChevronDown } from "lucide-react";
import type { ItineraryActivity } from "../../../lib/types";
import { ActivityCard } from "./activity-card";

type TimeOfDay = "morning" | "afternoon" | "evening";

const TIME_CONFIG: Record<
  TimeOfDay,
  { label: string; icon: typeof Sun; borderClass: string; iconColor: string }
> = {
  morning: {
    label: "Morning",
    icon: Sunrise,
    borderClass: "border-l-amber-400",
    iconColor: "text-amber-400",
  },
  afternoon: {
    label: "Afternoon",
    icon: Sun,
    borderClass: "border-l-sky-400",
    iconColor: "text-sky-400",
  },
  evening: {
    label: "Evening",
    icon: Moon,
    borderClass: "border-l-indigo-400",
    iconColor: "text-indigo-400",
  },
};

interface TimeOfDaySectionProps {
  timeOfDay: TimeOfDay;
  activities: ItineraryActivity[];
  forceExpanded?: boolean | null;
}

export function TimeOfDaySection({
  timeOfDay,
  activities,
  forceExpanded,
}: TimeOfDaySectionProps) {
  const [localExpanded, setLocalExpanded] = useState(false);

  const isExpanded = forceExpanded ?? localExpanded;
  const config = TIME_CONFIG[timeOfDay];
  const Icon = config.icon;
  const panelId = `tod-panel-${timeOfDay}`;

  if (activities.length === 0) {
    return null;
  }

  return (
    <div
      className={`overflow-hidden rounded-lg border border-border-muted border-l-[3px] ${config.borderClass}`}
    >
      <button
        type="button"
        onClick={() => setLocalExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-elevated/50"
      >
        <Icon className={`h-4 w-4 flex-shrink-0 ${config.iconColor}`} />
        <span className="flex-1 text-sm font-medium text-foreground">
          {config.label}
        </span>
        {!isExpanded && (
          <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {activities.length} {activities.length === 1 ? "activity" : "activities"}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div id={panelId} className="space-y-2 px-4 pb-4">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}
