"use client";

import { useState } from "react";

interface DayItem {
  id: string;
  day: number;
  date: string;
  city: string;
  isTransit?: boolean;
  morning?: string;
  afternoon?: string;
  evening?: string;
  dining?: string;
  neighborhood?: string;
  notes?: string;
}

const itineraryData: DayItem[] = [
  {
    id: "1",
    day: 1,
    date: "Oct 15",
    city: "Barcelona",
    morning: "Arrive at BCN, transfer to Gothic Quarter hotel",
    afternoon: "Explore Las Ramblas and La Boqueria market",
    evening: "Sunset drinks at rooftop bar in El Born",
    dining: "Can Culleretes - traditional Catalan dinner",
    neighborhood: "Gothic Quarter",
    notes: "Check-in after 3pm. Pre-book dinner.",
  },
  {
    id: "2",
    day: 2,
    date: "Oct 16",
    city: "Barcelona",
    morning: "Sagrada Familia (timed entry 9am)",
    afternoon: "Park Guell exploration + Gracia neighborhood",
    evening: "Tapas crawl in El Born district",
    dining: "Cal Pep - fresh seafood tapas",
    neighborhood: "Eixample / El Born",
  },
  {
    id: "3",
    day: 3,
    date: "Oct 17",
    city: "Barcelona",
    morning: "Picasso Museum + El Born Cultural Center",
    afternoon: "Beach time at Barceloneta",
    evening: "Flamenco show at Palau de la Musica",
    dining: "La Mar Salada - paella by the beach",
    neighborhood: "El Born / Barceloneta",
  },
  {
    id: "4",
    day: 4,
    date: "Oct 18",
    city: "Barcelona to Provence",
    isTransit: true,
    morning: "Early checkout, train to Avignon (4h15m)",
    afternoon: "Arrive Avignon, check into hotel",
    evening: "Evening stroll through old town",
    dining: "Le Vintage - casual French bistro",
    neighborhood: "Avignon Centre",
    notes: "TGV train departs 8:42am. Book first class.",
  },
  {
    id: "5",
    day: 5,
    date: "Oct 19",
    city: "Provence",
    morning: "Day trip to Luberon villages",
    afternoon: "Gordes, Roussillon ochre trails",
    evening: "Return to Avignon",
    dining: "Picnic lunch from local markets",
    neighborhood: "Luberon Valley",
    notes: "Rent car for day trip recommended.",
  },
  {
    id: "6",
    day: 6,
    date: "Oct 20",
    city: "Provence",
    morning: "Pont du Gard Roman aqueduct",
    afternoon: "Wine tasting in Chateauneuf-du-Pape",
    evening: "Dinner in Avignon",
    dining: "La Mirande - fine dining experience",
    neighborhood: "Avignon / Chateauneuf",
  },
  {
    id: "7",
    day: 7,
    date: "Oct 21",
    city: "Provence to Nice",
    isTransit: true,
    morning: "Morning in Avignon, train to Nice (3h)",
    afternoon: "Arrive Nice, explore Vieux Nice",
    evening: "Promenade des Anglais sunset walk",
    dining: "Chez Pipo - authentic socca",
    neighborhood: "Old Nice",
  },
  {
    id: "8",
    day: 8,
    date: "Oct 22",
    city: "Nice",
    morning: "Cours Saleya market + Castle Hill",
    afternoon: "Day trip to Eze village",
    evening: "Dinner in Nice port area",
    dining: "Jan - modern Mediterranean",
    neighborhood: "Old Nice / Eze",
  },
  {
    id: "9",
    day: 9,
    date: "Oct 23",
    city: "Nice",
    morning: "Matisse Museum + Cimiez gardens",
    afternoon: "Beach relaxation / optional Monaco trip",
    evening: "Final dinner in Old Nice",
    dining: "Olive et Artichaut - farm to table",
    neighborhood: "Cimiez / Beach",
  },
  {
    id: "10",
    day: 10,
    date: "Oct 24",
    city: "Departure",
    isTransit: true,
    morning: "Leisurely breakfast, pack",
    afternoon: "Transfer to Nice airport (NCE)",
    evening: "Flight home",
    neighborhood: "Nice Airport",
    notes: "Flight departs 4:30pm. Arrive airport by 2pm.",
  },
];

