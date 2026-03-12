import Link from "next/link";
import { Header } from "./components/header";
import { PlanningWorkspace } from "./components/planning-workspace";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      {/* Quick link to results page for demo */}
      <div className="border-b border-border-muted bg-primary-subtle">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-2">
          <span className="text-xs text-muted-foreground">Demo: View the generated itinerary results page</span>
          <Link 
            href="/results" 
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View Results
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>

      <main className="flex flex-1 flex-col">
        {/* Workspace Header */}
        <div className="border-b border-border-muted bg-surface/40">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">New Plan</span>
                <span className="rounded bg-surface-elevated px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Draft</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Save
              </button>
              <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto max-w-[1400px]">
            <PlanningWorkspace />
          </div>
        </div>
      </main>
    </div>
  );
}
