import { Header } from "../components/header";
import { createPlanningRunQueryService } from "../../src/server/create-planning-run-query-service";
import { createPlansListViewModel } from "../../src/server/planning-run-view-models";
import { PlansList } from "./components/plans-list";
import { PlansEmptyState } from "./components/plans-empty-state";

export default async function PlansPage() {
  const planningRunQueryService = createPlanningRunQueryService();
  let loadError = false;
  let model = createPlansListViewModel([]);

  try {
    const runs = await planningRunQueryService.listRecentRuns();
    model = createPlansListViewModel(runs);
  } catch {
    loadError = true;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            My Trips
          </h1>
        </div>

        {loadError ? (
          <section className="rounded-2xl border border-border bg-surface px-6 py-8">
            <h2 className="text-lg font-semibold text-foreground">
              Plans unavailable
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We couldn&apos;t load your plans right now. Please try again
              later.
            </p>
          </section>
        ) : model.state === "empty" ? (
          <PlansEmptyState />
        ) : (
          <PlansList items={model.items} />
        )}
      </main>
    </div>
  );
}
