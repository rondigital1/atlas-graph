import { UtensilsCrossed, AlertCircle } from "lucide-react";
import type { DayItem } from "../../../lib/types";
import { DayHeroPlaceholder } from "./day-hero-placeholder";
import { TimeOfDaySection } from "./time-of-day-section";

interface DayCardProps {
  day: DayItem;
  forceExpandSections?: boolean | null;
}

export function DayCard({ day, forceExpandSections }: DayCardProps) {
  const hasActivities =
    (day.morningActivities?.length ?? 0) > 0 ||
    (day.afternoonActivities?.length ?? 0) > 0 ||
    (day.eveningActivities?.length ?? 0) > 0;

  return (
    <section
      id={`day-${day.id}`}
      className="overflow-hidden rounded-xl border border-border-muted bg-surface"
    >
      <DayHeroPlaceholder imageUrl={day.heroImageUrl} city={day.city} />

      <div className="px-5 py-4">
        {/* Header */}
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {day.day}
          </span>
          <h3 className="text-lg font-semibold text-foreground">
            Day {day.day} — {day.date}
          </h3>
          {day.isTransit && (
            <span className="rounded bg-warning-muted px-1.5 py-0.5 text-[10px] font-medium text-warning">
              Transit
            </span>
          )}
        </div>
        <p className="mb-3 text-sm text-muted-foreground">
          {day.city}
          {day.neighborhood ? ` · ${day.neighborhood}` : ""}
        </p>

        {/* Day summary */}
        {day.daySummary && (
          <p className="mb-4 text-sm italic text-subtle">{day.daySummary}</p>
        )}

        {/* Time-of-day sections */}
        {hasActivities && (
          <div className="mb-4 space-y-3">
            {(day.morningActivities?.length ?? 0) > 0 && (
              <TimeOfDaySection
                timeOfDay="morning"
                activities={day.morningActivities!}
                forceExpanded={forceExpandSections}
              />
            )}
            {(day.afternoonActivities?.length ?? 0) > 0 && (
              <TimeOfDaySection
                timeOfDay="afternoon"
                activities={day.afternoonActivities!}
                forceExpanded={forceExpandSections}
              />
            )}
            {(day.eveningActivities?.length ?? 0) > 0 && (
              <TimeOfDaySection
                timeOfDay="evening"
                activities={day.eveningActivities!}
                forceExpanded={forceExpandSections}
              />
            )}
          </div>
        )}

        {/* Dining & Notes */}
        <div className="flex flex-wrap items-center gap-3">
          {day.dining && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <UtensilsCrossed className="h-3.5 w-3.5" />
              <span>{day.dining}</span>
            </div>
          )}
          {day.notes && (
            <div className="flex items-center gap-1.5 rounded-md bg-warning-muted px-2 py-1 text-xs text-warning">
              <AlertCircle className="h-3.5 w-3.5" />
              {day.notes}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
