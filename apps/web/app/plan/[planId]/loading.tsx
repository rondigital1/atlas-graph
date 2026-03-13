export default function PlanDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 border-b border-border-muted bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-11 max-w-[1400px] items-center px-4">
          <div className="h-6 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main content skeleton */}
          <div className="space-y-6">
            {/* Overview skeleton */}
            <div className="space-y-4">
              <div className="h-10 w-3/4 animate-pulse rounded-md bg-muted" />
              <div className="h-5 w-1/2 animate-pulse rounded-md bg-muted" />
              <div className="flex gap-3">
                <div className="h-8 w-28 animate-pulse rounded-full bg-muted" />
                <div className="h-8 w-24 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="h-24 animate-pulse rounded-xl bg-muted" />
            </div>

            {/* Timeline skeleton */}
            <div className="space-y-2">
              <div className="mb-4 h-6 w-48 animate-pulse rounded bg-muted" />
              {[1, 2, 3, 4].map((n) => (
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
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <div className="h-40 animate-pulse rounded-xl bg-muted" />
            <div className="h-32 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </main>
    </div>
  );
}
