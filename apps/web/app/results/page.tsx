"use client";

import { useEffect, useState } from "react";
import { ResultsHeader } from "./components/results-header";
import { PlanSummaryBar } from "./components/plan-summary-bar";
import { AdjustmentBar } from "./components/adjustment-bar";
import { ItineraryTimeline } from "./components/itinerary-timeline";
import { FlightsSection } from "./components/flights-section";
import { AccommodationsSection } from "./components/accommodations-section";
import { ExperiencesSection } from "./components/experiences-section";
import { PlanFooter } from "./components/plan-footer";

const TABS = [
  { id: "itinerary", label: "Itinerary" },
  { id: "flights", label: "Flights" },
  { id: "stays", label: "Stays" },
  { id: "experiences", label: "Experiences" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-surface-elevated ${className ?? ""}`} />
  );
}

function ResultsLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <SkeletonBlock className="mb-2 h-8 w-96 max-w-full" />
      <SkeletonBlock className="mb-6 h-4 w-64" />
      <div className="mb-4 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-8 w-20" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-14" />
        ))}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("itinerary");

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ResultsHeader />

      {isLoading ? (
        <ResultsLoadingSkeleton />
      ) : (
        <>
          <PlanSummaryBar />
          <AdjustmentBar onRegeneratingChange={setIsRegenerating} />

          <main className="mx-auto max-w-4xl px-4 py-6">
            {/* Tab nav with budget total inline */}
            <div className="flex items-center justify-between border-b border-border-muted">
              <div className="flex items-center gap-1" role="tablist">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    onClick={() => setActiveTab(tab.id)}
                    aria-selected={activeTab === tab.id}
                    className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
                    )}
                  </button>
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">$6,200 est.</span>
            </div>

            {/* Tab content */}
            <div className="relative mt-4" role="tabpanel">
              {isRegenerating && (
                <div aria-live="polite" aria-label="Regenerating plan" className="absolute inset-0 z-10 flex items-start justify-center rounded-lg bg-[rgba(9,9,11,0.55)] pt-10 backdrop-blur-[2px]">
                  <div className="flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted-foreground shadow-lg">
                    <svg aria-hidden="true" className="h-4 w-4 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Regenerating plan...
                  </div>
                </div>
              )}

              {activeTab === "itinerary" && <ItineraryTimeline />}
              {activeTab === "flights" && <FlightsSection />}
              {activeTab === "stays" && <AccommodationsSection />}
              {activeTab === "experiences" && <ExperiencesSection />}
            </div>
          </main>

          <PlanFooter />
        </>
      )}
    </div>
  );
}
