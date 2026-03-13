import type { TripRequest } from "@atlas-graph/core/types";

interface PlansApiErrorDetails {
  code: string | null;
  status: number;
}

interface PlanIdResponse {
  id: string;
}

const legacyGeneratedPlanIds = new Set<string>();

export class PlansApiError extends Error {
  public readonly code: string | null;
  public readonly status: number;

  public constructor(message: string, details: PlansApiErrorDetails) {
    super(message);
    this.name = "PlansApiError";
    this.code = details.code;
    this.status = details.status;
  }
}

export async function createPlan(request: TripRequest): Promise<PlanIdResponse> {
  return savePlan("/api/plans", "POST", request);
}

export async function updatePlan(
  planId: string,
  request: TripRequest
): Promise<PlanIdResponse> {
  return savePlan(`/api/plans/${planId}`, "PATCH", request);
}

export async function generatePlan(planId: string): Promise<void> {
  if (legacyGeneratedPlanIds.delete(planId)) {
    return;
  }

  const response = await fetch(`/api/plans/${planId}/generate`, {
    method: "POST",
  });

  if (response.ok) {
    return;
  }

  const payload = await readJsonSafely(response);
  throw buildPlansApiError(
    response.status,
    payload,
    "Generation request failed. Please try again."
  );
}

async function savePlan(
  url: string,
  method: "PATCH" | "POST",
  request: TripRequest
): Promise<PlanIdResponse> {
  const response = await fetch(url, {
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
    },
    method,
  });

  if (response.status === 404 && method === "POST") {
    return await createPlanThroughLegacyRoute(request);
  }

  const payload = await readJsonSafely(response);

  if (!response.ok) {
    throw buildPlansApiError(
      response.status,
      payload,
      "Plan request failed. Please review the form and try again."
    );
  }

  const planId = extractPlanId(payload);
  if (!planId) {
    throw new PlansApiError("Plan API response did not include a plan id.", {
      code: null,
      status: response.status,
    });
  }

  return {
    id: planId,
  };
}

async function createPlanThroughLegacyRoute(
  request: TripRequest
): Promise<PlanIdResponse> {
  const response = await fetch("/api/plan-trip", {
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const payload = await readJsonSafely(response);

  if (!response.ok) {
    throw buildPlansApiError(
      response.status,
      payload,
      "Plan request failed. Please review the form and try again."
    );
  }

  const planId = extractPlanId(payload);
  if (!planId) {
    throw new PlansApiError("Plan API response did not include a plan id.", {
      code: null,
      status: response.status,
    });
  }

  legacyGeneratedPlanIds.add(planId);

  return {
    id: planId,
  };
}

async function readJsonSafely(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function extractPlanId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if ("id" in payload && typeof payload.id === "string") {
    return payload.id;
  }

  if (!("data" in payload) || !payload.data || typeof payload.data !== "object") {
    return null;
  }

  return "id" in payload.data && typeof payload.data.id === "string"
    ? payload.data.id
    : null;
}

function buildPlansApiError(
  status: number,
  payload: unknown,
  fallbackMessage: string
): PlansApiError {
  if (payload && typeof payload === "object" && "error" in payload) {
    const errorPayload = payload.error;

    if (errorPayload && typeof errorPayload === "object") {
      const code =
        "code" in errorPayload && typeof errorPayload.code === "string"
          ? errorPayload.code
          : null;
      const message =
        "message" in errorPayload && typeof errorPayload.message === "string"
          ? errorPayload.message
          : fallbackMessage;

      return new PlansApiError(message, {
        code,
        status,
      });
    }
  }

  return new PlansApiError(fallbackMessage, {
    code: null,
    status,
  });
}
