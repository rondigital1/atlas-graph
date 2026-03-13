"use client";

import type { RegenerationTriggerViewModel } from "../../../lib/types";

interface Props {
  trigger: RegenerationTriggerViewModel;
  onRegenerate: () => void;
}

export function RegenerationTrigger({ trigger, onRegenerate }: Props) {
  const isDisabled =
    trigger.availability === "unavailable" ||
    trigger.availability === "in-progress";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onRegenerate}
        disabled={isDisabled}
        title={
          trigger.availability === "unavailable"
            ? trigger.unavailableReason
            : undefined
        }
        className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors ${
          trigger.availability === "available"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-surface-elevated text-muted-foreground"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {trigger.availability === "in-progress" ? (
          <>
            <svg
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
            <span>Generating...</span>
          </>
        ) : (
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            <span>
              {trigger.availability === "available"
                ? "Regenerate Plan"
                : "Regenerate"}
            </span>
          </>
        )}
      </button>
      {trigger.availability === "unavailable" && trigger.unavailableReason && (
        <span className="hidden text-[11px] text-subtle sm:inline">
          {trigger.unavailableReason}
        </span>
      )}
    </div>
  );
}
