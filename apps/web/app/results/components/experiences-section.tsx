"use client";

import { useState } from "react";

interface Experience {
  id: string;
  name: string;
  category: string;
  city: string;
  description: string;
  idealTime: string;
  vibe: string[];
  bookingUrgency?: "high" | "medium" | "low";
  priceRange?: string;
}

const experiences: Experience[] = [
  {
    id: "1",
    name: "La Boqueria Culinary Walk",
    category: "food",
    city: "Barcelona",
    description:
      "Guided tasting tour through the iconic market with local chef",
    idealTime: "Day 1, Morning",
    vibe: ["Local favorite", "Culinary"],
    bookingUrgency: "high",
    priceRange: "$$",
  },
  {
    id: "2",
    name: "Sagrada Familia Guided Tour",
    category: "culture",
    city: "Barcelona",
    description: "Skip-the-line entry with architecture expert guide",
    idealTime: "Day 2, 9am",
    vibe: ["Popular", "Must-see"],
    bookingUrgency: "high",
    priceRange: "$$$",
  },
  {
    id: "3",
    name: "Flamenco at Palau de la Musica",
    category: "culture",
    city: "Barcelona",
    description: "Intimate flamenco performance in stunning modernist hall",
    idealTime: "Day 3, Evening",
    vibe: ["Romantic", "Authentic"],
    bookingUrgency: "medium",
    priceRange: "$$",
  },
  {
    id: "4",
    name: "Luberon Villages by Car",
    category: "nature",
    city: "Provence",
    description: "Self-drive through lavender fields and hilltop villages",
    idealTime: "Day 5, Full day",
    vibe: ["Scenic", "Relaxing"],
    priceRange: "$$",
  },
  {
    id: "5",
    name: "Chateauneuf-du-Pape Wine Tasting",
    category: "food",
    city: "Provence",
    description: "Private tasting at family-run vineyard with cellar tour",
    idealTime: "Day 6, Afternoon",
    vibe: ["Local favorite", "Premium"],
    bookingUrgency: "medium",
    priceRange: "$$$",
  },
  {
    id: "6",
    name: "Eze Village & Perfumery Visit",
    category: "culture",
    city: "Nice",
    description: "Medieval village exploration plus Fragonard factory tour",
    idealTime: "Day 8, Afternoon",
    vibe: ["Scenic", "Hidden gem"],
    priceRange: "$",
  },
  {
    id: "7",
    name: "Cours Saleya Market Morning",
    category: "food",
    city: "Nice",
    description: "Browse flowers, produce, and local specialties",
    idealTime: "Day 8, Morning",
    vibe: ["Local favorite", "Free"],
    priceRange: "$",
  },
  {
    id: "8",
    name: "Monaco Day Trip",
    category: "nature",
    city: "Nice",
    description: "Optional half-day to Monte Carlo and oceanographic museum",
    idealTime: "Day 9, Afternoon",
    vibe: ["Luxurious", "Popular"],
    priceRange: "$$",
  },
];

const categories = [
  { id: "all", label: "All", icon: null },
  { id: "food", label: "Food", icon: "utensils" },
  { id: "culture", label: "Culture", icon: "landmark" },
  { id: "nature", label: "Nature", icon: "mountain" },
  { id: "nightlife", label: "Nightlife", icon: "moon" },
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
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  return (
    <div className="rounded-lg border border-border-muted bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
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
        <span className="text-xs text-muted-foreground">
          {addedExperiences.length} added to plan
        </span>
      </div>

      {/* Category filters */}
      <div className="mb-4 flex flex-wrap gap-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
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
      <div className="grid gap-2 sm:grid-cols-2">
        {filteredExperiences.map((exp) => {
          const isAdded = addedExperiences.includes(exp.id);

          return (
            <div
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
                    <span className="text-subtle">-</span>
                    <span>{exp.idealTime}</span>
                    {exp.priceRange && (
                      <>
                        <span className="text-subtle">-</span>
                        <span>{exp.priceRange}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleExperience(exp.id)}
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                    isAdded
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-surface hover:bg-muted"
                  }`}
                >
                  {isAdded ? (
                    <svg
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
