"use client";

import { useState } from "react";

interface VersionHistoryItem {
  id: string;
  label: string;
  timestamp: string;
  changes: string;
  isActive?: boolean;
}

const versionHistory: VersionHistoryItem[] = [
  {
    id: "v3",
    label: "Current",
    timestamp: "2 min ago",
    changes: "Added wine tasting, optimized hotel selection",
    isActive: true,
  },
  {
    id: "v2",
    label: "Revised",
    timestamp: "15 min ago",
    changes: "Adjusted pace, reduced early flights",
  },
  {
    id: "v1",
    label: "Initial",
    timestamp: "1 hour ago",
    changes: "First generation from preferences",
  },
];

export function AIContextPanel() {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  return (
    <div className="space-y-4">
      {/* Match Score */}
      <div className="rounded-lg border border-border-muted bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Plan Quality
          </span>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-primary">95</span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="space-y-2">
          {[
            { label: "Preference Match", value: 97 },
            { label: "Budget Alignment", value: 92 },
            { label: "Pace Balance", value: 94 },
            { label: "Experience Variety", value: 96 },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="w-28 text-xs text-muted-foreground">
                {item.label}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${item.value}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs text-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Summary */}
      <div className="rounded-lg border border-border-muted bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Estimated Budget
          </span>
          <span className="text-lg font-semibold text-foreground">$6,200</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Flights</span>
            <span className="text-foreground">$2,450</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Accommodations</span>
            <span className="text-foreground">$2,550</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Experiences</span>
            <span className="text-foreground">$480</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Est. daily expenses</span>
            <span className="text-foreground">$720</span>
          </div>
          <div className="flex items-center justify-between border-t border-border-muted pt-2">
            <span className="text-muted-foreground">Per person</span>
            <span className="font-medium text-foreground">$3,100</span>
          </div>
        </div>

        <div className="mt-3 rounded-md bg-success-muted p-2">
          <div className="flex items-center gap-1.5 text-xs text-success">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Within your mid-range budget target
          </div>
        </div>
      </div>

      {/* Trip Composition */}
      <div className="rounded-lg border border-border-muted bg-surface p-4">
        <span className="mb-3 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Trip Composition
        </span>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cities</span>
            <span className="text-foreground">4 destinations</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Transit segments</span>
            <span className="text-foreground">3 (train x2, flight x1)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Pace</span>
            <span className="text-foreground">Moderate</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Focus areas</span>
            <span className="text-foreground">Culture, Food, Architecture</span>
          </div>
        </div>
      </div>

      {/* Weather / Season */}
      <div className="rounded-lg border border-border-muted bg-surface p-4">
        <span className="mb-3 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Season & Weather
        </span>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-muted">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-warning"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">
              Ideal Season
            </div>
            <div className="text-xs text-muted-foreground">
              18-24C, low rain probability
            </div>
          </div>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          October is excellent for Spain and South France - fewer crowds, warm
          days, and harvest season for wine regions.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-border-muted bg-surface p-4">
        <span className="mb-3 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Quick Adjustments
        </span>

        <div className="space-y-2">
          {[
            { label: "Reduce budget", icon: "minus" },
            { label: "Slow down pace", icon: "pause" },
            { label: "Add more food experiences", icon: "plus" },
            { label: "Make more luxurious", icon: "star" },
            { label: "Fewer transfers", icon: "route" },
            { label: "Swap a destination", icon: "refresh" },
            { label: "Shorten trip", icon: "calendar" },
          ].map((action) => (
            <button
              key={action.label}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
            >
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
                {action.icon === "minus" && <path d="M5 12h14" />}
                {action.icon === "pause" && (
                  <>
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                  </>
                )}
                {action.icon === "plus" && (
                  <>
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </>
                )}
                {action.icon === "star" && (
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                )}
                {action.icon === "route" && (
                  <>
                    <circle cx="6" cy="19" r="3" />
                    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                    <circle cx="18" cy="5" r="3" />
                  </>
                )}
                {action.icon === "refresh" && (
                  <>
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 16h5v5" />
                  </>
                )}
                {action.icon === "calendar" && (
                  <>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </>
                )}
              </svg>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Version History */}
      <div className="rounded-lg border border-border-muted bg-surface p-4">
        <button
          onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
          className="flex w-full items-center justify-between"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Version History
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-muted-foreground transition-transform ${
              isHistoryExpanded ? "rotate-180" : ""
            }`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {isHistoryExpanded && (
          <div className="mt-3 space-y-2">
            {versionHistory.map((version) => (
              <div
                key={version.id}
                className={`rounded-md p-2 ${
                  version.isActive
                    ? "border border-primary/30 bg-primary-subtle"
                    : "bg-surface-elevated"
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium ${
                        version.isActive ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {version.label}
                    </span>
                    {version.isActive && (
                      <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-medium text-primary-foreground">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-subtle">
                    {version.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {version.changes}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save as Draft */}
      <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-elevated py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        Save as Draft
      </button>
    </div>
  );
}
