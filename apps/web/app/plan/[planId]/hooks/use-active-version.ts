"use client";

import { useState } from "react";

interface UseActiveVersionReturn {
  activeVersionId: string;
  selectVersion: (versionId: string) => void;
}

export function useActiveVersion(
  initialVersionId: string
): UseActiveVersionReturn {
  const [activeVersionId, setActiveVersionId] = useState(initialVersionId);

  return {
    activeVersionId,
    selectVersion: setActiveVersionId,
  };
}
