"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { itineraryDays } from "../../lib/mock/itinerary-data";
import { DayNavigationBar } from "./itinerary/day-navigation-bar";
import { DayCard } from "./itinerary/day-card";

export function ItineraryTimeline() {
  const [activeDayId, setActiveDayId] = useState(itineraryDays[0]?.id ?? "1");
  const [forceExpand, setForceExpand] = useState<boolean | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isScrollingRef = useRef(false);

  const handleDayClick = useCallback((dayId: string) => {
    isScrollingRef.current = true;
    setActiveDayId(dayId);

    const el = document.getElementById(`day-${dayId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) {
          return;
        }
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("day-", "");
            setActiveDayId(id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 },
    );

    for (const day of itineraryDays) {
      const el = document.getElementById(`day-${day.id}`);
      if (el) {
        observerRef.current.observe(el);
      }
    }

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div>
      {/* Controls */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Day-by-Day Itinerary
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setForceExpand(true)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Expand all
          </button>
          <span aria-hidden="true" className="text-subtle">
            |
          </span>
          <button
            type="button"
            onClick={() => setForceExpand(false)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Collapse all
          </button>
          <span aria-hidden="true" className="text-subtle">
            |
          </span>
          <button
            type="button"
            onClick={() => setForceExpand(null)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Sticky day nav */}
      <DayNavigationBar
        days={itineraryDays}
        activeDayId={activeDayId}
        onDayClick={handleDayClick}
      />

      {/* Day cards */}
      <div className="mt-4 space-y-6">
        {itineraryDays.map((day) => (
          <DayCard
            key={day.id}
            day={day}
            forceExpandSections={forceExpand}
          />
        ))}
      </div>
    </div>
  );
}
