import type { ExploreItinerary } from "../../lib/types";
import { ExploreCard } from "./explore-card";

interface Props {
  itineraries: ExploreItinerary[];
}

export function ExploreGrid({ itineraries }: Props) {
  if (itineraries.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">No itineraries found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {itineraries.map((itinerary) => (
        <ExploreCard key={itinerary.id} itinerary={itinerary} />
      ))}
    </div>
  );
}
