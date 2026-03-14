"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";

import { deletePlan } from "../../../lib/plans-api";
import { ConfirmDeleteDialog } from "../../../plans/components/confirm-delete-dialog";

interface Props {
  planId: string;
  destination: string;
}

export function PlanDetailActions({ planId, destination }: Props) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      await deletePlan(planId);
      router.push("/plans");
    } catch {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Link
          href="/plans"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Back to My Trips
        </Link>
        <button
          type="button"
          onClick={() => setShowDeleteDialog(true)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
        >
          <Trash2 size={14} />
          Delete trip
        </button>
      </div>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        destination={destination}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setIsDeleting(false);
        }}
        isDeleting={isDeleting}
      />
    </>
  );
}
