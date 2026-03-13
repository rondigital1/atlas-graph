"use client";

import { useState } from "react";

import type {
  RunInspectorTabId,
  RunInspectorViewModel,
  StatusTone,
} from "../../../lib/types";
import { JsonPanel } from "./json-panel";
import { RunInspectorHeader } from "./run-inspector-header";

const TABS: Array<{ id: RunInspectorTabId; label: string }> = [
  { id: "input", label: "Input" },
  { id: "toolData", label: "Tool Data" },
  { id: "output", label: "Output" },
  { id: "errors", label: "Errors" },
];

const STATUS_STYLES: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  danger: "bg-destructive/15 text-destructive",
};

export function RunInspector({
  model,
}: {
  model: RunInspectorViewModel;
}) {
  const [activeTab, setActiveTab] = useState<RunInspectorTabId>(
    model.header.defaultTab
  );

  return (
    <div className="space-y-6">
      <RunInspectorHeader header={model.header} />

      <div className="rounded-2xl border border-border bg-surface">
        <div className="border-b border-border-muted px-3 py-2 sm:px-4">
          <div className="flex flex-wrap gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-4 sm:px-5 sm:py-5">
          {activeTab === "input" ? (
            <div className="space-y-4">
              {model.input.isLegacyPayload ? (
                <div className="rounded-xl border border-warning/30 bg-warning-muted px-4 py-3 text-sm text-warning">
                  This run used a legacy input payload. Normalized input was not persisted.
                </div>
              ) : null}

              <div className="grid gap-4 xl:grid-cols-2">
                <JsonPanel
                  title="Submitted Input"
                  subtitle={model.input.recordedAt ? `Captured ${model.input.recordedAt}` : null}
                  payload={model.input.submittedPayload}
                  showPayload={model.input.submittedPayload !== null}
                  emptyMessage="Submitted input was not stored for this run."
                />
                <JsonPanel
                  title="Normalized Input"
                  payload={model.input.normalizedPayload}
                  showPayload={model.input.normalizedPayload !== null}
                  emptyMessage="Normalized input is unavailable for this run."
                />
              </div>
            </div>
          ) : null}

          {activeTab === "toolData" ? (
            model.toolResults.length > 0 ? (
              <div className="space-y-4">
                {model.toolResults.map((toolResult) => (
                  <section
                    key={toolResult.id}
                    className="rounded-xl border border-border bg-surface-elevated/40"
                  >
                    <div className="flex flex-col gap-3 border-b border-border-muted px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-sm font-semibold text-foreground">
                            {toolResult.title}
                          </h2>
                          <span
                            className={`rounded-full px-2 py-1 text-[11px] font-medium ${STATUS_STYLES[toolResult.statusTone]}`}
                          >
                            {toolResult.statusLabel}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {toolResult.sequenceLabel}
                          {toolResult.toolCategory ? ` · ${toolResult.toolCategory}` : ""}
                          {toolResult.provider ? ` · ${toolResult.provider}` : ""}
                          {toolResult.latency ? ` · ${toolResult.latency}` : ""}
                        </p>
                      </div>
                      <p className="text-xs text-subtle">{toolResult.createdAt}</p>
                    </div>

                    <pre className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-6 text-foreground">
                      {JSON.stringify(toolResult.payload, null, 2) ?? "null"}
                    </pre>
                  </section>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border-muted bg-surface-elevated/40 px-4 py-5 text-sm text-muted-foreground">
                No normalized tool data was stored for this run.
              </div>
            )
          ) : null}

          {activeTab === "output" ? (
            <JsonPanel
              title="Final Output"
              subtitle={model.output ? `Recorded ${model.output.createdAt}` : null}
              payload={model.output?.payload ?? null}
              showPayload={model.output !== null}
              emptyMessage="No final output was stored for this run."
            />
          ) : null}

          {activeTab === "errors" ? (
            model.errors.length > 0 ? (
              <div className="space-y-4">
                {model.errors.map((error) => (
                  <section
                    key={error.id}
                    className="rounded-xl border border-destructive/20 bg-destructive/5"
                  >
                    <div className="border-b border-destructive/15 px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-destructive/15 px-2 py-1 text-[11px] font-medium text-destructive">
                          {error.errorType ?? "Unhandled Error"}
                        </span>
                        {error.stepName ? (
                          <span className="rounded-full border border-border-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                            {error.stepName}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 text-sm font-medium text-foreground">
                        {error.message}
                      </p>
                      <p className="mt-1 text-xs text-subtle">{error.createdAt}</p>
                    </div>

                    <div className="px-4 py-4">
                      {error.details !== null ? (
                        <pre className="overflow-x-auto font-mono text-[12px] leading-6 text-foreground">
                          {JSON.stringify(error.details, null, 2) ?? "null"}
                        </pre>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No structured error details were stored.
                        </p>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border-muted bg-surface-elevated/40 px-4 py-5 text-sm text-muted-foreground">
                No errors were recorded for this run.
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
