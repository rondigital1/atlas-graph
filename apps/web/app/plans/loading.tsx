import { Header } from "../components/header";

export default function PlansLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
        <div className="mb-6">
          <div className="h-8 w-32 animate-pulse rounded bg-surface-elevated" />
        </div>
        <div className="rounded-xl border border-border bg-surface">
          <ul className="divide-y divide-border-muted">
            {Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-48 animate-pulse rounded bg-surface-elevated" />
                    <div className="h-3 w-36 animate-pulse rounded bg-surface-elevated" />
                    <div className="flex gap-1.5">
                      <div className="h-4 w-16 animate-pulse rounded bg-surface-elevated" />
                      <div className="h-4 w-20 animate-pulse rounded bg-surface-elevated" />
                    </div>
                    <div className="h-2.5 w-28 animate-pulse rounded bg-surface-elevated" />
                  </div>
                  <div className="h-4 w-16 animate-pulse rounded bg-surface-elevated" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
