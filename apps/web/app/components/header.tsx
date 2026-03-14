"use client";

import { Map, Menu, MessageCircle, Search, Settings, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "./logo";
import { NavLink } from "./nav-link";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-muted bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink
              href="/"
              label="Planner"
              icon={<Sparkles size={16} />}
            />
            <NavLink
              href="/explore"
              label="Explore"
              icon={<Map size={16} />}
            />
            <NavLink
              href="/chat"
              label="Chat"
              icon={<MessageCircle size={16} />}
            />
            <NavLink
              href="/plans"
              label="My Trips"
            />
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            href="/explore"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
            aria-label="Search itineraries"
          >
            <Search size={20} />
          </Link>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
          <div className="mx-2 h-5 w-px bg-border-muted" />
          <button className="flex h-9 items-center gap-2 rounded-lg px-1.5 transition-colors hover:bg-surface-elevated">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary/40 text-xs font-medium text-foreground">
              J
            </div>
          </button>

          {/* Mobile menu button */}
          <button
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-elevated md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border-muted px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            <NavLink href="/" label="Planner" icon={<Sparkles size={16} />} />
            <NavLink href="/explore" label="Explore" icon={<Map size={16} />} />
            <NavLink href="/chat" label="Chat" icon={<MessageCircle size={16} />} />
            <NavLink href="/plans" label="My Trips" />
          </nav>
        </div>
      )}
    </header>
  );
}
