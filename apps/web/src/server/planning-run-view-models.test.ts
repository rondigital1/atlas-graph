import { describe, expect, it } from "vitest";

import {
  createRecentRunsPanelViewModel,
  createRunInspectorViewModel,
  createUnavailableRecentRunsPanelViewModel,
  extractInputPayloads,
} from "./planning-run-view-models";

describe("planning-run-view-models", () => {
  it("maps recent runs into panel items", () => {
    const result = createRecentRunsPanelViewModel([
      {
        id: "run-1",
        status: "SUCCEEDED",
        requestId: "request-1",
        destination: "Tokyo",
        startDate: new Date("2026-04-10T00:00:00.000Z"),
        endDate: new Date("2026-04-15T00:00:00.000Z"),
        budget: "medium",
        travelStyle: "balanced",
        groupType: "friends",
        modelName: "gpt-4.1-mini",
        promptVersion: "v1",
        saved: false,
        name: null,
        startedAt: new Date("2026-03-12T12:00:00.000Z"),
        completedAt: new Date("2026-03-12T12:00:05.000Z"),
        createdAt: new Date("2026-03-12T12:00:00.000Z"),
      },
    ]);

    expect(result).toEqual({
      state: "ready",
      items: [
        {
          id: "run-1",
          href: "/runs/run-1",
          title: "Tokyo",
          subtitle: "2026-04-10 -> 2026-04-15",
          meta: "gpt-4.1-mini · 2026-03-12T12:00:00.000Z",
          statusLabel: "Succeeded",
          statusTone: "success",
        },
      ],
    });
  });

  it("returns explicit empty and unavailable panel states", () => {
    expect(createRecentRunsPanelViewModel([])).toEqual({
      state: "empty",
      items: [],
    });
    expect(createUnavailableRecentRunsPanelViewModel()).toEqual({
      state: "unavailable",
      items: [],
    });
  });

  it("falls back gracefully for legacy input payloads", () => {
    expect(
      extractInputPayloads({
        destination: "Tokyo",
      })
    ).toEqual({
      submittedPayload: {
        destination: "Tokyo",
      },
      normalizedPayload: null,
      isLegacyPayload: true,
      recordedAt: null,
    });
  });

  it("builds an inspector view model from detail data", () => {
    const result = createRunInspectorViewModel({
      run: {
        id: "run-1",
        status: "FAILED",
        requestId: "request-1",
        destination: "Tokyo",
        startDate: new Date("2026-04-10T00:00:00.000Z"),
        endDate: new Date("2026-04-15T00:00:00.000Z"),
        budget: "medium",
        travelStyle: "balanced",
        groupType: "friends",
        modelName: "gpt-4.1-mini",
        promptVersion: "v1",
        orchestratorVersion: null,
        saved: false,
        name: null,
        startedAt: new Date("2026-03-12T12:00:00.000Z"),
        completedAt: new Date("2026-03-12T12:00:05.000Z"),
        createdAt: new Date("2026-03-12T12:00:00.000Z"),
        updatedAt: new Date("2026-03-12T12:00:05.000Z"),
      },
      input: {
        id: "input-1",
        plannerRunId: "run-1",
        payload: {
          inputSnapshot: {
            destination: "Tokyo",
          },
          normalizedInput: {
            destination: "Tokyo",
            startDate: "2026-04-10",
          },
        },
        createdAt: new Date("2026-03-12T12:00:00.000Z"),
      },
      toolResults: [
        {
          id: "tool-1",
          plannerRunId: "run-1",
          toolName: "weather-summary",
          toolCategory: "normalized-context",
          sequence: 2,
          status: "PARTIAL",
          provider: "normalized-provider",
          latencyMs: null,
          payload: null,
          createdAt: new Date("2026-03-12T12:00:01.000Z"),
        },
      ],
      output: {
        id: "output-1",
        plannerRunId: "run-1",
        outputFormat: "json",
        payload: {
          destinationSummary: "Tokyo trip",
        },
        createdAt: new Date("2026-03-12T12:00:05.000Z"),
      },
      errors: [
        {
          id: "error-1",
          plannerRunId: "run-1",
          errorType: "PLANNER_OUTPUT_PARSE_ERROR",
          stepName: "plan-trip",
          message: "Planner output could not be parsed as JSON.",
          details: {
            rawText: "{bad",
          },
          createdAt: new Date("2026-03-12T12:00:05.000Z"),
        },
      ],
    });

    expect(result.header.defaultTab).toBe("errors");
    expect(result.input.submittedPayload).toEqual({
      destination: "Tokyo",
    });
    expect(result.input.normalizedPayload).toEqual({
      destination: "Tokyo",
      startDate: "2026-04-10",
    });
    expect(result.toolResults[0]).toEqual({
      id: "tool-1",
      title: "Weather Summary",
      sequenceLabel: "Step 2",
      provider: "normalized-provider",
      toolCategory: "normalized-context",
      statusLabel: "Partial",
      statusTone: "warning",
      latency: null,
      createdAt: "2026-03-12T12:00:01.000Z",
      payload: null,
    });
    expect(result.output).toEqual({
      outputFormat: "json",
      createdAt: "2026-03-12T12:00:05.000Z",
      payload: {
        destinationSummary: "Tokyo trip",
      },
    });
    expect(result.errors[0]?.details).toEqual({
      rawText: "{bad",
    });
  });
});
