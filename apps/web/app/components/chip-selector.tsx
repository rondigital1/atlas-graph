"use client";

import type { ChipOption } from "../lib/types";

interface ChipSelectorProps {
  label: string;
  description?: string;
  options: ChipOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
  columns?: 2 | 3 | 4 | 5 | 6;
}

export function ChipSelector({
  label,
  description,
  options,
  selected,
  onChange,
  multiple = false,
  columns = 4,
}: ChipSelectorProps) {
  const handleClick = (id: string) => {
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

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-3 sm:grid-cols-6",
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
        className={`grid gap-2 ${gridCols[columns]}`}
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
              className={`group relative flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                isSelected
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border bg-surface text-muted-foreground hover:border-border hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              {isSelected && (
                <span
                  aria-hidden="true"
                  className="absolute left-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary"
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-foreground"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              )}
              <span className={isSelected ? "ml-3" : ""}>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
