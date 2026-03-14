import { Sparkles } from "lucide-react";

import { Header } from "../components/header";
import { exploreItineraries } from "../lib/mock/explore-itineraries";
import { ExploreGrid } from "./components/explore-grid";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">
              Explore Popular Itineraries
            </h1>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Browse AI-generated travel plans loved by our community. Find
            inspiration for your next adventure.
          </p>
        </div>
        <ExploreGrid itineraries={exploreItineraries} />
      </main>
    </div>
  );
}
