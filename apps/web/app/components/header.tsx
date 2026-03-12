"use client";

import { useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-foreground">
              AtlasGraph
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <a
              href="#"
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Workspace
            </a>
            <a
              href="#"
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Saved Plans
            </a>
            <a
              href="#"
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Recent Trips
            </a>
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="hidden rounded-md border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted md:inline-flex">
            Feedback
          </button>
          <button className="hidden rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 md:inline-flex">
            Upgrade
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            JD
          </button>

          {/* Mobile menu button */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMobileMenuOpen ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 12h16" />
                  <path d="M4 6h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border-subtle px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            <a
              href="#"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Workspace
            </a>
            <a
              href="#"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Saved Plans
            </a>
            <a
              href="#"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Recent Trips
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
