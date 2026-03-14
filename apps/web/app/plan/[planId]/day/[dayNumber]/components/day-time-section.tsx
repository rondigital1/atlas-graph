import { Sunrise, Sun, Moon } from "lucide-react";

import type { PlanActivityViewModel } from "../../../../../lib/types";
import { DayActivityCard } from "./day-activity-card";

type TimeOfDay = "morning" | "afternoon" | "evening";

const TIME_CONFIG: Record<
  TimeOfDay,
  { label: string; icon: typeof Sunrise; iconColor: string }
> = {
  morning: { label: "Morning", icon: Sunrise, iconColor: "text-amber-400" },
  afternoon: { label: "Afternoon", icon: Sun, iconColor: "text-sky-400" },
  evening: { label: "Evening", icon: Moon, iconColor: "text-indigo-400" },
};

interface Props {
  timeOfDay: TimeOfDay;
  activities: PlanActivityViewModel[];
  destination: string;
}

export function DayTimeSection({ timeOfDay, activities, destination }: Props) {
  if (activities.length === 0) {
    return null;
  }

  const config = TIME_CONFIG[timeOfDay];
  const Icon = config.icon;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`h-5 w-5 ${config.iconColor}`} />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {config.label}
        </h3>
      </div>
      <div className="space-y-3">
        {activities.map((activity, i) => (
          <DayActivityCard
            key={i}
            activity={activity}
            destination={destination}
          />
        ))}
      </div>
    </section>
  );
}
