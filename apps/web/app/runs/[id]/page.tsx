import { notFound } from "next/navigation";

import { Header } from "../../components/header";
import { createPlanningRunQueryService } from "../../../src/server/create-planning-run-query-service";
import { createRunInspectorViewModel } from "../../../src/server/planning-run-view-models";
import { RunInspector } from "./components/run-inspector";

interface RunInspectorPageContext {
  params: Promise<{
    id: string;
  }>;
}

export default async function RunInspectorPage(
  context: RunInspectorPageContext
) {
  const { id } = await context.params;
  const planningRunQueryService = createPlanningRunQueryService();
  let model: ReturnType<typeof createRunInspectorViewModel> | null = null;
  let loadError = false;

  try {
    const detail = await planningRunQueryService.getRunDetailById(id);

    if (!detail) {
      notFound();
    }

    model = createRunInspectorViewModel(detail);
  } catch {
    loadError = true;
  }

  if (loadError || !model) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">
          <section className="rounded-2xl border border-border bg-surface px-6 py-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Run unavailable
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The inspector could not load this run right now.
            </p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <RunInspector model={model} />
      </main>
    </div>
  );
}
