"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Clock, Plus } from "lucide-react";

import type { RecommendedActivity } from "../../../lib/types";

interface Props {
  activity: RecommendedActivity;
  dayOptions: Array<{ dayNumber: number; label: string }>;
  onAddToDay: (activityId: string, dayNumber: number) => void;
  addedToDays: number[];
}

const CATEGORY_COLORS: Record<string, string> = {
  landmark: "from-amber-900/40 to-amber-800/20",
  food: "from-orange-900/40 to-orange-800/20",
  culture: "from-purple-900/40 to-purple-800/20",
  nature: "from-emerald-900/40 to-emerald-800/20",
  leisure: "from-sky-900/40 to-sky-800/20",
};

export function PlanActivityCard({
  activity,
  dayOptions,
  onAddToDay,
  addedToDays,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
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
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  return (
    <div className="rounded-xl border border-border-muted bg-surface p-3 transition-colors hover:border-border">
      <div className="flex items-start gap-3">
        {/* Category badge */}
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

      {/* Day selector dropdown */}
      <div className="mt-2 flex items-center justify-end">
        <div ref={dropdownRef} className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
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
              className="absolute right-0 bottom-full z-20 mb-1 min-w-[120px] overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
            >
              <div className="p-1">
                {dayOptions.map((opt) => {
                  const isAdded = addedToDays.includes(opt.dayNumber);
                  return (
                    <button
                      key={opt.dayNumber}
                      type="button"
                      role="option"
                      aria-selected={isAdded}
                      onClick={() => {
                        onAddToDay(activity.id, opt.dayNumber);
                        setIsOpen(false);
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-1.5 text-xs transition-colors hover:bg-surface-elevated"
                    >
                      <span className="text-foreground">{opt.label}</span>
                      {isAdded && (
                        <Check size={12} className="text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
