import { Compass } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
        <Compass size={18} className="text-primary-foreground" />
      </div>
      <span className="text-base font-bold tracking-tight">
        <span className="text-foreground">Atlas</span>
        <span className="text-primary">Graph</span>
      </span>
    </Link>
  );
}
