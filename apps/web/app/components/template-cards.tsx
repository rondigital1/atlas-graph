"use client";

interface Template {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
}

const templates: Template[] = [
  {
    id: "european-food",
    title: "European Food & Culture",
    description: "Culinary experiences across iconic European cities",
    tags: ["City", "Foodie", "Culture"],
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
        <path d="M8.5 8.5v.01" />
        <path d="M16 15.5v.01" />
        <path d="M12 12v.01" />
        <path d="M11 17v.01" />
        <path d="M7 14v.01" />
      </svg>
    ),
  },
  {
    id: "tropical-remote",
    title: "Tropical Remote Work",
    description: "Work from paradise with reliable wifi and great vibes",
    tags: ["Tropical", "Remote Work", "Relaxed"],
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        <path d="M21 3v18H3V3h18z" />
        <path d="M12 8a2.5 2.5 0 0 0-5 0c0 1.5 2.5 3 2.5 3s2.5-1.5 2.5-3z" />
        <path d="M21 8H8" />
        <path d="M21 16H3" />
      </svg>
    ),
  },
  {
    id: "luxury-couples",
    title: "Luxury Couples Getaway",
    description: "Romantic escapes with premium accommodations",
    tags: ["Romantic", "Luxury", "Couple"],
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    id: "adventure-nature",
    title: "Adventure & Nature",
    description: "Outdoor thrills and breathtaking landscapes",
    tags: ["Adventure", "Mountains", "Nature"],
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
    ),
  },
  {
    id: "budget-explorer",
    title: "Budget Multi-City",
    description: "See more for less across multiple destinations",
    tags: ["Budget", "Multi-City", "Fast-Paced"],
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    id: "family-summer",
    title: "Family Summer Vacation",
    description: "Kid-friendly adventures for the whole family",
    tags: ["Family", "Beach", "Kid-Friendly"],
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="4" r="2" />
        <path d="M12 21v-8" />
        <path d="M12 13H6a2 2 0 0 1-2-2V5.7a2 2 0 0 1 1.3-1.9L6 3.5" />
        <path d="M12 13h6a2 2 0 0 0 2-2V5.7a2 2 0 0 0-1.3-1.9L18 3.5" />
      </svg>
    ),
  },
];

interface TemplateCardsProps {
  onSelect: (templateId: string) => void;
}

export function TemplateCards({ onSelect }: TemplateCardsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          Quick Start Templates
        </h3>
        <span className="text-xs text-muted-foreground">
          Click to pre-fill preferences
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="group flex flex-col items-start rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:bg-muted"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-muted text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              {template.icon}
            </div>
            <h4 className="mb-1 text-sm font-semibold text-foreground">
              {template.title}
            </h4>
            <p className="mb-3 text-xs text-muted-foreground">
              {template.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
