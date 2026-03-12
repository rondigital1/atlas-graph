"use client";

import type { TripSelections } from "../lib/types";

interface AIPreviewPanelProps {
  selections: TripSelections;
  prompt: string;
  currentStep: number;
}

export function AIPreviewPanel({
  selections,
  prompt,
  currentStep,
}: AIPreviewPanelProps) {
  const hasAnySelections =
    selections.destinationType.length > 0 ||
    selections.tripType.length > 0 ||
    selections.planningMode.length > 0;

  const getContextScore = () => {
    let score = 0;
    if (selections.destinationType.length > 0) { score += 20; }
    if (selections.tripType.length > 0) { score += 15; }
    if (selections.planningMode.length > 0) { score += 15; }
    if (selections.budget.length > 0) { score += 15; }
    if (selections.interests.length > 0) {
      score += Math.min(selections.interests.length * 5, 15);
    }
    if (selections.travelPace.length > 0) { score += 10; }
    if (selections.accommodation.length > 0) { score += 5; }
    if (prompt.trim().length > 20) { score += 5; }
    return Math.min(score, 100);
  };

  const contextScore = getContextScore();

  const getInsights = () => {
    const insights: { text: string }[] = [];

    if (
      selections.destinationType.includes("beach") &&
      selections.destinationType.includes("city")
    ) {
      insights.push({
        text: "Great combo - coastal cities like Barcelona or Lisbon",
      });
    }
    if (
      selections.tripType.includes("solo") &&
      selections.destinationType.includes("adventure")
    ) {
      insights.push({ text: "Solo adventure trips work best with 7+ days" });
    }
    if (
      selections.budget.includes("budget") &&
      selections.accommodation.includes("boutique")
    ) {
      insights.push({ text: "Boutique hotels may exceed budget constraints" });
    }
    if (selections.interests.length >= 3) {
      insights.push({
        text: "Rich interest profile will improve recommendations",
      });
    }
    if (selections.constraints.includes("remote-work")) {
      insights.push({
        text: "Will prioritize destinations with reliable connectivity",
      });
    }

    return insights.slice(0, 2);
  };

  const insights = getInsights();

  const formatSelection = (items: string[], maxShow = 3) => {
    if (items.length === 0) { return null; }
    const formatted = items
      .slice(0, maxShow)
      .map((i) => i.charAt(0).toUpperCase() + i.slice(1).replace("-", " "));
    const remaining = items.length - maxShow;
    return remaining > 0
      ? `${formatted.join(", ")} +${remaining}`
      : formatted.join(", ");
  };

  const stepHint = [
    "Add trip type and duration for better results",
    "Select interests to personalize recommendations",
    "Set preferences to refine logistics",
    "Add details in the prompt for specificity",
  ][currentStep];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-muted px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center rounded bg-primary/15"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-sm font-medium text-foreground">Context</span>
        </div>
        {hasAnySelections && (
          <div className="flex items-center gap-1.5" aria-live="polite">
            <div
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary"
            />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {!hasAnySelections ? (
          <div className="flex h-full flex-col items-center justify-center px-6 py-8 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-elevated">
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              Make selections to see context
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              AI uses this to personalize your plan
            </p>
          </div>
        ) : (
          <div className="space-y-px p-2">
            {/* Context Score */}
            <div className="rounded-lg bg-surface-elevated p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Context Quality
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {contextScore}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={contextScore}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Context quality"
                className="h-1.5 overflow-hidden rounded-full bg-muted"
              >
                <div
                  aria-hidden="true"
                  className={`h-full rounded-full transition-all duration-500 ${
                    contextScore >= 70
                      ? "bg-success"
                      : contextScore >= 40
                        ? "bg-primary"
                        : "bg-warning"
                  }`}
                  style={{ width: `${contextScore}%` }}
                />
              </div>
              {contextScore < 60 && stepHint && (
                <p className="mt-2 text-xs text-muted-foreground">{stepHint}</p>
              )}
            </div>

            {/* Collected Parameters */}
            <div className="rounded-lg p-3">
              <span className="mb-2.5 block text-xs font-medium text-muted-foreground">
                Parameters
              </span>
              <dl className="space-y-2">
                {selections.destinationType.length > 0 && (
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-xs text-subtle">Type</dt>
                    <dd className="text-right text-xs font-medium text-foreground">
                      {formatSelection(selections.destinationType)}
                    </dd>
                  </div>
                )}
                {selections.tripType.length > 0 && (
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-xs text-subtle">Travelers</dt>
                    <dd className="text-right text-xs font-medium text-foreground">
                      {formatSelection(selections.tripType)}
                    </dd>
                  </div>
                )}
                {selections.planningMode.length > 0 && (
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-xs text-subtle">Duration</dt>
                    <dd className="text-right text-xs font-medium text-foreground">
                      {formatSelection(selections.planningMode)}
                    </dd>
                  </div>
                )}
                {selections.budget.length > 0 && (
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-xs text-subtle">Budget</dt>
                    <dd className="text-right text-xs font-medium text-foreground">
                      {formatSelection(selections.budget)}
                    </dd>
                  </div>
                )}
                {selections.travelPace.length > 0 && (
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-xs text-subtle">Pace</dt>
                    <dd className="text-right text-xs font-medium text-foreground">
                      {formatSelection(selections.travelPace)}
                    </dd>
                  </div>
                )}
                {selections.interests.length > 0 && (
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-xs text-subtle">Interests</dt>
                    <dd className="text-right text-xs font-medium text-foreground">
                      {formatSelection(selections.interests, 2)}
                    </dd>
                  </div>
                )}
                {selections.accommodation.length > 0 && (
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-xs text-subtle">Stay</dt>
                    <dd className="text-right text-xs font-medium text-foreground">
                      {formatSelection(selections.accommodation)}
                    </dd>
                  </div>
                )}
                {selections.constraints.length > 0 && (
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-xs text-subtle">Requirements</dt>
                    <dd className="text-right text-xs font-medium text-foreground">
                      {formatSelection(selections.constraints, 2)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* AI Insights */}
            {insights.length > 0 && (
              <div className="rounded-lg border border-border-muted p-3">
                <span className="mb-2 block text-xs font-medium text-muted-foreground">
                  Insights
                </span>
                <ul className="space-y-2">
                  {insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg
                        aria-hidden="true"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 shrink-0 text-primary"
                      >
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                      </svg>
                      <span className="text-xs leading-relaxed text-muted-foreground">
                        {insight.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prompt Preview */}
            {prompt.trim().length > 0 && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <span className="mb-1.5 block text-xs font-medium text-primary">
                  Request
                </span>
                <p className="line-clamp-3 text-xs leading-relaxed text-foreground/80">
                  {prompt}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {hasAnySelections && (
        <div className="border-t border-border-muted px-4 py-2.5">
          <p className="text-center text-xs text-muted-foreground" aria-live="polite">
            {contextScore >= 70
              ? "Ready to generate"
              : `${Math.ceil((70 - contextScore) / 15)} more selections recommended`}
          </p>
        </div>
      )}
    </div>
  );
}
