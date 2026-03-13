"use client";

import type {
  RegenerationTriggerViewModel,
  VersionListViewModel,
} from "../../../lib/types";
import { RegenerationTrigger } from "./regeneration-trigger";
import { VersionSelector } from "./version-selector";

interface Props {
  versions: VersionListViewModel;
  regeneration: RegenerationTriggerViewModel;
  onVersionSelect: (versionId: string) => void;
  onRegenerate: () => void;
}

export function PlanDetailToolbar({
  versions,
  regeneration,
  onVersionSelect,
  onRegenerate,
}: Props) {
  return (
    <section className="rounded-2xl border border-border bg-surface px-5 py-3 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <VersionSelector
          versions={versions}
          onVersionSelect={onVersionSelect}
        />
        <RegenerationTrigger
          trigger={regeneration}
          onRegenerate={onRegenerate}
        />
      </div>
    </section>
  );
}
