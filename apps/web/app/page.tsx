"use client";

import { useState } from "react";
import { Header } from "./components/header";
import { PlanningWorkspace } from "./components/planning-workspace";
import { RecentPlansSidebar } from "./components/recent-plans-sidebar";

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex flex-1 flex-col">
          {/* Top Bar */}
          <div className="border-b border-border-subtle px-4 py-3 lg:px-6">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Plan Your Trip
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create a personalized travel itinerary powered by AI
                </p>
              </div>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12h18" />
                  <path d="M3 6h18" />
                  <path d="M3 18h18" />
                </svg>
                <span className="hidden sm:inline">Recent Plans</span>
              </button>
            </div>
          </div>

          {/* Workspace Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-6">
            <div className="mx-auto flex max-w-[1400px] flex-col">
              <PlanningWorkspace />
            </div>
          </div>
        </main>

        {/* Recent Plans Sidebar */}
        <RecentPlansSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </div>
  );
}
