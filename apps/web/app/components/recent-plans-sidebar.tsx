"use client";

interface RecentPlan {
  id: string;
  title: string;
  destination: string;
  date: string;
  status: "draft" | "complete" | "generating";
}

const recentPlans: RecentPlan[] = [
  {
    id: "1",
    title: "Barcelona & Madrid",
    destination: "Spain",
    date: "2 days ago",
    status: "complete",
  },
  {
    id: "2",
    title: "Tokyo Food Tour",
    destination: "Japan",
    date: "1 week ago",
    status: "complete",
  },
  {
    id: "3",
    title: "Greek Islands Hop",
    destination: "Greece",
    date: "Draft",
    status: "draft",
  },
];

interface RecentPlansSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecentPlansSidebar({
  isOpen,
  onClose,
}: RecentPlansSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed right-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-80 border-l border-border bg-card shadow-xl lg:static lg:z-0 lg:shadow-none">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border-subtle p-4">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Plans
            </h2>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-2">
              {recentPlans.map((plan) => (
                <button
                  key={plan.id}
                  className="flex w-full items-start gap-3 rounded-lg border border-transparent p-3 text-left transition-colors hover:border-border hover:bg-muted"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {plan.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {plan.destination}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        plan.status === "complete"
                          ? "bg-accent-muted text-primary"
                          : plan.status === "draft"
                            ? "bg-muted text-muted-foreground"
                            : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {plan.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {plan.date}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border-subtle p-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-muted py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              New Plan
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
