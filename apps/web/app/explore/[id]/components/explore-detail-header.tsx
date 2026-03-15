import { ArrowLeft, Clock, DollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { ExploreItineraryDetail } from "../../../lib/types";

interface Props {
  itinerary: ExploreItineraryDetail;
}

export function ExploreDetailHeader({ itinerary }: Props) {
  return (
    <div className="relative">
      {/* Hero image */}
      <div className="relative h-[320px] overflow-hidden sm:h-[400px] lg:h-[480px]">
        <Image
          src={itinerary.imageUrl}
          alt={itinerary.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-8 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <Link
            href="/explore"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Explore
          </Link>

          <p className="text-sm font-medium uppercase tracking-wider text-white/60">
            {itinerary.destination}
          </p>
          <h1 className="mt-1 max-w-2xl text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            {itinerary.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm text-white/80">
              <Clock size={15} />
              {itinerary.duration}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-white/80">
              <DollarSign size={15} />
              {itinerary.budget}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {itinerary.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
