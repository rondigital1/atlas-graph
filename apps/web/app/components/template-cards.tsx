"use client";

interface Template {
  id: string;
  title: string;
  description: string;
}

const templates: Template[] = [
  { id: "european-food", title: "Food & Culture", description: "European cities, local cuisine" },
  { id: "tropical-remote", title: "Remote Work", description: "Beach destinations, reliable wifi" },
  { id: "luxury-couples", title: "Luxury Escape", description: "Premium stays, romantic" },
  { id: "adventure-nature", title: "Adventure", description: "Mountains, hiking, nature" },
  { id: "budget-explorer", title: "Budget Explorer", description: "Multi-city, hostels" },
  { id: "family-summer", title: "Family Trip", description: "Kid-friendly, beaches" },
];

interface TemplateCardsProps {
  onSelect: (templateId: string) => void;
}

export function TemplateCards({ onSelect }: TemplateCardsProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Quick start</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="group flex flex-col items-start rounded-lg border border-border bg-surface p-3 text-left transition-all hover:border-primary/30 hover:bg-surface-elevated"
          >
            <span className="text-xs font-medium text-foreground">{template.title}</span>
            <span className="mt-0.5 text-[11px] text-muted-foreground">{template.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
