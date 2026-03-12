export type PlanStatus = "draft" | "generated" | "saved";

export interface RecentPlan {
  id: string;
  title: string;
  destinations: string[];
  nights: number;
  travelers: number;
  budget: string;
  status: PlanStatus;
  updatedAt: string;
}

export const recentPlans: RecentPlan[] = [
  {
    id: "rp-1",
    title: "Spain & South France",
    destinations: ["Barcelona", "Provence", "Nice"],
    nights: 10,
    travelers: 2,
    budget: "Moderate",
    status: "generated",
    updatedAt: "2h ago",
  },
  {
    id: "rp-2",
    title: "Japan: Tokyo & Kyoto",
    destinations: ["Tokyo", "Kyoto"],
    nights: 12,
    travelers: 2,
    budget: "Premium",
    status: "draft",
    updatedAt: "Yesterday",
  },
  {
    id: "rp-3",
    title: "Bali Remote Work",
    destinations: ["Bali"],
    nights: 21,
    travelers: 1,
    budget: "Budget",
    status: "saved",
    updatedAt: "3 days ago",
  },
];
