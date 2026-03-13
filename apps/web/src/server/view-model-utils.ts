import type { StatusTone } from "../../app/lib/types";

export function formatDateOnly(value: Date | null): string | null {
  if (!value) {
    return null;
  }

  return value.toISOString().slice(0, 10);
}

export function formatDateTime(value: Date | null): string | null {
  if (!value) {
    return null;
  }

  return value.toISOString();
}

export function formatDuration(durationMs: number | null): string | null {
  if (durationMs === null) {
    return null;
  }

  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

export function formatEnumLabel(value: string | null): string | null {
  if (!value) {
    return null;
  }

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

export function formatTripDates(startDate: Date | null, endDate: Date | null): string {
  const formattedStart = formatDateOnly(startDate);
  const formattedEnd = formatDateOnly(endDate);

  if (formattedStart && formattedEnd) {
    return `${formattedStart} -> ${formattedEnd}`;
  }

  if (formattedStart) {
    return formattedStart;
  }

  if (formattedEnd) {
    return formattedEnd;
  }

  return "Dates unavailable";
}

export function getRunStatusPresentation(status: string): {
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
    case "RUNNING":
      return {
        label: "Running",
        tone: "warning",
      };
    default:
      return {
        label: "Pending",
        tone: "neutral",
      };
  }
}
