"use client";

import { useState } from "react";

const quickAdjustments = [
  { id: "relaxing", label: "More relaxing" },
  { id: "beach", label: "Add beach time" },
  { id: "food", label: "Better food spots" },
  { id: "budget", label: "Reduce costs" },
  { id: "layovers", label: "Fewer layovers" },
  { id: "city", label: "Add a city" },
  { id: "remote", label: "Remote work friendly" },
  { id: "luxury", label: "More luxury" },
];

interface AdjustmentBarProps {
  onRegeneratingChange?: (isRegenerating: boolean) => void;
}

export function AdjustmentBar({ onRegeneratingChange }: AdjustmentBarProps) {
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const toggleChip = (id: string) => {
    setActiveChips((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleRegenerate = () => {
    if (activeChips.length === 0 && !prompt.trim()) { return; }
    setIsRegenerating(true);
    onRegeneratingChange?.(true);
    setTimeout(() => {
      setIsRegenerating(false);
      onRegeneratingChange?.(false);
      setActiveChips([]);
      setPrompt("");
    }, 2000);
  };

  return (
    <div className="border-b border-border-muted bg-background">
      <div className="mx-auto max-w-[1600px] px-4 py-3 lg:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Label */}
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
            <span className="text-sm font-medium text-foreground">
              Adjust Plan
            </span>
          </div>

          {/* Quick adjustment chips */}
          <div className="flex flex-1 flex-wrap items-center gap-1.5">
            {quickAdjustments.map((adj) => (
              <button
                key={adj.id}
                onClick={() => toggleChip(adj.id)}
                disabled={isRegenerating}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  activeChips.includes(adj.id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-elevated text-muted-foreground hover:bg-muted hover:text-foreground"
                } disabled:opacity-50`}
              >
                {adj.label}
              </button>
            ))}
          </div>

          {/* Custom prompt input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 lg:w-72">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Or describe changes..."
                disabled={isRegenerating}
                className="h-8 w-full rounded-md border border-border bg-surface-elevated px-3 pr-8 text-sm text-foreground placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-subtle"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <button
              onClick={handleRegenerate}
              disabled={
                isRegenerating ||
                (activeChips.length === 0 && !prompt.trim())
              }
              className="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRegenerating ? (
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
                  <span>Adjusting...</span>
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
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span>Apply</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
