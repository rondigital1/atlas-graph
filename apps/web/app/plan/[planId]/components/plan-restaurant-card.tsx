"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Plus, Star } from "lucide-react";
import Image from "next/image";

import type { RecommendedRestaurant } from "../../../lib/types";

interface Props {
  restaurant: RecommendedRestaurant;
  dayOptions: Array<{ dayNumber: number; label: string }>;
  onAddToDay: (restaurantId: string, dayNumber: number, timeSlot: string) => void;
  addedToDays: string[];
}

const TIME_SLOTS = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
];

export function PlanRestaurantCard({
  restaurant,
  dayOptions,
  onAddToDay,
  addedToDays,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="flex gap-3 rounded-xl border border-border-muted bg-surface p-3 transition-colors hover:border-border">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-foreground">
              {restaurant.name}
            </h4>
            <p className="text-xs text-muted-foreground">
              {restaurant.cuisine} &middot; {restaurant.priceRange} &middot;{" "}
              {restaurant.neighborhood}
            </p>
          </div>
          <span className="flex flex-shrink-0 items-center gap-0.5 text-xs text-amber-400">
            <Star size={11} fill="currentColor" />
            {restaurant.rating}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {restaurant.description}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex gap-1 overflow-hidden">
            {restaurant.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded bg-surface-elevated px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div ref={dropdownRef} className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => { setIsOpen(!isOpen); setSelectedDay(null); }}
              aria-label={`Add ${restaurant.name} to a day`}
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
                              onAddToDay(restaurant.id, selectedDay, slot.id);
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
    </div>
  );
}
