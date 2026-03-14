"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

export function NavLink({ href, label, icon }: Props) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
