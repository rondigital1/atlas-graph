"use client";

import type { ChipOption } from "../lib/types";

interface ChipSelectorProps {
  label: string;
  description?: string;
  disabled?: boolean;
  options: ChipOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
}

export function ChipSelector({
  label,
  description,
  disabled = false,
  options,
  selected,
  onChange,
  multiple = false,
}: ChipSelectorProps) {
  const handleClick = (id: string) => {
    if (disabled) {
      return;
    }

    if (multiple) {
      if (selected.includes(id)) {
        onChange(selected.filter((s) => s !== id));
      } else {
        onChange([...selected, id]);
      }
    } else {
      onChange(selected.includes(id) ? [] : [id]);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {multiple && selected.length > 0 && (
          <span className="text-xs text-primary" aria-live="polite">
            {selected.length} selected
          </span>
        )}
      </div>
      <div
        className="flex flex-wrap gap-2"
        role={multiple ? "group" : "radiogroup"}
        aria-label={label}
      >
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleClick(option.id)}
              aria-pressed={isSelected}
              disabled={disabled}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                isSelected
                  ? "border-primary/70 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-border/80 hover:bg-surface-elevated hover:text-foreground"
              } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {multiple && isSelected && (
                <svg
                  aria-hidden="true"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
