import { siteMetadata, travelPlannerPlaceholders } from "../src/lib/site";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-[0_24px_80px_rgba(23,32,51,0.08)] backdrop-blur sm:p-12">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--accent)] to-transparent" />
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[color:var(--accent)]">
            T-001 Workspace Shell
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-5xl leading-none sm:text-6xl">
            {siteMetadata.name}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-700">
            {siteMetadata.description}
          </p>
        </div>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-3">
        {travelPlannerPlaceholders.map((section) => {
          return (
            <article
              key={section.title}
              className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 shadow-[0_18px_50px_rgba(23,32,51,0.06)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-secondary)]">
                {section.label}
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                {section.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-12 rounded-[2rem] border border-dashed border-[color:var(--border)] px-6 py-8 text-sm leading-7 text-slate-700">
        AtlasGraph is intentionally scaffold-only in this ticket. Domain logic,
        planner behavior, prompts, provider integrations, and production data
        models will land in later tickets inside shared packages rather than the
        UI layer.
      </section>
    </main>
  );
}
