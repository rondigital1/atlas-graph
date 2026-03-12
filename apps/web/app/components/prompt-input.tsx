"use client";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSurprise: () => void;
  isGenerating: boolean;
  canSubmit: boolean;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  onSurprise,
  isGenerating,
  canSubmit,
}: PromptInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        Describe Your Ideal Trip
      </label>
      <div className="relative rounded-xl border border-border bg-card transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={4}
          className="w-full resize-none bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          placeholder="I want a 10-day trip to Spain and France with great food, walkable neighborhoods, and a mix of city and beach..."
        />
        <div className="flex items-center justify-between border-t border-border-subtle px-3 py-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
              Attach
            </button>
            <span className="text-xs text-muted-foreground/50">|</span>
            <span className="text-xs text-muted-foreground">
              {value.length} chars
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
              Cmd
            </kbd>{" "}
            +{" "}
            <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
              Enter
            </kbd>{" "}
            to submit
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onSubmit}
          disabled={!canSubmit || isGenerating}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating Plan...
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              Generate Plan
            </>
          )}
        </button>
        <button
          onClick={onSurprise}
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
          Surprise Me
        </button>
      </div>
    </div>
  );
}
