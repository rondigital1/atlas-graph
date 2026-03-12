"use client";

import { useState, useEffect } from "react";
import { versionHistory } from "../../lib/mock/itinerary-data";

type SaveState = "idle" | "saving" | "saved";

export function AIContextPanel() {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [restoringVersion, setRestoringVersion] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    if (saveState !== "saved") { return; }
    const t = setTimeout(() => setSaveState("idle"), 2500);
    return () => clearTimeout(t);
  }, [saveState]);

  const handleRestore = (versionId: string) => {
    setRestoringVersion(versionId);
    setTimeout(() => setRestoringVersion(null), 1200);
  };

  const handleSave = () => {
    if (saveState !== "idle") { return; }
    setSaveState("saving");
    setTimeout(() => setSaveState("saved"), 1500);
  };

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
              <div
                role="progressbar"
                aria-valuenow={item.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.label}: ${item.value}%`}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
              >
                <div
                  aria-hidden="true"
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

        <dl className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Flights</dt>
            <dd className="text-foreground">$2,450</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Accommodations</dt>
            <dd className="text-foreground">$2,550</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Experiences</dt>
            <dd className="text-foreground">$480</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Est. daily expenses</dt>
            <dd className="text-foreground">$720</dd>
          </div>
          <div className="flex items-center justify-between border-t border-border-muted pt-2">
            <dt className="text-muted-foreground">Per person</dt>
            <dd className="font-medium text-foreground">$3,100</dd>
          </div>
        </dl>

        <div className="mt-3 rounded-md bg-success-muted p-2">
          <div className="flex items-center gap-1.5 text-xs text-success">
            <svg
              aria-hidden="true"
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

        <dl className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Cities</dt>
            <dd className="text-foreground">4 destinations</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Transit segments</dt>
            <dd className="text-foreground">3 (train x2, flight x1)</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Pace</dt>
            <dd className="text-foreground">Moderate</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Focus areas</dt>
            <dd className="text-foreground">Culture, Food, Architecture</dd>
          </div>
        </dl>
      </div>

      {/* Weather / Season */}
      <div className="rounded-lg border border-border-muted bg-surface p-4">
        <span className="mb-3 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Season & Weather
        </span>

        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-muted"
          >
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
              18-24°C, low rain probability
            </div>
          </div>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          October is excellent for Spain and South France — fewer crowds, warm
          days, and harvest season for wine regions.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-border-muted bg-surface p-4">
        <span className="mb-3 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Quick Adjustments
        </span>

        <ul className="space-y-1">
          {[
            { label: "Reduce budget" },
            { label: "Slow down pace" },
            { label: "Add more food experiences" },
            { label: "Make more luxurious" },
            { label: "Fewer transfers" },
            { label: "Swap a destination" },
            { label: "Shorten trip" },
          ].map((action) => (
            <li key={action.label}>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
              >
                {action.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Version History */}
      <div className="rounded-lg border border-border-muted bg-surface p-4">
        <button
          type="button"
          onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
          aria-expanded={isHistoryExpanded}
          aria-controls="version-history-panel"
          className="flex w-full items-center justify-between"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Version History
          </span>
          <svg
            aria-hidden="true"
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
          <div id="version-history-panel" className="mt-3 space-y-2">
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
                  <time className="text-[10px] text-subtle">
                    {version.timestamp}
                  </time>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-muted-foreground">
                    {version.changes}
                  </p>
                  {!version.isActive && (
                    <button
                      type="button"
                      onClick={() => handleRestore(version.id)}
                      disabled={restoringVersion !== null}
                      className="flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                    >
                      {restoringVersion === version.id ? (
                        <>
                          <svg
                            aria-hidden="true"
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="animate-spin"
                          >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Restoring…
                        </>
                      ) : (
                        <>
                          <svg
                            aria-hidden="true"
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                          </svg>
                          Restore
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save as Draft */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saveState !== "idle"}
        className={`flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${
          saveState === "saved"
            ? "border-success/30 bg-success-muted text-success"
            : "border-border bg-surface-elevated text-foreground hover:bg-muted disabled:opacity-70"
        }`}
      >
        {saveState === "saving" && (
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        )}
        {saveState === "saved" && (
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
        {saveState === "idle" && (
          <svg
            aria-hidden="true"
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
        )}
        {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved!" : "Save as Draft"}
      </button>
    </div>
  );
}
