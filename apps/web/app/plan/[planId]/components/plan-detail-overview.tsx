import type { PlanOverviewViewModel } from "../../../lib/types";

interface Props {
  overview: PlanOverviewViewModel;
}

export function PlanDetailOverview({ overview }: Props) {
  return (
    <section className="space-y-6">
      {/* Headline */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {overview.destination}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {overview.tripStyleSummary}
        </p>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-full bg-surface-elevated px-3 py-1.5 text-sm text-foreground">
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {overview.dates}
        </div>
        {overview.budget && (
          <div className="flex items-center gap-1.5 rounded-full bg-surface-elevated px-3 py-1.5 text-sm text-foreground">
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground"
            >
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            {overview.budget}
          </div>
        )}
      </div>

      {/* Rationale */}
      {overview.rationale && (
        <div className="rounded-xl border border-border-muted bg-surface p-5">
          <h2 className="mb-2 text-sm font-semibold text-foreground">
            Trip Rationale
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {overview.rationale}
          </p>
        </div>
      )}
    </section>
  );
}
