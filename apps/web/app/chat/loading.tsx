import { Header } from "../components/header";

export default function ChatLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Trip selector skeleton */}
        <div className="shrink-0 border-b border-border-muted p-4 lg:w-[300px] lg:border-b-0 lg:border-r">
          <div className="mb-3 h-4 w-20 animate-pulse rounded bg-surface-elevated" />
          <div className="space-y-3">
            <div className="h-12 animate-pulse rounded-xl bg-surface-elevated" />
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-border-muted">
                <div className="aspect-[16/9] animate-pulse bg-surface-elevated" />
                <div className="flex gap-1.5 p-2">
                  <div className="h-4 w-14 animate-pulse rounded bg-surface-elevated" />
                  <div className="h-4 w-16 animate-pulse rounded bg-surface-elevated" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area skeleton */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="h-12 w-12 animate-pulse rounded-full bg-surface-elevated" />
          <div className="mt-4 h-5 w-32 animate-pulse rounded bg-surface-elevated" />
          <div className="mt-2 h-4 w-48 animate-pulse rounded bg-surface-elevated" />
        </div>
      </div>
    </div>
  );
}
