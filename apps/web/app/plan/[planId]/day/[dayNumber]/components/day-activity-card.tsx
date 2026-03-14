import {
  Landmark,
  UtensilsCrossed,
  Palette,
  TreePine,
  Coffee,
  MapPin,
  Search,
} from "lucide-react";

import type { PlanActivityViewModel } from "../../../../../lib/types";

type ActivityCategory = "landmark" | "food" | "culture" | "nature" | "leisure";

const CATEGORY_CONFIG: Record<
  ActivityCategory,
  { icon: typeof Landmark; gradient: string }
> = {
  landmark: {
    icon: Landmark,
    gradient: "from-amber-900/40 to-amber-800/20",
  },
  food: {
    icon: UtensilsCrossed,
    gradient: "from-orange-900/40 to-orange-800/20",
  },
  culture: {
    icon: Palette,
    gradient: "from-purple-900/40 to-purple-800/20",
  },
  nature: {
    icon: TreePine,
    gradient: "from-emerald-900/40 to-emerald-800/20",
  },
  leisure: {
    icon: Coffee,
    gradient: "from-sky-900/40 to-sky-800/20",
  },
};

const CATEGORY_KEYWORDS: Record<ActivityCategory, string[]> = {
  food: [
    "restaurant", "café", "cafe", "food", "dining", "eat", "brunch",
    "lunch", "dinner", "breakfast", "market", "bakery", "bar", "pub",
    "tapas", "sushi", "ramen", "street food", "cook",
  ],
  nature: [
    "park", "garden", "beach", "hike", "trail", "mountain", "lake",
    "river", "forest", "waterfall", "nature", "botanical", "island",
    "snorkel", "dive", "surf", "kayak", "wildlife",
  ],
  culture: [
    "museum", "gallery", "temple", "shrine", "church", "cathedral",
    "theater", "theatre", "opera", "concert", "festival", "art",
    "historic", "heritage", "craft", "workshop", "dance",
  ],
  landmark: [
    "tower", "palace", "castle", "monument", "square", "bridge",
    "gate", "wall", "ruins", "statue", "viewpoint", "observatory",
    "landmark", "basilica", "fort", "citadel",
  ],
  leisure: [
    "spa", "shopping", "walk", "stroll", "relax", "pool", "lounge",
    "sunset", "cruise", "boat", "explore", "wander",
  ],
};

function detectCategory(title: string): ActivityCategory {
  const lower = title.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category as ActivityCategory;
    }
  }

  return "leisure";
}

interface Props {
  activity: PlanActivityViewModel;
  destination: string;
}

export function DayActivityCard({ activity, destination }: Props) {
  const category = detectCategory(activity.title);
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;

  const mapsUrl =
    activity.lat !== undefined && activity.lng !== undefined
      ? `https://www.google.com/maps/search/?api=1&query=${activity.lat},${activity.lng}`
      : null;

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${activity.title} ${destination}`)}`;

  return (
    <article className="flex gap-4 rounded-xl border border-border-muted bg-surface p-4 transition-colors hover:border-border">
      <div
        className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${config.gradient}`}
      >
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-base font-semibold text-foreground">
          {activity.title}
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {activity.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-surface-elevated px-3 py-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              <MapPin size={12} />
              View on map
            </a>
          )}
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-surface-elevated px-3 py-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            <Search size={12} />
            Learn more
          </a>
        </div>
      </div>
    </article>
  );
}
