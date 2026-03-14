"use client";

import { GripVertical, Pencil, Trash2, X, Check } from "lucide-react";
import { useState } from "react";

import type { PlanActivityViewModel } from "../../../../../lib/types";

interface Props {
  activity: PlanActivityViewModel;
  onUpdate: (updated: PlanActivityViewModel) => void;
  onRemove: () => void;
}

export function EditableActivityCard({ activity, onUpdate, onRemove }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description);

  function handleSave() {
    if (!title.trim()) {
      return;
    }
    onUpdate({ ...activity, title: title.trim(), description: description.trim() });
    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(activity.title);
    setDescription(activity.description);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="rounded-lg border border-primary/40 bg-surface p-3 shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2 w-full rounded-md border border-border-muted bg-background px-3 py-1.5 text-sm font-medium text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
          placeholder="Activity title"
          autoFocus
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-md border border-border-muted bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-subtle focus:border-primary focus:outline-none"
          placeholder="Description"
        />
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Check size={12} />
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1 rounded-md px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X size={12} />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-2 rounded-lg border border-border-muted bg-surface p-3 transition-colors hover:border-border">
      <GripVertical
        size={14}
        className="mt-0.5 flex-shrink-0 text-subtle opacity-0 transition-opacity group-hover:opacity-100"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{activity.title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {activity.description}
        </p>
      </div>
      <div className="flex flex-shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
          aria-label={`Edit ${activity.title}`}
        >
          <Pencil size={12} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
          aria-label={`Remove ${activity.title}`}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
