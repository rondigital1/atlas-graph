"use client";

import { useState, useRef, useEffect } from "react";
import { TEMPLATES } from "../lib/mock/wizard-options";

interface TemplateDropdownProps {
  disabled?: boolean;
  onSelect: (templateId: string) => void;
}

export function TemplateDropdown({
  disabled = false,
  onSelect,
}: TemplateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
      return;
    }

    if (!isOpen) {
      return;
    }
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`text-sm transition-colors ${
          disabled
            ? "cursor-not-allowed text-muted-foreground/60"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Try a template
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-64 rounded-lg border border-border bg-surface shadow-lg z-10">
          <div className="p-1">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  onSelect(template.id);
                  setIsOpen(false);
                }}
                disabled={disabled}
                className="flex w-full flex-col items-start rounded-md px-3 py-2 text-left transition-colors hover:bg-surface-elevated disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="text-sm font-medium text-foreground">
                  {template.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {template.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
