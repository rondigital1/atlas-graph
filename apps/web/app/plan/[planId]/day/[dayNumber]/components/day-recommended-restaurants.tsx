"use client";

import { Plus, Star, UtensilsCrossed } from "lucide-react";
import Image from "next/image";

import type { RecommendedRestaurant } from "../../../../../lib/types";

interface Props {
  restaurants: RecommendedRestaurant[];
  onAdd: (restaurant: RecommendedRestaurant) => void;
  addedIds: Set<string>;
}

export function DayRecommendedRestaurants({ restaurants, onAdd, addedIds }: Props) {
  if (restaurants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <UtensilsCrossed size={15} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          Recommended Restaurants
        </h3>
      </div>

      <div className="space-y-2">
        {restaurants.map((restaurant) => {
          const isAdded = addedIds.has(restaurant.id);
          return (
            <div
              key={restaurant.id}
              className="rounded-lg border border-border-muted bg-surface p-3 transition-colors hover:border-border"
            >
              <div className="flex gap-2.5">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="truncate text-xs font-semibold text-foreground">
                      {restaurant.name}
                    </h4>
                    <span className="flex flex-shrink-0 items-center gap-0.5 text-[10px] text-amber-400">
                      <Star size={9} fill="currentColor" />
                      {restaurant.rating}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {restaurant.cuisine} &middot; {restaurant.priceRange}
                  </p>
                </div>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                {restaurant.description}
              </p>
              <button
                type="button"
                onClick={() => onAdd(restaurant)}
                disabled={isAdded}
                className={`mt-2 flex w-full items-center justify-center gap-1 rounded-md py-1 text-[10px] font-medium transition-colors ${
                  isAdded
                    ? "bg-primary/10 text-primary"
                    : "bg-surface-elevated text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
                aria-label={`Add ${restaurant.name} to itinerary`}
              >
                <Plus size={10} />
                {isAdded ? "Added to itinerary" : "Add to itinerary"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
