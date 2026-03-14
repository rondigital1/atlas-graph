import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  planId: string;
  destination: string;
  dayNumber: number;
  date: string;
  theme: string;
}

export function DayDetailHeader({
  planId,
  destination,
  dayNumber,
  date,
  theme,
}: Props) {
  return (
    <header className="space-y-4">
      <Link
        href={`/plan/${planId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Back to itinerary
      </Link>

      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {dayNumber}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {theme}
            </h1>
            <p className="text-sm text-muted-foreground">
              Day {dayNumber} &middot; {date} &middot; {destination}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
