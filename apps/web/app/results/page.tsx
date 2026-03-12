"use client";

import { useState } from "react";
import { ResultsHeader } from "./components/results-header";
import { PlanOverview } from "./components/plan-overview";
import { AdjustmentBar } from "./components/adjustment-bar";
import { ItineraryTimeline } from "./components/itinerary-timeline";
import { FlightsSection } from "./components/flights-section";
import { AccommodationsSection } from "./components/accommodations-section";
import { ExperiencesSection } from "./components/experiences-section";
import { AIContextPanel } from "./components/ai-context-panel";

export default function ResultsPage() {
  const [activeVariant, setActiveVariant] = useState("best");
  const [activeTab, setActiveTab] = useState<
    "itinerary" | "flights" | "stays" | "experiences"
  >("itinerary");

  return (
    <div className="min-h-screen bg-background">
      <ResultsHeader />
      <PlanOverview
        activeVariant={activeVariant}
        onVariantChange={setActiveVariant}
      />
      <AdjustmentBar />

      <div className="mx-auto max-w-[1600px] px-4 py-6 lg:px-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 lg:max-w-[calc(100%-340px)]">
            {/* Tab Navigation */}
            <div className="mb-4 flex items-center gap-1 border-b border-border-muted">
              {(
                [
                  { id: "itinerary", label: "Itinerary" },
                  { id: "flights", label: "Flights" },
                  { id: "stays", label: "Stays" },
                  { id: "experiences", label: "Experiences" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === "itinerary" && <ItineraryTimeline />}
              {activeTab === "flights" && <FlightsSection />}
              {activeTab === "stays" && <AccommodationsSection />}
              {activeTab === "experiences" && <ExperiencesSection />}
            </div>
          </div>

          {/* Right Sidebar - AI Context Panel */}
          <aside className="w-full lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:w-80 lg:overflow-y-auto">
            <AIContextPanel />
          </aside>
        </div>
      </div>
    </div>
  );
}
