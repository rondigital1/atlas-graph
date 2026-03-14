"use client";

import { useState } from "react";
import type { Template } from "../lib/mock/wizard-options";
import { TEMPLATES } from "../lib/mock/wizard-options";

const TEMPLATE_ICONS: Record<string, string> = {
  "european-food": "\uD83C\uDF77",
  "tropical-remote": "\uD83D\uDCBB",
  "luxury-couples": "\uD83D\uDC91",
  "adventure-nature": "\uD83C\uDFD4\uFE0F",
  "budget-explorer": "\uD83C\uDF92",
  "family-summer": "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67",
};

interface TemplateSidebarProps {
  disabled?: boolean;
  activeTemplateId: string | null;
  onSelect: (templateId: string) => void;
  variant: "desktop" | "mobile";
}

export function TemplateSidebar({
  disabled = false,
  activeTemplateId,
  onSelect,
  variant,
}: TemplateSidebarProps) {
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);

  if (variant === "desktop") {
    return (
      <aside className="hidden lg:block">
        <div className="sticky top-8 w-48 shrink-0">
          <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quick Templates
          </h2>
          <nav className="space-y-1" aria-label="Trip templates">
            {TEMPLATES.map((template) => (
              <DesktopTemplateButton
                key={template.id}
                template={template}
                isActive={activeTemplateId === template.id}
                disabled={disabled}
                onSelect={onSelect}
              />
            ))}
          </nav>
        </div>
      </aside>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsExpandedMobile(!isExpandedMobile)}
        disabled={disabled}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="flex items-center gap-2">
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
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </svg>
          Start with a template
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${isExpandedMobile ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {isExpandedMobile && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
          {TEMPLATES.map((template) => {
            const isActive = activeTemplateId === template.id;
            const icon = TEMPLATE_ICONS[template.id] ?? "\u2728";
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  onSelect(template.id);
                  setIsExpandedMobile(false);
                }}
                disabled={disabled}
                className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                  isActive
                    ? "border-primary/40 bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <span aria-hidden="true">{icon}</span>
                <span className="font-medium">{template.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DesktopTemplateButton({
  template,
  isActive,
  disabled,
  onSelect,
}: {
  template: Template;
  isActive: boolean;
  disabled: boolean;
  onSelect: (id: string) => void;
}) {
  const icon = TEMPLATE_ICONS[template.id] ?? "\u2728";

  return (
    <button
      type="button"
      onClick={() => onSelect(template.id)}
      disabled={disabled}
      className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-all ${
        isActive
          ? "border border-primary/40 bg-primary/10 text-foreground"
          : "border border-transparent text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <span className="mt-0.5 text-lg leading-none" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <span className="block text-sm font-semibold">{template.title}</span>
        <span className="block text-xs text-muted-foreground">
          {template.description}
        </span>
      </div>
    </button>
  );
}
