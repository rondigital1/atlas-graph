import Link from "next/link";

export function PlanErrorState() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Plan unavailable
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This plan could not be loaded. The output may be missing or invalid.
      </p>
      <Link
        href="/plans"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to My Trips
      </Link>
    </div>
  );
}
