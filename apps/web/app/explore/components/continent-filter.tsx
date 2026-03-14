"use client";

import type { Continent } from "../../lib/types";
import { continents } from "../../lib/mock/explore-itineraries";

interface Props {
  active: Continent;
  onChange: (continent: Continent) => void;
}

export function ContinentFilter({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {continents.map((c) => {
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "border border-border-muted bg-surface text-muted-foreground hover:border-border hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
