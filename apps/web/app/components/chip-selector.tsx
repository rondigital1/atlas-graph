"use client";

interface ChipOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ChipSelectorProps {
  label: string;
  options: ChipOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
  columns?: 2 | 3 | 4 | 5 | 6;
}

export function ChipSelector({
  label,
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
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {multiple && (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            (select multiple)
          </span>
        )}
      </label>
      <div className={`grid gap-2 ${gridCols[columns]}`}>
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => handleClick(option.id)}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                isSelected
                  ? "border-primary bg-accent-muted text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
              }`}
            >
              {option.icon}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
