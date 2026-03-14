"use client";

import { Moon, Plus, Sun, Sunrise } from "lucide-react";
import { useState } from "react";

import type { PlanActivityViewModel } from "../../../../../lib/types";
import { EditableActivityCard } from "./editable-activity-card";

type TimeSlot = "morning" | "afternoon" | "evening";

const TIME_CONFIG = {
  morning: { label: "Morning", icon: Sunrise, iconColor: "text-amber-400" },
  afternoon: { label: "Afternoon", icon: Sun, iconColor: "text-sky-400" },
  evening: { label: "Evening", icon: Moon, iconColor: "text-indigo-400" },
} as const satisfies Record<TimeSlot, { label: string; icon: typeof Sunrise; iconColor: string }>;

interface Props {
  timeOfDay: TimeSlot;
  activities: PlanActivityViewModel[];
  onActivitiesChange: (activities: PlanActivityViewModel[]) => void;
}

export function EditableTimeSection({
  timeOfDay,
  activities,
  onActivitiesChange,
}: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const config = TIME_CONFIG[timeOfDay];
  const Icon = config.icon;

  function handleUpdate(index: number, updated: PlanActivityViewModel) {
    const next = [...activities];
    next[index] = updated;
    onActivitiesChange(next);
  }

  function handleRemove(index: number) {
    onActivitiesChange(activities.filter((_, i) => i !== index));
  }

  function handleAdd() {
    if (!newTitle.trim()) {
      return;
    }
    onActivitiesChange([
      ...activities,
      { title: newTitle.trim(), description: newDescription.trim() },
    ]);
    setNewTitle("");
    setNewDescription("");
    setIsAdding(false);
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {config.label}
          </h3>
          <span className="text-xs text-subtle">
            {activities.length} {activities.length === 1 ? "activity" : "activities"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {activities.map((activity, i) => (
          <EditableActivityCard
            key={`${timeOfDay}-${i}`}
            activity={activity}
            onUpdate={(updated) => handleUpdate(i, updated)}
            onRemove={() => handleRemove(i)}
          />
        ))}

        {activities.length === 0 && !isAdding && (
          <p className="rounded-lg border border-dashed border-border-muted py-4 text-center text-xs text-subtle">
            No activities yet
          </p>
        )}

        {isAdding ? (
          <div className="rounded-lg border border-primary/40 bg-surface p-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mb-2 w-full rounded-md border border-border-muted bg-background px-3 py-1.5 text-sm font-medium text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
              placeholder="Activity title"
              autoFocus
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-md border border-border-muted bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
              placeholder="Description (optional)"
            />
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!newTitle.trim()}
                className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewTitle("");
                  setNewDescription("");
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-muted py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Plus size={13} />
            Add activity
          </button>
        )}
      </div>
    </section>
  );
}
