import { getCountryFlag } from "../../app/lib/country-flags";
import type {
  PlansListItemViewModel,
  PlansListViewModel,
  RecentRunsPanelViewModel,
  RegenerationTriggerViewModel,
  RunInspectorErrorViewModel,
  RunInspectorHeaderViewModel,
  RunInspectorInputViewModel,
  RunInspectorOutputViewModel,
  RunInspectorToolResultViewModel,
  RunInspectorViewModel,
  StatusTone,
  VersionListViewModel,
} from "../../app/lib/types";
import type {
  PlanningRunDetail,
  PlanningRunSummary,
} from "./planning-run-query-service";
import {
  formatDateTime,
  formatDuration,
  formatEnumLabel,
  formatTripDates,
  getRunStatusPresentation,
} from "./view-model-utils";

function formatToolTitle(value: string): string {
  return value
    .split(/[-_]/g)
    .filter((part) => {
      return part.length > 0;
    })
    .map((part) => {
      return part[0]!.toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function getToolStatusPresentation(status: string): {
  label: string;
  tone: StatusTone;
} {
  switch (status) {
    case "SUCCEEDED":
      return {
        label: "Succeeded",
        tone: "success",
      };
    case "FAILED":
      return {
        label: "Failed",
        tone: "danger",
      };
    default:
      return {
        label: "Partial",
        tone: "warning",
      };
  }
}

function buildRecentRunMeta(run: PlanningRunSummary): string {
  const metaParts = [run.modelName ?? "Model unavailable", formatDateTime(run.createdAt)];

  return metaParts
    .filter((value): value is string => {
      return Boolean(value);
    })
    .join(" · ");
}

export function createRecentRunsPanelViewModel(
  runs: PlanningRunSummary[]
): RecentRunsPanelViewModel {
  if (runs.length === 0) {
    return {
      state: "empty",
      items: [],
    };
  }

  return {
    state: "ready",
    items: runs.map((run) => {
      const status = getRunStatusPresentation(run.status);

      return {
        id: run.id,
        href: `/runs/${run.id}`,
        title: run.destination ?? "Untitled run",
        subtitle: formatTripDates(run.startDate, run.endDate),
        meta: buildRecentRunMeta(run),
        statusLabel: status.label,
        statusTone: status.tone,
      };
    }),
  };
}

export function createUnavailableRecentRunsPanelViewModel(): RecentRunsPanelViewModel {
  return {
    state: "unavailable",
    items: [],
  };
}

export function createPlansListViewModel(
  runs: PlanningRunSummary[]
): PlansListViewModel {
  if (runs.length === 0) {
    return { state: "empty", items: [] };
  }

  const items: PlansListItemViewModel[] = runs.map((run) => {
    const status = getRunStatusPresentation(run.status);

    return {
      id: run.id,
      href: `/plan/${run.id}`,
      name: run.name ?? null,
      destination: run.destination ?? "Untitled",
      countryFlag: getCountryFlag(run.destination),
      tripDates: formatTripDates(run.startDate, run.endDate),
      statusLabel: status.label,
      statusTone: status.tone,
      budget: formatEnumLabel(run.budget),
      travelStyle: formatEnumLabel(run.travelStyle),
      groupType: formatEnumLabel(run.groupType),
      createdAt: formatDateTime(run.createdAt) ?? "",
    };
  });

  return { state: "ready", items };
}

export function extractInputPayloads(payload: unknown): RunInspectorInputViewModel {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {
      submittedPayload: payload ?? null,
      normalizedPayload: null,
      isLegacyPayload: true,
      recordedAt: null,
    };
  }

  const record = payload as Record<string, unknown>;
  const hasEnvelope =
    Object.hasOwn(record, "inputSnapshot") || Object.hasOwn(record, "normalizedInput");

  if (!hasEnvelope) {
    return {
      submittedPayload: payload,
      normalizedPayload: null,
      isLegacyPayload: true,
      recordedAt: null,
    };
  }

  return {
    submittedPayload: record["inputSnapshot"] ?? null,
    normalizedPayload: record["normalizedInput"] ?? null,
    isLegacyPayload: false,
    recordedAt: null,
  };
}

function createHeaderViewModel(detail: PlanningRunDetail): RunInspectorHeaderViewModel {
  const status = getRunStatusPresentation(detail.run.status);

  return {
    id: detail.run.id,
    requestId: detail.run.requestId ?? detail.run.id,
    destination: detail.run.destination ?? "Untitled run",
    tripDates: formatTripDates(detail.run.startDate, detail.run.endDate),
    budget: formatEnumLabel(detail.run.budget),
    travelStyle: formatEnumLabel(detail.run.travelStyle),
    groupType: formatEnumLabel(detail.run.groupType),
    modelName: detail.run.modelName,
    promptVersion: detail.run.promptVersion,
    startedAt: formatDateTime(detail.run.startedAt),
    completedAt: formatDateTime(detail.run.completedAt),
    createdAt: formatDateTime(detail.run.createdAt) ?? "",
    duration:
      detail.run.startedAt && detail.run.completedAt
        ? formatDuration(
            detail.run.completedAt.getTime() - detail.run.startedAt.getTime()
          )
        : null,
    statusLabel: status.label,
    statusTone: status.tone,
    defaultTab: detail.run.status === "FAILED" ? "errors" : "output",
  };
}

function createToolResultsViewModel(
  detail: PlanningRunDetail
): RunInspectorToolResultViewModel[] {
  return detail.toolResults.map((toolResult) => {
    const status = getToolStatusPresentation(toolResult.status);

    return {
      id: toolResult.id,
      title: formatToolTitle(toolResult.toolName),
      sequenceLabel: `Step ${toolResult.sequence}`,
      provider: toolResult.provider,
      toolCategory: toolResult.toolCategory,
      statusLabel: status.label,
      statusTone: status.tone,
      latency:
        typeof toolResult.latencyMs === "number"
          ? `${toolResult.latencyMs}ms`
          : null,
      createdAt: formatDateTime(toolResult.createdAt) ?? "",
      payload: toolResult.payload,
    };
  });
}

function createOutputViewModel(
  detail: PlanningRunDetail
): RunInspectorOutputViewModel | null {
  if (!detail.output) {
    return null;
  }

  return {
    outputFormat: detail.output.outputFormat,
    createdAt: formatDateTime(detail.output.createdAt) ?? "",
    payload: detail.output.payload,
  };
}

function createErrorViewModel(detail: PlanningRunDetail): RunInspectorErrorViewModel[] {
  return detail.errors.map((error) => {
    return {
      id: error.id,
      errorType: error.errorType,
      stepName: error.stepName,
      message: error.message,
      details: error.details ?? null,
      createdAt: formatDateTime(error.createdAt) ?? "",
    };
  });
}

export function createRunInspectorViewModel(
  detail: PlanningRunDetail
): RunInspectorViewModel {
  const inputPayloads = extractInputPayloads(detail.input?.payload ?? null);

  return {
    header: createHeaderViewModel(detail),
    input: {
      ...inputPayloads,
      recordedAt: detail.input ? formatDateTime(detail.input.createdAt) : null,
    },
    toolResults: createToolResultsViewModel(detail),
    output: createOutputViewModel(detail),
    errors: createErrorViewModel(detail),
  };
}

export function createVersionListViewModel(
  detail: PlanningRunDetail
): VersionListViewModel {
  const status = getRunStatusPresentation(detail.run.status);

  return {
    state: "single",
    activeVersionId: detail.run.id,
    items: [
      {
        id: detail.run.id,
        versionNumber: 1,
        label: "Version 1",
        generatedAt:
          formatDateTime(detail.run.completedAt) ??
          formatDateTime(detail.run.createdAt) ??
          "",
        isCurrent: true,
        statusLabel: status.label,
        statusTone: status.tone,
      },
    ],
  };
}

export function createRegenerationTriggerViewModel(
  planId: string
): RegenerationTriggerViewModel {
  return {
    availability: "unavailable",
    unavailableReason: "Regeneration not yet available",
    planId,
  };
}
