"use client";

function serializePayload(payload: unknown): string {
  const serialized = JSON.stringify(payload, null, 2);

  if (serialized === undefined) {
    return "null";
  }

  return serialized;
}

export function JsonPanel({
  title,
  subtitle,
  payload,
  showPayload,
  emptyMessage,
}: {
  emptyMessage: string;
  payload: unknown;
  showPayload: boolean;
  subtitle?: string | null;
  title: string;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border-muted px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      {showPayload ? (
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-6 text-foreground">
          {serializePayload(payload)}
        </pre>
      ) : (
        <div className="px-4 py-5 text-sm text-muted-foreground">{emptyMessage}</div>
      )}
    </section>
  );
}
