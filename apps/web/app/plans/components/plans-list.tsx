"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { deletePlan } from "../../lib/plans-api";
import type { PlansListItemViewModel, StatusTone } from "../../lib/types";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";

const STATUS_STYLES: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  danger: "bg-destructive/15 text-destructive",
};

interface Props {
  items: PlansListItemViewModel[];
}

export function PlansList({ items: initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [deletingItem, setDeletingItem] =
    useState<PlansListItemViewModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete() {
    if (!deletingItem) {
      return;
    }

    setIsDeleting(true);

    try {
      await deletePlan(deletingItem.id);
      setItems((prev) => prev.filter((item) => item.id !== deletingItem.id));
      setDeletingItem(null);
      router.refresh();
    } catch {
      setIsDeleting(false);
    }
  }

  function handleCancelDelete() {
    setDeletingItem(null);
    setIsDeleting(false);
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-surface">
        <ul className="divide-y divide-border-muted">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-elevated"
            >
              <Link
                href={item.href}
                className="min-w-0 flex-1"
              >
                {item.name && (
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.name}
                  </p>
                )}
                <p className={`truncate text-sm ${item.name ? "text-muted-foreground" : "font-medium text-foreground"}`}>
                  {item.countryFlag && (
                    <span className="mr-1.5">{item.countryFlag}</span>
                  )}
                  {item.destination}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.tripDates}
                </p>
                {(item.budget || item.travelStyle || item.groupType) && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.budget && (
                      <span className="rounded bg-surface-elevated px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.budget}
                      </span>
                    )}
                    {item.travelStyle && (
                      <span className="rounded bg-surface-elevated px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.travelStyle}
                      </span>
                    )}
                    {item.groupType && (
                      <span className="rounded bg-surface-elevated px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.groupType}
                      </span>
                    )}
                  </div>
                )}
                <p className="mt-2 text-[10px] text-subtle">
                  Created {item.createdAt}
                </p>
              </Link>

              <div className="mt-0.5 flex shrink-0 items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${STATUS_STYLES[item.statusTone]}`}
                >
                  {item.statusLabel}
                </span>
                <Link
                  href={item.href}
                  aria-label={`Edit trip to ${item.destination}`}
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => setDeletingItem(item)}
                  aria-label={`Delete trip to ${item.destination}`}
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ConfirmDeleteDialog
        open={deletingItem !== null}
        destination={deletingItem?.destination ?? ""}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
