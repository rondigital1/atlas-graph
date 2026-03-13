"use client";

import Link from "next/link";
import { useState } from "react";
import { OverflowMenu } from "./overflow-menu";

export function ResultsHeader() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
    }, 1000);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border-muted bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-4">
        {/* Left: Back + Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Planner
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Save */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex h-8 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-all ${
              isSaved
                ? "border-success/30 bg-success-muted text-success"
                : "border-border bg-surface-elevated text-foreground hover:border-border hover:bg-muted"
            } disabled:opacity-50`}
          >
            {isSaving ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : isSaved ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            )}
            <span className="hidden sm:inline">
              {isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}
            </span>
          </button>

          {/* Regenerate */}
          <button className="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          <OverflowMenu />
        </div>
      </div>
    </header>
  );
}
