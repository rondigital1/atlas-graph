"use client";

import { useRef, useCallback } from "react";

import type { SubmissionStage } from "../lib/submit-plan-flow";

interface PromptInputProps {
  disabled?: boolean;
  helperText?: string;
  isSubmitting: boolean;
  submissionStage: SubmissionStage;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSurprise: () => void;
  canSubmit: boolean;
}

export function PromptInput({
  disabled = false,
  helperText,
  isSubmitting,
  submissionStage,
  value,
  onChange,
  onSubmit,
  onSurprise,
  canSubmit,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const submitLabel =
    submissionStage === "saving"
      ? "Saving trip..."
      : submissionStage === "generating"
        ? "Generating itinerary..."
        : "Generate Plan";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 192)}px`;
    },
    [onChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-border bg-surface transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
        <textarea
          ref={textareaRef}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={3}
          className="w-full resize-none bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          placeholder="e.g., A 10-day food and culture trip through Spain and southern France for two, mid-range budget..."
        />
        <div className="flex items-center justify-between border-t border-border-muted bg-surface-elevated px-3 py-2">
          <span className="text-xs text-muted-foreground">{value.length} characters</span>
          <span className="hidden text-xs text-muted-foreground sm:block">
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              {typeof navigator !== "undefined" && navigator?.platform?.includes("Mac") ? "Cmd" : "Ctrl"}+Enter
            </kbd>
            {" "}to generate
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {submitLabel}
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
              Generate Plan
            </>
          )}
        </button>
        <button
          onClick={onSurprise}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-surface-elevated hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
          <span className="hidden sm:inline">Surprise Me</span>
        </button>
      </div>
      {helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
    </div>
  );
}
