import type { ExploreDay } from "../../../lib/types";

interface Props {
  day: ExploreDay;
}

export function ExploreDaySection({ day }: Props) {
  return (
    <div className="rounded-xl border border-border-muted bg-surface p-5 sm:p-6">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {day.day}
        </span>
        <h3 className="text-lg font-semibold text-foreground">{day.title}</h3>
      </div>

      <div className="space-y-4">
        {day.slots.map((slot) => (
          <div key={slot.label}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {slot.label}
            </p>
            <div className="space-y-3">
              {slot.activities.map((activity) => (
                <div
                  key={activity.title}
                  className="relative border-l-2 border-border-muted pl-4"
                >
                  <span className="text-xs font-medium text-primary">
                    {activity.time}
                  </span>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
