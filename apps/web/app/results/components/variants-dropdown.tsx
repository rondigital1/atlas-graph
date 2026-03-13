"use client";

import { useState, useRef, useEffect } from "react";

const variants = [
  { id: "best", label: "Best Match", badge: "95%" },
  { id: "budget", label: "Budget", badge: "-30%" },
  { id: "luxury", label: "Luxury", badge: "+45%" },
  { id: "relaxed", label: "Relaxed", badge: null },
  { id: "foodie", label: "Food Focus", badge: null },
];

export function VariantsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("best");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) { return; }
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) { return; }
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
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 3h5v5" />
          <path d="M8 3H3v5" />
          <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
          <path d="m15 9 6-6" />
        </svg>
        View alternatives
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 w-56 rounded-lg border border-border bg-surface shadow-lg">
          <div className="p-1">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setActive(v.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                  active === v.id
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-foreground hover:bg-surface-elevated"
                }`}
              >
                {v.label}
                {v.badge && (
                  <span className="text-xs text-muted-foreground">{v.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