export function ItineraryTimeline() {
  const [expandedDays, setExpandedDays] = useState<string[]>(["1", "2"]);
  const [selectedDay, setSelectedDay] = useState<string>("1");

  const toggleDay = (id: string) => {
    setExpandedDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
    setSelectedDay(id);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Day-by-Day Itinerary
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpandedDays(itineraryData.map((d) => d.id))}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Expand all
          </button>
          <span className="text-subtle">|</span>
          <button
            onClick={() => setExpandedDays([])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Collapse all
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {itineraryData.map((day, index) => {
          const isExpanded = expandedDays.includes(day.id);
          const isSelected = selectedDay === day.id;

          return (
            <div
              key={day.id}
              className={`group relative rounded-lg border transition-all ${
                isSelected
                  ? "border-primary/50 bg-primary-subtle"
                  : "border-border-muted bg-surface hover:border-border"
              }`}
            >
              {/* Timeline connector */}
              {index < itineraryData.length - 1 && (
                <div className="absolute -bottom-2 left-6 h-2 w-px bg-border-muted" />
              )}

              {/* Header */}
              <button
                onClick={() => toggleDay(day.id)}
                className="flex w-full items-center gap-3 p-3"
              >
                {/* Day number */}
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    day.isTransit
                      ? "bg-warning-muted text-warning"
                      : isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                  }`}
                >
                  {day.day}
                </div>

                {/* Main info */}
                <div className="flex flex-1 items-center gap-3 text-left">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {day.city}
                      </span>
                      {day.isTransit && (
                        <span className="rounded bg-warning-muted px-1.5 py-0.5 text-[10px] font-medium text-warning">
                          Transit
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {day.date} - {day.neighborhood}
                    </div>
                  </div>

                  {/* Preview when collapsed */}
                  {!isExpanded && (
                    <div className="hidden max-w-xs truncate text-xs text-subtle lg:block">
                      {day.morning}
                    </div>
                  )}
                </div>

                {/* Expand icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`text-muted-foreground transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-border-muted px-3 pb-3 pt-3">
                  <div className="ml-11 space-y-3">
                    {/* Time slots */}
                    <div className="grid gap-2 sm:grid-cols-3">
                      {day.morning && (
                        <div className="rounded-md bg-surface-elevated p-2.5">
                          <div className="mb-1 flex items-center gap-1.5">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-warning"
                            >
                              <circle cx="12" cy="12" r="4" />
                              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                            </svg>
                            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                              Morning
                            </span>
                          </div>
                          <p className="text-xs text-foreground">
                            {day.morning}
                          </p>
                        </div>
                      )}
                      {day.afternoon && (
                        <div className="rounded-md bg-surface-elevated p-2.5">
                          <div className="mb-1 flex items-center gap-1.5">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-primary"
                            >
                              <circle cx="12" cy="12" r="4" />
                              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                            </svg>
                            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                              Afternoon
                            </span>
                          </div>
                          <p className="text-xs text-foreground">
                            {day.afternoon}
                          </p>
                        </div>
                      )}
                      {day.evening && (
                        <div className="rounded-md bg-surface-elevated p-2.5">
                          <div className="mb-1 flex items-center gap-1.5">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-muted-foreground"
                            >
                              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                            </svg>
                            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                              Evening
                            </span>
                          </div>
                          <p className="text-xs text-foreground">
                            {day.evening}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Dining & Notes row */}
                    <div className="flex flex-wrap items-center gap-3">
                      {day.dining && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-muted-foreground"
                          >
                            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                          </svg>
                          <span className="text-muted-foreground">
                            {day.dining}
                          </span>
                        </div>
                      )}
                      {day.notes && (
                        <div className="flex items-center gap-1.5 rounded-md bg-warning-muted px-2 py-1 text-xs text-warning">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4M12 8h.01" />
                          </svg>
                          {day.notes}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <button className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                        Edit day
                      </button>
                      <span className="text-subtle">|</span>
                      <button className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                        Regenerate
                      </button>
                      <span className="text-subtle">|</span>
                      <button className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                        Add activity
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
