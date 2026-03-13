"use client";

import type {
  RegenerationTriggerViewModel,
  RunInspectorViewModel,
  VersionListViewModel,
} from "../../../lib/types";
import { RunInspector } from "../../../runs/[id]/components/run-inspector";
import { useActiveVersion } from "../hooks/use-active-version";
import { useRegeneration } from "../hooks/use-regeneration";
import { PlanDetailToolbar } from "./plan-detail-toolbar";

interface Props {
  inspectorModel: RunInspectorViewModel;
  versions: VersionListViewModel;
  regeneration: RegenerationTriggerViewModel;
}

export function PlanDetailClientShell({
  inspectorModel,
  versions,
  regeneration,
}: Props) {
  const { selectVersion } = useActiveVersion(versions.activeVersionId);
  const { requestRegeneration } = useRegeneration(
    regeneration.planId,
    regeneration.availability !== "unavailable"
  );

  return (
    <div className="space-y-6">
      <PlanDetailToolbar
        versions={versions}
        regeneration={regeneration}
        onVersionSelect={selectVersion}
        onRegenerate={requestRegeneration}
      />
      <RunInspector model={inspectorModel} />
    </div>
  );
}
