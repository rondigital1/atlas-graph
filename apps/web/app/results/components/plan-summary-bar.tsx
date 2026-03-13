"use client";

import { VariantsDropdown } from "./variants-dropdown";

export function PlanSummaryBar() {
  return (
    <div className="border-b border-border-muted bg-surface/50">
      <div className="mx-auto max-w-4xl px-4 py-5">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
          10-Day Spain & South France Escape
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>Oct 15–25</span>
          <span aria-hidden="true" className="text-border">·</span>
          <span>2 travelers</span>
          <span aria-hidden="true" className="text-border">·</span>
          <span>Mid-range</span>
          <span aria-hidden="true" className="text-border">·</span>
          <span className="font-medium text-primary">95% match</span>
        </div>
        <div className="mt-3">
          <VariantsDropdown />
        </div>
      </div>
    </div>
  );
}
