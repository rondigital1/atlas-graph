"use client";

import Link from "next/link";
import type { RecentRunsPanelViewModel, StatusTone } from "../lib/types";

const STATUS_STYLES: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  danger: "bg-destructive/15 text-destructive",
};

export function RecentPlansPanel({
  panel,
}: {
  panel: RecentRunsPanelViewModel;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border-muted px-4 py-3">
        <span className="text-sm font-medium text-foreground">Recent Runs</span>
      </div>

      {panel.state === "ready" ? (
        <ul className="divide-y divide-border-muted">
          {panel.items.map((run) => (
            <li key={run.id}>
              <Link
                href={run.href}
                className="flex items-start justify-between gap-3 px-4 py-3 transition-colors hover:bg-surface-elevated"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">
                    {run.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {run.subtitle}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[10px] text-subtle">
                    {run.meta}
                  </p>
                </div>
                <span
                  className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium ${STATUS_STYLES[run.statusTone]}`}
                >
                  {run.statusLabel}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-4 py-5 text-xs text-muted-foreground">
          {panel.state === "empty"
            ? "No persisted runs yet."
            : "Recent runs are unavailable right now."}
        </div>
      )}
    </div>
  );
}
