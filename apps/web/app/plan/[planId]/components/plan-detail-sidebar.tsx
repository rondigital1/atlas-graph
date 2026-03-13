import type { PlanRecommendationViewModel } from "../../../lib/types";

interface Props {
  recommendations: PlanRecommendationViewModel[];
  warnings: string[];
  practicalNotes: string[];
}

export function PlanDetailSidebar({
  recommendations,
  warnings,
  practicalNotes,
}: Props) {
  const hasContent =
    recommendations.length > 0 ||
    warnings.length > 0 ||
    practicalNotes.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <aside className="space-y-6">
      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-amber-400"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
            <h3 className="text-sm font-semibold text-foreground">
              Travel Warnings
            </h3>
          </div>
          <ul className="space-y-1.5">
            {warnings.map((warning, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top Recommendations */}
      {recommendations.length > 0 && (
        <div className="rounded-xl border border-border-muted bg-surface p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Top Recommendations
          </h3>
          <ul className="space-y-3">
            {recommendations.map((rec, i) => (
              <li key={i}>
                <p className="text-sm font-medium text-foreground">
                  {rec.name}
                </p>
                <p className="text-xs text-muted-foreground">{rec.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Practical Notes */}
      {practicalNotes.length > 0 && (
        <div className="rounded-xl border border-border-muted bg-surface p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Practical Notes
          </h3>
          <ul className="space-y-2">
            {practicalNotes.map((note, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 block h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground"
                />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
