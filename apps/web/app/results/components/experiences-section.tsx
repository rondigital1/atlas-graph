"use client";

import { useState } from "react";
import type { ChipOption } from "../../lib/types";
import { experiences } from "../../lib/mock/itinerary-data";

const categories: ChipOption[] = [
  { id: "all", label: "All" },
  { id: "food", label: "Food" },
  { id: "culture", label: "Culture" },
  { id: "nature", label: "Nature" },
  { id: "nightlife", label: "Nightlife" },
];

export function ExperiencesSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [addedExperiences, setAddedExperiences] = useState<string[]>([
    "1",
    "2",
    "5",
  ]);

  const filteredExperiences =
    activeCategory === "all"
      ? experiences
      : experiences.filter((e) => e.category === activeCategory);

  const toggleExperience = (id: string) => {
    setAddedExperiences((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );
  };

  return (
    <div className="rounded-lg border border-border-muted bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <h3 className="text-base font-semibold text-foreground">
            Experiences & Activities
          </h3>
        </div>
        <span className="text-xs text-muted-foreground" aria-live="polite">
          {addedExperiences.length} added to plan
        </span>
      </div>

      {/* Category filters */}
      <div
        role="group"
        aria-label="Filter by category"
        className="mb-4 flex flex-wrap gap-1"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            aria-pressed={activeCategory === cat.id}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Experience cards */}
      {filteredExperiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border-muted py-12 text-center">
          <svg
            aria-hidden="true"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-3 text-subtle"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <p className="text-sm font-medium text-muted-foreground">
            No {activeCategory} experiences found
          </p>
          <p className="mt-1 text-xs text-subtle">
            Try a different category or adjust your plan
          </p>
        </div>
      ) : (
      <ul className="grid gap-2 sm:grid-cols-2">
        {filteredExperiences.map((exp) => {
          const isAdded = addedExperiences.includes(exp.id);

          return (
            <li
              key={exp.id}
              className={`rounded-lg border p-3 transition-all ${
                isAdded
                  ? "border-primary/30 bg-primary-subtle"
                  : "border-border-muted bg-surface-elevated"
              }`}
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {exp.name}
                    </span>
                    {exp.bookingUrgency === "high" && (
                      <span className="rounded bg-destructive/20 px-1.5 py-0.5 text-[9px] font-medium text-destructive">
                        Book ahead
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{exp.city}</span>
                    <span aria-hidden="true" className="text-subtle">
                      -
                    </span>
                    <span>{exp.idealTime}</span>
                    {exp.priceRange && (
                      <>
                        <span aria-hidden="true" className="text-subtle">
                          -
                        </span>
                        <span>{exp.priceRange}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleExperience(exp.id)}
                  aria-label={
                    isAdded
                      ? `Remove ${exp.name} from plan`
                      : `Add ${exp.name} to plan`
                  }
                  aria-pressed={isAdded}
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                    isAdded
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-surface hover:bg-muted"
                  }`}
                >
                  {isAdded ? (
                    <svg
                      aria-hidden="true"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg
                      aria-hidden="true"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5v14" />
                    </svg>
                  )}
                </button>
              </div>

              <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
                {exp.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {exp.vibe.map((v) => (
                  <span
                    key={v}
                    className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-subtle"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
      )}
    </div>
  );
}
