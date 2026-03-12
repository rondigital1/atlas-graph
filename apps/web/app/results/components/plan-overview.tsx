"use client";

import { useState } from "react";

interface PlanOverviewProps {
  activeVariant: string;
  onVariantChange: (variant: string) => void;
}

const variants = [
  { id: "best", label: "Best Match", badge: "95%" },
  { id: "budget", label: "Budget", badge: "-30%" },
  { id: "luxury", label: "Luxury", badge: "+45%" },
  { id: "relaxed", label: "Relaxed", badge: null },
  { id: "foodie", label: "Food Focus", badge: null },
];

export function PlanOverview({
  activeVariant,
  onVariantChange,
}: PlanOverviewProps) {
  const [loadingVariant, setLoadingVariant] = useState<string | null>(null);

  const handleVariantChange = (id: string) => {
    if (id === activeVariant || loadingVariant !== null) { return; }
    setLoadingVariant(id);
    setTimeout(() => {
      onVariantChange(id);
      setLoadingVariant(null);
    }, 800);
  };

  return (
    <div className="border-b border-border-muted bg-surface/50">
      <div className="mx-auto max-w-[1600px] px-4 py-5 lg:px-6">
        {/* Variant Tabs */}
        <div className="mb-4 flex items-center gap-1 overflow-x-auto pb-1">
          <span className="mr-2 text-xs font-medium text-muted-foreground">
            Plan Variants
          </span>
          {variants.map((variant) => {
            const isActive = activeVariant === variant.id;
            const isLoading = loadingVariant === variant.id;
            return (
              <button
                key={variant.id}
                onClick={() => handleVariantChange(variant.id)}
                disabled={loadingVariant !== null}
                aria-pressed={isActive}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all disabled:cursor-wait ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isLoading
                      ? "bg-surface-elevated text-foreground"
                      : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                {isLoading && (
                  <svg
                    aria-hidden="true"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="animate-spin"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                )}
                {variant.label}
                {variant.badge && !isLoading && (
                  <span
                    className={`text-xs ${
                      isActive ? "opacity-80" : "text-subtle"
                    }`}
                  >
                    {variant.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Trip Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-primary-muted px-2 py-0.5 text-xs font-medium text-primary">
                Generated Plan
              </span>
              <span className="text-xs text-muted-foreground">v3 - Latest</span>
            </div>
            <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
              10-Day Spain & South France Escape
            </h1>
            <p className="mb-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              A carefully curated journey through Mediterranean culture,
              blending Barcelona&apos;s architecture with Provence&apos;s
              countryside charm. Optimized for walkability, culinary discovery,
              and a balanced pace between cities.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-border-muted bg-surface px-2.5 py-1 text-xs text-foreground">
                Oct 15 - Oct 25, 2024
              </span>
              <span className="rounded-md border border-border-muted bg-surface px-2.5 py-1 text-xs text-foreground">
                2 Travelers
              </span>
              <span className="rounded-md border border-border-muted bg-surface px-2.5 py-1 text-xs text-foreground">
                Mid-Range Budget
              </span>
              <span className="rounded-md border border-border-muted bg-surface px-2.5 py-1 text-xs text-muted-foreground">
                Culture + Food
              </span>
              <span className="rounded-md border border-border-muted bg-surface px-2.5 py-1 text-xs text-muted-foreground">
                Moderate Pace
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 rounded-lg border border-border-muted bg-surface p-4 lg:gap-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">4</div>
              <div className="text-xs text-muted-foreground">Cities</div>
            </div>
            <div className="h-auto w-px bg-border-muted" />
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">10</div>
              <div className="text-xs text-muted-foreground">Nights</div>
            </div>
            <div className="h-auto w-px bg-border-muted" />
            <div className="text-center">
              <div className="flex items-center gap-1 text-lg font-semibold text-foreground">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-warning"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                4.8
              </div>
              <div className="text-xs text-muted-foreground">Hotels</div>
            </div>
            <div className="h-auto w-px bg-border-muted" />
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">95%</div>
              <div className="text-xs text-muted-foreground">Match</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
