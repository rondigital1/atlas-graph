import { Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

import { Header } from "../../components/header";
import { getExploreItineraryDetail } from "../../lib/mock/explore-itinerary-details";
import { ExploreDaySection } from "./components/explore-day-section";
import { ExploreDetailHeader } from "./components/explore-detail-header";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ExploreDetailPage({ params }: Props) {
  const { id } = await params;
  const itinerary = getExploreItineraryDetail(id);

  if (!itinerary) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ExploreDetailHeader itinerary={itinerary} />

      <main className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        {/* Description & highlights */}
        <div className="mb-10 max-w-2xl">
          <p className="text-base leading-relaxed text-muted-foreground">
            {itinerary.description}
          </p>

          {itinerary.highlights.length > 0 && (
            <div className="mt-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                <Sparkles size={14} className="text-primary" />
                Highlights
              </h2>
              <ul className="mt-3 space-y-2">
                {itinerary.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Day-by-day breakdown */}
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Day-by-Day Itinerary
        </h2>
        <div className="space-y-6">
          {itinerary.days.map((day) => (
            <ExploreDaySection key={day.day} day={day} />
          ))}
        </div>
      </main>
    </div>
  );
}
