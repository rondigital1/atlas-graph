"use client";

import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  destination: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function ConfirmDeleteDialog({
  open,
  destination,
  onConfirm,
  onCancel,
  isDeleting,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleCancel() {
    if (!isDeleting) {
      onCancel();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      className="m-auto max-w-sm rounded-xl border border-border bg-surface p-0 text-foreground backdrop:bg-black/50"
    >
      <div className="p-6">
        <h2
          id="delete-dialog-title"
          className="text-base font-semibold text-foreground"
        >
          Delete trip?
        </h2>
        <p
          id="delete-dialog-description"
          className="mt-2 text-sm text-muted-foreground"
        >
          Are you sure you want to delete your trip to{" "}
          <span className="font-medium text-foreground">{destination}</span>?
          This can&apos;t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isDeleting}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
