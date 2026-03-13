"use client";

import { useState } from "react";
import { versionHistory } from "../../lib/mock/itinerary-data";

export function PlanFooter() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <footer className="border-t border-border-muted bg-surface/50">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>$2,450 flights</span>
            <span aria-hidden="true" className="text-border">·</span>
            <span>$2,550 stays</span>
            <span aria-hidden="true" className="text-border">·</span>
            <span>$1,200 other</span>
          </div>
          <span aria-hidden="true" className="hidden text-border sm:inline">·</span>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
            <span>Ideal season (18-24C, low rain)</span>
          </div>
          <span aria-hidden="true" className="hidden text-border sm:inline">·</span>
          <button
            type="button"
            onClick={() => setShowHistory(true)}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Version history
          </button>
        </div>
      </footer>

      {showHistory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowHistory(false)}
        >
          <div
            className="mx-4 w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Version History</h2>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {versionHistory.map((version) => (
                <div
                  key={version.id}
                  className={`rounded-md p-3 ${version.isActive ? "border border-primary/30 bg-primary-subtle" : "bg-surface-elevated"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${version.isActive ? "text-primary" : "text-foreground"}`}>
                        {version.label}
                      </span>
                      {version.isActive && (
                        <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-medium text-primary-foreground">
                          Active
                        </span>
                      )}
                    </div>
                    <time className="text-xs text-muted-foreground">{version.timestamp}</time>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{version.changes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
