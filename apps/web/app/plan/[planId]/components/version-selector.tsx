"use client";

import { useRef, useState } from "react";

import type {
  StatusTone,
  VersionListItemViewModel,
  VersionListViewModel,
} from "../../../lib/types";

const STATUS_STYLES: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  danger: "bg-destructive/15 text-destructive",
};

interface Props {
  versions: VersionListViewModel;
  onVersionSelect: (versionId: string) => void;
}

function VersionItem({
  item,
  isActive,
  onSelect,
}: {
  item: VersionListItemViewModel;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors ${
        isActive
          ? "bg-primary/10 text-foreground"
          : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{item.label}</span>
          {item.isCurrent && (
            <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[9px] font-medium text-primary">
              Current
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[11px] text-subtle">{item.generatedAt}</p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${STATUS_STYLES[item.statusTone]}`}
        >
          {item.statusLabel}
        </span>
        {isActive && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </button>
  );
}

export function VersionSelector({ versions, onVersionSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (versions.state === "empty") {
    return null;
  }

  const activeItem = versions.items.find(
    (item) => item.id === versions.activeVersionId
  );

  if (versions.state === "single" && activeItem) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <path d="M12 8v4l3 3" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="text-sm font-medium text-foreground">
            {activeItem.label}
          </span>
        </div>
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${STATUS_STYLES[activeItem.statusTone]}`}
        >
          {activeItem.statusLabel}
        </span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={(e) => {
          if (!containerRef.current?.contains(e.relatedTarget)) {
            setIsOpen(false);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsOpen(false);
          }
        }}
        className="flex items-center gap-2 rounded-lg border border-border-muted px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
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
          className="text-muted-foreground"
        >
          <path d="M12 8v4l3 3" />
          <circle cx="12" cy="12" r="10" />
        </svg>
        <span>{activeItem?.label ?? "Select version"}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-1 w-72 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
          <div className="divide-y divide-border-muted">
            {versions.items.map((item) => (
              <VersionItem
                key={item.id}
                item={item}
                isActive={item.id === versions.activeVersionId}
                onSelect={() => {
                  onVersionSelect(item.id);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
