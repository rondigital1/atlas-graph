"use client";

import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Header } from "../components/header";
import {
  continents,
  exploreItineraries,
} from "../lib/mock/explore-itineraries";
import type { Continent } from "../lib/types";
import { ContinentFilter } from "./components/continent-filter";
import { ExploreGrid } from "./components/explore-grid";

export default function ExplorePage() {
  const [activeContinent, setActiveContinent] = useState<Continent>("all");

  const filtered = useMemo(
    () =>
      activeContinent === "all"
        ? exploreItineraries
        : exploreItineraries.filter((i) => i.continent === activeContinent),
    [activeContinent],
  );

  const activeBg = continents.find(
    (c) => c.id === activeContinent,
  )?.backgroundUrl;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Continent background image */}
      {activeBg && (
        <div className="absolute inset-0 h-[420px] overflow-hidden">
          <Image
            src={activeBg}
            alt=""
            fill
            className="object-cover transition-opacity duration-700"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
      )}

      <Header />

      <main className="relative mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
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

        <div className="mb-8">
          <ContinentFilter
            active={activeContinent}
            onChange={setActiveContinent}
          />
        </div>

        <ExploreGrid itineraries={filtered} />
      </main>
    </div>
  );
}
