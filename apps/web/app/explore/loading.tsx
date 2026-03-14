import { Header } from "../components/header";

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border-muted bg-surface">
      <div className="aspect-[16/10] animate-pulse bg-surface-elevated" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface-elevated" />
        <div className="h-3 w-full animate-pulse rounded bg-surface-elevated" />
        <div className="flex gap-2">
          <div className="h-3 w-16 animate-pulse rounded bg-surface-elevated" />
          <div className="h-3 w-16 animate-pulse rounded bg-surface-elevated" />
        </div>
      </div>
    </div>
  );
}

export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="mb-8">
          <div className="h-7 w-72 animate-pulse rounded bg-surface-elevated" />
          <div className="mt-2 h-4 w-96 animate-pulse rounded bg-surface-elevated" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
