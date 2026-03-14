import { Plus, Star } from "lucide-react";
import Image from "next/image";

import type { RecommendedRestaurant } from "../../../lib/types";

interface Props {
  restaurant: RecommendedRestaurant;
  dayOptions: Array<{ dayNumber: number; label: string }>;
  onAddToDay: (restaurantId: string, dayNumber: number) => void;
  addedToDays: number[];
}

export function PlanRestaurantCard({
  restaurant,
  dayOptions,
  onAddToDay,
  addedToDays,
}: Props) {
  return (
    <div className="flex gap-3 rounded-xl border border-border-muted bg-surface p-3 transition-colors hover:border-border">
      {/* Thumbnail */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Info */}
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

        {/* Tags + Add button */}
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

          {/* Day selector dropdown */}
          <div className="relative flex-shrink-0">
            <select
              onChange={(e) => {
                const dayNum = Number(e.target.value);
                if (dayNum > 0) {
                  onAddToDay(restaurant.id, dayNum);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="h-7 cursor-pointer appearance-none rounded-lg border border-border-muted bg-surface-elevated pl-6 pr-2 text-[11px] font-medium text-primary transition-colors hover:border-primary focus:border-primary focus:outline-none"
              aria-label={`Add ${restaurant.name} to a day`}
            >
              <option value="" disabled>
                Add to day
              </option>
              {dayOptions.map((opt) => (
                <option key={opt.dayNumber} value={opt.dayNumber}>
                  {opt.label}
                  {addedToDays.includes(opt.dayNumber) ? " ✓" : ""}
                </option>
              ))}
            </select>
            <Plus
              size={12}
              className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 text-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
