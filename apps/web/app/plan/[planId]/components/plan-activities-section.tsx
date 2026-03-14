"use client";

import { Check, Compass } from "lucide-react";
import { useCallback, useState } from "react";

import type { PlanDayViewModel, RecommendedActivity } from "../../../lib/types";
import { PlanActivityCard } from "./plan-activity-card";

interface Props {
  planId: string;
  activities: RecommendedActivity[];
  days: PlanDayViewModel[];
}

interface DayAssignment {
  activityId: string;
  activityTitle: string;
  dayNumber: number;
}

export function PlanActivitiesSection({ planId, activities, days }: Props) {
  const [assignments, setAssignments] = useState<DayAssignment[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const dayOptions = days.map((d) => ({
    dayNumber: d.dayNumber,
    label: `Day ${d.dayNumber}`,
  }));

  const handleAddToDay = useCallback(
    async (activityId: string, dayNumber: number) => {
      const activity = activities.find((a) => a.id === activityId);
      if (!activity) {
        return;
      }

      const alreadyAdded = assignments.some(
        (a) => a.activityId === activityId && a.dayNumber === dayNumber,
      );
      if (alreadyAdded) {
        return;
      }

      try {
        const res = await fetch(`/api/plans/${planId}/add-to-day`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dayNumber,
            timeSlot: activity.suggestedTime,
            activity: {
              title: activity.title,
              description: activity.description,
            },
          }),
        });

        if (!res.ok) {
          setToast("Failed to save — try again");
          setTimeout(() => setToast(null), 2500);
          return;
        }
      } catch {
        setToast("Failed to save — try again");
        setTimeout(() => setToast(null), 2500);
        return;
      }

      setAssignments((prev) => [
        ...prev,
        {
          activityId,
          activityTitle: activity.title,
          dayNumber,
        },
      ]);

      setToast(`Added ${activity.title} to Day ${dayNumber}`);
      setTimeout(() => setToast(null), 2500);
    },
    [assignments, activities, planId],
  );

  function getAddedDays(activityId: string): number[] {
    return assignments
      .filter((a) => a.activityId === activityId)
      .map((a) => a.dayNumber);
  }

  if (activities.length === 0) {
    return null;
  }

  const assignmentsByDay = days
    .map((d) => ({
      dayNumber: d.dayNumber,
      activities: assignments
        .filter((a) => a.dayNumber === d.dayNumber)
        .map((a) => a.activityTitle),
    }))
    .filter((d) => d.activities.length > 0);

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Compass size={18} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Recommended Activities
        </h2>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        Discover popular experiences and add them to any day.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {activities.map((activity) => (
          <PlanActivityCard
            key={activity.id}
            activity={activity}
            dayOptions={dayOptions}
            onAddToDay={handleAddToDay}
            addedToDays={getAddedDays(activity.id)}
          />
        ))}
      </div>

      {/* Added summary */}
      {assignmentsByDay.length > 0 && (
        <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Check size={14} className="text-primary" />
            Your Activity Picks
          </h3>
          <ul className="space-y-1.5">
            {assignmentsByDay.map((d) => (
              <li key={d.dayNumber} className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Day {d.dayNumber}:
                </span>{" "}
                {d.activities.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg">
          {toast}
        </div>
      )}
    </section>
  );
}
