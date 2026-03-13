import type { RunInspectorHeaderViewModel, StatusTone } from "../../../lib/types";

const STATUS_STYLES: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  danger: "bg-destructive/15 text-destructive",
};

function MetaField({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="rounded-lg border border-border-muted bg-surface-elevated/60 px-3 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-subtle">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value ?? "Unavailable"}</p>
    </div>
  );
}

export function RunInspectorHeader({
  header,
}: {
  header: RunInspectorHeaderViewModel;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface">
      <div className="border-b border-border-muted px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[header.statusTone]}`}
              >
                {header.statusLabel}
              </span>
              <span className="rounded-full border border-border-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                {header.tripDates}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              {header.destination}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Request ID: <span className="font-mono text-[13px]">{header.requestId}</span>
            </p>
          </div>

          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="rounded-lg border border-border-muted bg-surface-elevated/60 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-subtle">
                Started
              </p>
              <p className="mt-1 text-foreground">{header.startedAt ?? "Unavailable"}</p>
            </div>
            <div className="rounded-lg border border-border-muted bg-surface-elevated/60 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-subtle">
                Duration
              </p>
              <p className="mt-1 text-foreground">{header.duration ?? "Unavailable"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 px-5 py-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <MetaField label="Budget" value={header.budget} />
        <MetaField label="Travel Style" value={header.travelStyle} />
        <MetaField label="Group" value={header.groupType} />
        <MetaField label="Model" value={header.modelName} />
        <MetaField label="Prompt Version" value={header.promptVersion} />
        <MetaField label="Completed" value={header.completedAt} />
        <MetaField label="Created" value={header.createdAt} />
        <MetaField label="Run ID" value={header.id} />
      </div>
    </section>
  );
}
