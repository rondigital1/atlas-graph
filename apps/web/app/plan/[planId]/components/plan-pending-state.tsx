interface Props {
  statusLabel: string;
}

export function PlanPendingState({ statusLabel }: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-16">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Generating your trip plan...
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Status: {statusLabel}
        </p>
      </div>

      {/* Skeleton overview */}
      <div className="space-y-4 rounded-xl border border-border-muted bg-surface p-6">
        <div className="h-8 w-2/3 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
        <div className="flex gap-3">
          <div className="h-8 w-28 animate-pulse rounded-full bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded-full bg-muted" />
        </div>
      </div>

      {/* Skeleton timeline */}
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="rounded-lg border border-border-muted bg-surface p-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
