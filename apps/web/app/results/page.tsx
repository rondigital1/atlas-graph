"use client";

import { useEffect, useState } from "react";
import { ResultsHeader } from "./components/results-header";
import { PlanOverview } from "./components/plan-overview";
import { AdjustmentBar } from "./components/adjustment-bar";
import { ItineraryTimeline } from "./components/itinerary-timeline";
import { FlightsSection } from "./components/flights-section";
import { AccommodationsSection } from "./components/accommodations-section";
import { ExperiencesSection } from "./components/experiences-section";
import { AIContextPanel } from "./components/ai-context-panel";

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
    <>
      {/* Plan overview skeleton */}
      <div className="border-b border-border-muted bg-surface/50">
        <div className="mx-auto max-w-[1600px] px-4 py-5 lg:px-6">
          <div className="mb-4 flex gap-2">
            <SkeletonBlock className="h-8 w-20" />
            <SkeletonBlock className="h-8 w-16" />
            <SkeletonBlock className="h-8 w-[72px]" />
            <SkeletonBlock className="h-8 w-[60px]" />
            <SkeletonBlock className="h-8 w-[72px]" />
          </div>
          <SkeletonBlock className="mb-2 h-4 w-24" />
          <SkeletonBlock className="mb-3 h-8 w-96 max-w-full" />
          <SkeletonBlock className="mb-3 h-4 w-[480px] max-w-full" />
          <div className="flex gap-2">
            <SkeletonBlock className="h-6 w-20" />
            <SkeletonBlock className="h-6 w-16" />
            <SkeletonBlock className="h-6 w-24" />
            <SkeletonBlock className="h-6 w-20" />
            <SkeletonBlock className="h-6 w-20" />
          </div>
        </div>
      </div>

      {/* Adjustment bar skeleton */}
      <div className="border-b border-border-muted bg-background px-4 py-3 lg:px-6">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3">
          <SkeletonBlock className="h-6 w-20 shrink-0" />
          <div className="flex flex-1 gap-2">
            <SkeletonBlock className="h-7 w-20" />
            <SkeletonBlock className="h-7 w-24" />
            <SkeletonBlock className="h-7 w-20" />
            <SkeletonBlock className="h-7 w-20" />
            <SkeletonBlock className="h-7 w-24" />
            <SkeletonBlock className="h-7 w-16" />
            <SkeletonBlock className="h-7 w-28" />
            <SkeletonBlock className="h-7 w-20" />
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="mx-auto max-w-[1600px] px-4 py-6 lg:px-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 lg:max-w-[calc(100%-340px)]">
            {/* Tab nav skeleton */}
            <div className="mb-4 flex gap-1 border-b border-border-muted pb-px">
              {["Itinerary", "Flights", "Stays", "Experiences"].map((t) => (
                <SkeletonBlock key={t} className="h-8 w-20" />
              ))}
            </div>
            {/* Content skeleton rows */}
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-14" />
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="w-full lg:w-80">
            <div className="space-y-4">
              <SkeletonBlock className="h-48" />
              <SkeletonBlock className="h-40" />
              <SkeletonBlock className="h-32" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ResultsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeVariant, setActiveVariant] = useState("best");
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
          <PlanOverview
            activeVariant={activeVariant}
            onVariantChange={setActiveVariant}
          />
          <AdjustmentBar onRegeneratingChange={setIsRegenerating} />

          <div className="mx-auto max-w-[1600px] px-4 py-6 lg:px-6">
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Main Content */}
              <div className="flex-1 lg:max-w-[calc(100%-340px)]">
                {/* Tab Navigation */}
                <div className="mb-4 flex items-center gap-1 border-b border-border-muted">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      aria-current={activeTab === tab.id ? "page" : undefined}
                      className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="relative">
                  {isRegenerating && (
                    <div
                      aria-live="polite"
                      aria-label="Regenerating plan"
                      className="absolute inset-0 z-10 flex items-start justify-center rounded-lg bg-[rgba(9,9,11,0.55)] pt-10 backdrop-blur-[2px]"
                    >
                      <div className="flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted-foreground shadow-lg">
                        <svg
                          aria-hidden="true"
                          className="h-4 w-4 animate-spin text-primary"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Regenerating plan…
                      </div>
                    </div>
                  )}

                  {activeTab === "itinerary" && <ItineraryTimeline />}
                  {activeTab === "flights" && <FlightsSection />}
                  {activeTab === "stays" && <AccommodationsSection />}
                  {activeTab === "experiences" && <ExperiencesSection />}
                </div>
              </div>

              {/* Right Sidebar */}
              <aside className="w-full lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:w-80 lg:overflow-y-auto">
                <AIContextPanel />
              </aside>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
