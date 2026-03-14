import Image from "next/image";
import {
  Landmark,
  UtensilsCrossed,
  Palette,
  TreePine,
  Bus,
  Coffee,
  Clock,
  ExternalLink,
} from "lucide-react";
import type { ItineraryActivity } from "../../../lib/types";

const ACTIVITY_ICONS: Record<string, typeof Landmark> = {
  landmark: Landmark,
  food: UtensilsCrossed,
  culture: Palette,
  nature: TreePine,
  transit: Bus,
  leisure: Coffee,
};

const ACTIVITY_GRADIENTS: Record<string, string> = {
  landmark: "from-amber-900/40 to-amber-800/20",
  food: "from-orange-900/40 to-orange-800/20",
  culture: "from-purple-900/40 to-purple-800/20",
  nature: "from-emerald-900/40 to-emerald-800/20",
  transit: "from-slate-800/40 to-slate-700/20",
  leisure: "from-sky-900/40 to-sky-800/20",
};

interface ActivityCardProps {
  activity: ItineraryActivity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const Icon = ACTIVITY_ICONS[activity.activityType ?? "leisure"] ?? Coffee;
  const gradient =
    ACTIVITY_GRADIENTS[activity.activityType ?? "leisure"] ??
    ACTIVITY_GRADIENTS["leisure"];

  return (
    <article className="flex gap-3 rounded-lg border border-border-muted bg-surface p-3 transition-colors hover:border-border">
      {/* Thumbnail */}
      {activity.imageUrl ? (
        <div className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-md md:h-20 md:w-20">
          <Image
            src={activity.imageUrl}
            alt={activity.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      ) : (
        <div
          className={`flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br md:h-20 md:w-20 ${gradient}`}
        >
          <Icon className="h-5 w-5 text-muted-foreground md:h-6 md:w-6" />
        </div>
      )}

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold text-foreground">
          {activity.name}
        </h4>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {activity.description}
        </p>

        {/* Tags */}
        {activity.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {activity.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta row: duration, cost, link */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {activity.duration && (
            <span className="flex items-center gap-1 text-[11px] text-subtle">
              <Clock className="h-3 w-3" />
              {activity.duration}
            </span>
          )}
          {activity.costRange && (
            <span className="text-[11px] font-medium text-primary">
              {activity.costRange}
            </span>
          )}
          {activity.linkUrl && (
            <a
              href={activity.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-medium text-primary transition-colors hover:text-primary/80"
            >
              {activity.linkLabel ?? "Learn more"}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
