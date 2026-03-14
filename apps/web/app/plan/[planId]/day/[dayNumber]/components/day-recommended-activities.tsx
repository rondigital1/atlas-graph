"use client";

import { Clock, Compass, Plus } from "lucide-react";

import type { RecommendedActivity } from "../../../../../lib/types";

interface Props {
  activities: RecommendedActivity[];
  onAdd: (activity: RecommendedActivity) => void;
  addedIds: Set<string>;
}

const TIME_LABELS = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
} as const;

export function DayRecommendedActivities({ activities, onAdd, addedIds }: Props) {
  if (activities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Compass size={15} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          Suggested Activities
        </h3>
      </div>

      <div className="space-y-2">
        {activities.map((activity) => {
          const isAdded = addedIds.has(activity.id);
          return (
            <div
              key={activity.id}
              className="rounded-lg border border-border-muted bg-surface p-3 transition-colors hover:border-border"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-semibold text-foreground">
                  {activity.title}
                </h4>
                <button
                  type="button"
                  onClick={() => onAdd(activity)}
                  disabled={isAdded}
                  className={`flex flex-shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors ${
                    isAdded
                      ? "bg-primary/10 text-primary"
                      : "bg-surface-elevated text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                  aria-label={`Add ${activity.title}`}
                >
                  <Plus size={10} />
                  {isAdded ? "Added" : "Add"}
                </button>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {activity.description}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-[10px] text-subtle">
                <span>{TIME_LABELS[activity.suggestedTime]}</span>
                <span className="flex items-center gap-0.5">
                  <Clock size={9} />
                  {activity.duration}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
