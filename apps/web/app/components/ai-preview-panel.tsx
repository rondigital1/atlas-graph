"use client";

import type { TripSelections } from "./planning-workspace";

interface AIPreviewPanelProps {
  selections: TripSelections;
  prompt: string;
}

export function AIPreviewPanel({ selections, prompt }: AIPreviewPanelProps) {
  const hasSelections =
    selections.destinationType.length > 0 ||
    selections.tripType.length > 0 ||
    selections.planningMode.length > 0 ||
    prompt.trim().length > 0;

  const getVibeDescription = () => {
    const vibes = [];
    if (selections.destinationType.length > 0) {
      vibes.push(
        selections.destinationType
          .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
          .join(" & ")
      );
    }
    if (selections.tripType.length > 0) {
      vibes.push(`${selections.tripType[0]} trip`);
    }
    return vibes.length > 0 ? vibes.join(" - ") : "Select preferences to begin";
  };

  const getBudgetLabel = () => {
    const budgetMap: Record<string, string> = {
      budget: "$",
      moderate: "$$",
      premium: "$$$",
      luxury: "$$$$",
    };
    return selections.budget.length > 0
      ? budgetMap[selections.budget[0]] || "$$"
      : "--";
  };

  const getConfidenceScore = () => {
    let score = 0;
    if (selections.destinationType.length > 0) score += 20;
    if (selections.tripType.length > 0) score += 15;
    if (selections.planningMode.length > 0) score += 15;
    if (selections.budget.length > 0) score += 10;
    if (selections.interests.length > 0) score += 15;
    if (prompt.trim().length > 20) score += 25;
    return Math.min(score, 100);
  };

  const confidence = getConfidenceScore();

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="border-b border-border-subtle px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            AI Plan Preview
          </h3>
          <span className="flex items-center gap-1.5 rounded-full bg-accent-muted px-2 py-0.5 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Live
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!hasSelections ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              Start selecting preferences to see your plan preview
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Confidence Score */}
            <div className="rounded-lg border border-border-subtle bg-muted/50 p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Plan Confidence</span>
                <span className="font-medium text-foreground">
                  {confidence}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>

            {/* Vibe Summary */}
            <div className="rounded-lg border border-border-subtle p-3">
              <p className="mb-1 text-xs text-muted-foreground">
                Destination Vibe
              </p>
              <p className="text-sm font-medium text-foreground">
                {getVibeDescription()}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border-subtle p-3">
                <p className="mb-1 text-xs text-muted-foreground">Budget</p>
                <p className="text-lg font-semibold text-foreground">
                  {getBudgetLabel()}
                </p>
              </div>
              <div className="rounded-lg border border-border-subtle p-3">
                <p className="mb-1 text-xs text-muted-foreground">Duration</p>
                <p className="text-lg font-semibold text-foreground">
                  {selections.planningMode.length > 0
                    ? selections.planningMode[0]
                        .replace("-", " ")
                        .replace("week", "wk")
                    : "--"}
                </p>
              </div>
            </div>

            {/* Interests */}
            {selections.interests.length > 0 && (
              <div className="rounded-lg border border-border-subtle p-3">
                <p className="mb-2 text-xs text-muted-foreground">
                  Focus Areas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selections.interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full bg-accent-muted px-2 py-0.5 text-xs font-medium text-primary"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Itinerary */}
            <div className="rounded-lg border border-border-subtle p-3">
              <p className="mb-3 text-xs text-muted-foreground">
                Sample Structure
              </p>
              <div className="space-y-2">
                {[
                  { day: "Day 1-2", desc: "Arrival & City Exploration" },
                  { day: "Day 3-4", desc: "Cultural Experiences" },
                  { day: "Day 5-6", desc: "Local Adventures" },
                  { day: "Day 7", desc: "Departure" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-xs opacity-60"
                  >
                    <span className="w-14 shrink-0 font-medium text-muted-foreground">
                      {item.day}
                    </span>
                    <span className="text-foreground">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt Preview */}
            {prompt.trim().length > 0 && (
              <div className="rounded-lg border border-primary/30 bg-accent-muted/50 p-3">
                <p className="mb-2 text-xs text-primary">Your Request</p>
                <p className="line-clamp-3 text-xs text-foreground/80">
                  {prompt}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border-subtle p-4">
        <p className="text-center text-xs text-muted-foreground">
          Preview updates as you select preferences
        </p>
      </div>
    </div>
  );
}
