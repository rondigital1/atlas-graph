import Link from "next/link";

export function PlansEmptyState() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border-muted bg-surface px-6 py-16 text-center">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        No plans yet
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Create your first trip plan to see it here.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Start planning
      </Link>
    </div>
  );
}
