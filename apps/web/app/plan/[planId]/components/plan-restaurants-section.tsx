"use client";

import { Check, UtensilsCrossed } from "lucide-react";
import { useCallback, useState } from "react";

import type { PlanDayViewModel, RecommendedRestaurant } from "../../../lib/types";
import { PlanRestaurantCard } from "./plan-restaurant-card";

interface Props {
  planId: string;
  restaurants: RecommendedRestaurant[];
  days: PlanDayViewModel[];
}

interface DayAssignment {
  restaurantId: string;
  restaurantName: string;
  dayNumber: number;
  key: string;
}

export function PlanRestaurantsSection({ planId, restaurants, days }: Props) {
  const [assignments, setAssignments] = useState<DayAssignment[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const dayOptions = days.map((d) => ({
    dayNumber: d.dayNumber,
    label: `Day ${d.dayNumber}`,
  }));

  const handleAddToDay = useCallback(
    async (restaurantId: string, dayNumber: number, timeSlot: string) => {
      const restaurant = restaurants.find((r) => r.id === restaurantId);
      if (!restaurant) {
        return;
      }

      const key = `${dayNumber}-${timeSlot}`;
      const alreadyAdded = assignments.some(
        (a) => a.restaurantId === restaurantId && a.key === key,
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
            timeSlot,
            activity: {
              title: `Dining: ${restaurant.name}`,
              description: `${restaurant.cuisine} · ${restaurant.priceRange} · ${restaurant.neighborhood}`,
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
          restaurantId,
          restaurantName: restaurant.name,
          dayNumber,
          key,
        },
      ]);

      const slotLabel = timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1);
      setToast(`Added ${restaurant.name} to Day ${dayNumber} (${slotLabel})`);
      setTimeout(() => setToast(null), 2500);
    },
    [assignments, restaurants, planId],
  );

  function getAddedDays(restaurantId: string): string[] {
    return assignments
      .filter((a) => a.restaurantId === restaurantId)
      .map((a) => a.key);
  }

  if (restaurants.length === 0) {
    return null;
  }

  const assignmentsByDay = days
    .map((d) => ({
      dayNumber: d.dayNumber,
      restaurants: assignments
        .filter((a) => a.dayNumber === d.dayNumber)
        .map((a) => a.restaurantName),
    }))
    .filter((d) => d.restaurants.length > 0);

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <UtensilsCrossed size={18} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Recommended Restaurants
        </h2>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        Choose restaurants to add to your daily itinerary.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {restaurants.map((restaurant) => (
          <PlanRestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            dayOptions={dayOptions}
            onAddToDay={handleAddToDay}
            addedToDays={getAddedDays(restaurant.id)}
          />
        ))}
      </div>

      {/* Added summary */}
      {assignmentsByDay.length > 0 && (
        <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Check size={14} className="text-primary" />
            Your Restaurant Picks
          </h3>
          <ul className="space-y-1.5">
            {assignmentsByDay.map((d) => (
              <li key={d.dayNumber} className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Day {d.dayNumber}:
                </span>{" "}
                {d.restaurants.join(", ")}
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
