"use client";

import { Train } from "lucide-react";
import type { DayItem } from "../../../lib/types";

interface DayNavigationBarProps {
  days: DayItem[];
  activeDayId: string;
  onDayClick: (dayId: string) => void;
}

export function DayNavigationBar({
  days,
  activeDayId,
  onDayClick,
}: DayNavigationBarProps) {
  return (
    <nav
      aria-label="Day navigation"
      className="sticky top-0 z-40 border-b border-border-muted bg-background/95 backdrop-blur-xl"
    >
      <div className="scrollbar-hide flex gap-1.5 overflow-x-auto px-1 py-2">
        {days.map((day) => {
          const isActive = day.id === activeDayId;
          return (
            <button
              key={day.id}
              type="button"
              onClick={() => onDayClick(day.id)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-elevated text-muted-foreground hover:text-foreground"
              }`}
            >
              {day.isTransit && <Train className="h-3 w-3" />}
              Day {day.day}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
