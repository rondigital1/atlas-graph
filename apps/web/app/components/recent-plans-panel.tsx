"use client";

import Link from "next/link";
import { recentPlans } from "../lib/mock/recent-plans";
import type { PlanStatus } from "../lib/mock/recent-plans";

const STATUS_STYLES: Record<PlanStatus, string> = {
  generated: "bg-primary/15 text-primary",
  saved: "bg-success-muted text-success",
  draft: "bg-muted text-muted-foreground",
};

const STATUS_LABELS: Record<PlanStatus, string> = {
  generated: "Generated",
  saved: "Saved",
  draft: "Draft",
};

export function RecentPlansPanel() {
  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border-muted px-4 py-3">
        <span className="text-sm font-medium text-foreground">Recent Plans</span>
        <button
          type="button"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          See all
        </button>
      </div>

      <ul className="divide-y divide-border-muted">
        {recentPlans.map((plan) => (
          <li key={plan.id}>
            <Link
              href="/results"
              className="flex items-start justify-between gap-3 px-4 py-3 transition-colors hover:bg-surface-elevated"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">
                  {plan.title}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {plan.destinations.join(" · ")}
                </p>
                <p className="mt-1 text-[10px] text-subtle">{plan.updatedAt}</p>
              </div>
              <span
                className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium ${STATUS_STYLES[plan.status]}`}
              >
                {STATUS_LABELS[plan.status]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
