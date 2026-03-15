"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Clock, Plus } from "lucide-react";

import type { RecommendedActivity } from "../../../lib/types";

interface DayTimeOption {
  dayNumber: number;
  label: string;
}

interface Props {
  activity: RecommendedActivity;
  dayOptions: DayTimeOption[];
  onAddToDay: (activityId: string, dayNumber: number, timeSlot: string) => void;
  addedToDays: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
  landmark: "from-amber-900/40 to-amber-800/20",
  food: "from-orange-900/40 to-orange-800/20",
  culture: "from-purple-900/40 to-purple-800/20",
  nature: "from-emerald-900/40 to-emerald-800/20",
  leisure: "from-sky-900/40 to-sky-800/20",
};

const TIME_SLOTS = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
];

export function PlanActivityCard({
  activity,
  dayOptions,
  onAddToDay,
  addedToDays,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const gradient =
    CATEGORY_COLORS[activity.category] ?? CATEGORY_COLORS["leisure"];

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSelectedDay(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSelectedDay(null);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  return (
    <div className="rounded-xl border border-border-muted bg-surface p-3 transition-colors hover:border-border">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient}`}
        >
          <span className="text-xs font-semibold capitalize text-muted-foreground">
            {activity.category.slice(0, 3)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-foreground">
            {activity.title}
          </h4>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {activity.suggestedTime.charAt(0).toUpperCase() +
              activity.suggestedTime.slice(1)}
            <span className="mx-1">&middot;</span>
            <Clock size={10} className="mb-px inline" /> {activity.duration}
          </p>
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {activity.description}
      </p>

      <div className="mt-2 flex items-center justify-end">
        <div ref={dropdownRef} className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => { setIsOpen(!isOpen); setSelectedDay(null); }}
            aria-label={`Add ${activity.title} to a day`}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            className="flex h-7 cursor-pointer items-center gap-1 rounded-lg border border-border-muted bg-surface-elevated pl-2 pr-1.5 text-[11px] font-medium text-primary transition-colors hover:border-primary focus:border-primary focus:outline-none"
          >
            <Plus size={12} />
            <span>Add to day</span>
            <ChevronDown
              size={10}
              className={`ml-0.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div
              role="listbox"
              className="absolute right-0 bottom-full z-20 mb-1 min-w-[160px] overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
            >
              <div className="p-1">
                {selectedDay === null ? (
                  <>
                    <p className="px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-subtle">Select day</p>
                    {dayOptions.map((opt) => (
                      <button
                        key={opt.dayNumber}
                        type="button"
                        onClick={() => setSelectedDay(opt.dayNumber)}
                        className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-1.5 text-xs transition-colors hover:bg-surface-elevated"
                      >
                        <span className="text-foreground">{opt.label}</span>
                        <ChevronDown size={10} className="-rotate-90 text-subtle" />
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedDay(null)}
                      className="flex w-full items-center gap-1 rounded-md px-3 py-1 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ChevronDown size={10} className="rotate-90" />
                      Day {selectedDay}
                    </button>
                    <div className="my-0.5 border-t border-border-muted" />
                    {TIME_SLOTS.map((slot) => {
                      const key = `${selectedDay}-${slot.id}`;
                      const isAdded = addedToDays.includes(key);
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          role="option"
                          aria-selected={isAdded}
                          onClick={() => {
                            onAddToDay(activity.id, selectedDay, slot.id);
                            setIsOpen(false);
                            setSelectedDay(null);
                          }}
                          className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-1.5 text-xs transition-colors hover:bg-surface-elevated"
                        >
                          <span className="text-foreground">{slot.label}</span>
                          {isAdded && <Check size={12} className="text-primary" />}
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
