"use client";

import type { RegenerationAvailability } from "../../../lib/types";

interface UseRegenerationReturn {
  availability: RegenerationAvailability;
  unavailableReason: string | undefined;
  requestRegeneration: () => void;
}

export function useRegeneration(
  _planId: string,
  backendReady: boolean
): UseRegenerationReturn {
  if (!backendReady) {
    return {
      availability: "unavailable",
      unavailableReason: "Regeneration not yet available",
      requestRegeneration: () => {},
    };
  }

  // TODO: implement real regeneration when AGE-21 lands
  return {
    availability: "available",
    unavailableReason: undefined,
    requestRegeneration: () => {},
  };
}
