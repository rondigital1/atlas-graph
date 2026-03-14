"use client";

import { useCallback, useState } from "react";

import type {
  PlanActivityViewModel,
  PlanDayViewModel,
  RecommendedActivity,
  RecommendedRestaurant,
} from "../../../../../lib/types";

type TimeOfDay = "morning" | "afternoon" | "evening";
import { DayRecommendedActivities } from "./day-recommended-activities";
import { DayRecommendedRestaurants } from "./day-recommended-restaurants";
import { EditableTimeSection } from "./editable-time-section";

interface Props {
  day: PlanDayViewModel;
  restaurants: RecommendedRestaurant[];
  activities: RecommendedActivity[];
}

export function DayEditor({ day, restaurants, activities }: Props) {
  const [morning, setMorning] = useState<PlanActivityViewModel[]>(day.morning);
  const [afternoon, setAfternoon] = useState<PlanActivityViewModel[]>(day.afternoon);
  const [evening, setEvening] = useState<PlanActivityViewModel[]>(day.evening);
  const [addedActivityIds, setAddedActivityIds] = useState<Set<string>>(new Set());
  const [addedRestaurantIds, setAddedRestaurantIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  function addToSlot(slot: TimeOfDay, item: PlanActivityViewModel) {
    if (slot === "morning") {
      setMorning((prev) => [...prev, item]);
    } else if (slot === "afternoon") {
      setAfternoon((prev) => [...prev, item]);
    } else {
      setEvening((prev) => [...prev, item]);
    }
  }

  const handleAddActivity = useCallback(
    (activity: RecommendedActivity) => {
      const newItem: PlanActivityViewModel = {
        title: activity.title,
        description: activity.description,
      };
      addToSlot(activity.suggestedTime, newItem);
      setAddedActivityIds((prev) => new Set(prev).add(activity.id));
      showToast(`Added "${activity.title}" to ${activity.suggestedTime}`);
    },
    [],
  );

  const handleAddRestaurant = useCallback(
    (restaurant: RecommendedRestaurant) => {
      const newItem: PlanActivityViewModel = {
        title: `Dining: ${restaurant.name}`,
        description: `${restaurant.cuisine} — ${restaurant.description}`,
      };
      setEvening((prev) => [...prev, newItem]);
      setAddedRestaurantIds((prev) => new Set(prev).add(restaurant.id));
      showToast(`Added "${restaurant.name}" to evening`);
    },
    [],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr_220px]">
      {/* Left sidebar — restaurants */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-4">
          <DayRecommendedRestaurants
            restaurants={restaurants}
            onAdd={handleAddRestaurant}
            addedIds={addedRestaurantIds}
          />
        </div>
      </aside>

      {/* Center — editable itinerary */}
      <div className="space-y-8">
        <EditableTimeSection
          timeOfDay="morning"
          activities={morning}
          onActivitiesChange={setMorning}
        />
        <EditableTimeSection
          timeOfDay="afternoon"
          activities={afternoon}
          onActivitiesChange={setAfternoon}
        />
        <EditableTimeSection
          timeOfDay="evening"
          activities={evening}
          onActivitiesChange={setEvening}
        />
      </div>

      {/* Right sidebar — recommended activities */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-4">
          <DayRecommendedActivities
            activities={activities}
            onAdd={handleAddActivity}
            addedIds={addedActivityIds}
          />
        </div>
      </aside>

      {/* Mobile recommendations — collapsed below itinerary */}
      <div className="space-y-6 lg:hidden">
        <DayRecommendedRestaurants
          restaurants={restaurants}
          onAdd={handleAddRestaurant}
          addedIds={addedRestaurantIds}
        />
        <DayRecommendedActivities
          activities={activities}
          onAdd={handleAddActivity}
          addedIds={addedActivityIds}
        />
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
