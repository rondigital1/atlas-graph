"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Bookmark, BookmarkCheck, Trash2 } from "lucide-react";

import { deletePlan } from "../../../lib/plans-api";
import { ConfirmDeleteDialog } from "../../../plans/components/confirm-delete-dialog";
import { SaveTripDialog } from "./save-trip-dialog";

interface Props {
  planId: string;
  destination: string;
  tripDates: string;
  isSaved: boolean;
  savedName: string | null;
}

function buildDefaultName(destination: string, tripDates: string): string {
  if (tripDates) {
    return `${destination} · ${tripDates}`;
  }
  return destination;
}

export function PlanDetailActions({
  planId,
  destination,
  tripDates,
  isSaved: initialSaved,
  savedName: initialName,
}: Props) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [savedName, setSavedName] = useState(initialName);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      await deletePlan(planId);
      router.push("/plans");
    } catch {
      setIsDeleting(false);
    }
  }

  async function handleSave(name: string) {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/plans/${planId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setIsSaved(true);
        setSavedName(name);
        setShowSaveDialog(false);
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUnsave() {
    try {
      const res = await fetch(`/api/plans/${planId}/save`, {
        method: "DELETE",
      });

      if (res.ok) {
        setIsSaved(false);
        setSavedName(null);
      }
    } catch {
      // Silently fail
    }
  }

  const defaultName = savedName ?? buildDefaultName(destination, tripDates);

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
        <div className="flex items-center gap-2">
          {isSaved ? (
            <button
              type="button"
              onClick={handleUnsave}
              className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              <BookmarkCheck size={14} />
              Saved{savedName ? `: ${savedName}` : ""}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Bookmark size={14} />
              Save to My Trips
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
          >
            <Trash2 size={14} />
            Delete trip
          </button>
        </div>
      </div>

      <SaveTripDialog
        open={showSaveDialog}
        defaultName={defaultName}
        onConfirm={handleSave}
        onCancel={() => {
          setShowSaveDialog(false);
          setIsSaving(false);
        }}
        isSaving={isSaving}
      />

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
