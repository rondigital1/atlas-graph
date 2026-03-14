import { Clock, DollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { ExploreItinerary } from "../../lib/types";

interface Props {
  itinerary: ExploreItinerary;
}

export function ExploreCard({ itinerary }: Props) {
  return (
    <Link
      href={`/explore/${itinerary.id}`}
      className="group overflow-hidden rounded-xl border border-border-muted bg-surface transition-all hover:border-border hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={itinerary.imageUrl}
          alt={itinerary.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/70">
            {itinerary.destination}
          </p>
          <h3 className="mt-0.5 text-base font-semibold leading-snug text-white">
            {itinerary.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {itinerary.description}
        </p>

        <div className="mt-3 flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={13} />
            {itinerary.duration}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <DollarSign size={13} />
            {itinerary.budget}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {itinerary.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-surface-elevated px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
