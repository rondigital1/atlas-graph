"use client";

import Link from "next/link";
import type { PlansListItemViewModel, StatusTone } from "../../lib/types";

const STATUS_STYLES: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  danger: "bg-destructive/15 text-destructive",
};

interface Props {
  items: PlansListItemViewModel[];
}

export function PlansList({ items }: Props) {
  return (
    <div className="rounded-xl border border-border bg-surface">
      <ul className="divide-y divide-border-muted">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-elevated"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.destination}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.tripDates}
                </p>
                {(item.budget || item.travelStyle || item.groupType) && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.budget && (
                      <span className="rounded bg-surface-elevated px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.budget}
                      </span>
                    )}
                    {item.travelStyle && (
                      <span className="rounded bg-surface-elevated px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.travelStyle}
                      </span>
                    )}
                    {item.groupType && (
                      <span className="rounded bg-surface-elevated px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.groupType}
                      </span>
                    )}
                  </div>
                )}
                <p className="mt-2 text-[10px] text-subtle">
                  Created {item.createdAt}
                </p>
              </div>
              <span
                className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${STATUS_STYLES[item.statusTone]}`}
              >
                {item.statusLabel}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
