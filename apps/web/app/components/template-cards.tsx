"use client";

import { TEMPLATES } from "../lib/mock/wizard-options";

interface TemplateCardsProps {
  onSelect: (templateId: string) => void;
}

export function TemplateCards({ onSelect }: TemplateCardsProps) {
  return (
    <div>
      <p className="mb-3 text-xs font-medium text-muted-foreground">
        Quick start
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className="flex flex-col items-start rounded-lg border border-border bg-surface p-3 text-left transition-all hover:border-primary/30 hover:bg-surface-elevated"
          >
            <span className="text-xs font-medium text-foreground">
              {template.title}
            </span>
            <span className="mt-0.5 text-[11px] text-muted-foreground">
              {template.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
