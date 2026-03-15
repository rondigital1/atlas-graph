"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowRight, Check, GripVertical, Menu, Send, Sparkles, Wand2, X } from "lucide-react";

import { optimizeDayPlan, reviseDayPlan } from "../../../lib/plans-api";
import type { AiSuggestion } from "../../../lib/plans-api";
import type { PlanActivityViewModel, PlanDayViewModel } from "../../../lib/types";

interface Props {
  days: PlanDayViewModel[];
}

interface ActivityDragData {
  dayId: string;
  slotKey: "morning" | "afternoon" | "evening";
  activityIndex: number;
}

function TimeSlot({
  label,
  slotKey,
  dayId,
  activities,
  icon,
  onActivityDragStart,
  onActivityDrop,
  activityDragOver,
  onActivityDragOver,
  onActivityDragLeave,
}: {
  label: string;
  slotKey: "morning" | "afternoon" | "evening";
  dayId: string;
  activities: PlanActivityViewModel[];
  icon: React.ReactNode;
  onActivityDragStart: (data: ActivityDragData) => void;
  onActivityDrop: (target: ActivityDragData) => void;
  activityDragOver: ActivityDragData | null;
  onActivityDragOver: (e: React.DragEvent, data: ActivityDragData) => void;
  onActivityDragLeave: () => void;
}) {
  const isSlotDropTarget =
    activityDragOver?.dayId === dayId &&
    activityDragOver?.slotKey === slotKey &&
    activityDragOver?.activityIndex === -1;

  return (
    <div
      className={`rounded-md bg-surface-elevated p-2.5 transition-colors ${isSlotDropTarget ? "ring-1 ring-primary/40" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (activities.length === 0) {
          onActivityDragOver(e, { dayId, slotKey, activityIndex: -1 });
        }
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        onActivityDragLeave();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onActivityDrop({ dayId, slotKey, activityIndex: activities.length });
      }}
    >
      <div className="mb-1.5 flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      {activities.length === 0 ? (
        <p className="py-2 text-center text-[10px] text-subtle">Drop here</p>
      ) : (
        <ul className="space-y-1">
          {activities.map((activity, i) => {
            const isDragTarget =
              activityDragOver?.dayId === dayId &&
              activityDragOver?.slotKey === slotKey &&
              activityDragOver?.activityIndex === i;

            return (
              <li
                key={i}
                draggable
                onDragStart={(e) => {
                  e.stopPropagation();
                  onActivityDragStart({ dayId, slotKey, activityIndex: i });
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onActivityDragOver(e, { dayId, slotKey, activityIndex: i });
                }}
                onDragLeave={(e) => {
                  e.stopPropagation();
                  onActivityDragLeave();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onActivityDrop({ dayId, slotKey, activityIndex: i });
                }}
                className={`group/item flex cursor-grab items-start gap-1.5 rounded-md p-1 transition-colors active:cursor-grabbing ${isDragTarget ? "bg-primary/10" : "hover:bg-background/50"}`}
              >
                <Menu size={10} className="mt-0.5 flex-shrink-0 text-subtle opacity-0 transition-opacity group-hover/item:opacity-100" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const morningIcon = (
  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const afternoonIcon = (
  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const eveningIcon = (
  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

function SuggestionCard({
  suggestion,
  onApprove,
  onReject,
}: {
  suggestion: AiSuggestion;
  onApprove: () => void;
  onReject: () => void;
}) {
  const typeLabels: Record<string, string> = {
    add: "Add",
    remove: "Remove",
    replace: "Swap",
    reorder: "Reorder",
  };
  const typeColors: Record<string, string> = {
    add: "bg-green-500/10 text-green-400",
    remove: "bg-red-500/10 text-red-400",
    replace: "bg-amber-500/10 text-amber-400",
    reorder: "bg-sky-500/10 text-sky-400",
  };

  return (
    <div className="rounded-lg border border-border-muted bg-background p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeColors[suggestion.type] ?? "bg-muted text-muted-foreground"}`}>
              {typeLabels[suggestion.type] ?? suggestion.type}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground">{suggestion.description}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{suggestion.detail}</p>
        </div>
        <div className="flex flex-shrink-0 gap-1">
          <button
            type="button"
            onClick={onApprove}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors hover:bg-primary/20"
            aria-label="Approve suggestion"
          >
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={onReject}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-elevated text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Reject suggestion"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function RevisionInput({ planId, dayNumber }: { planId: string; dayNumber: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());

  async function handleSubmit() {
    if (!prompt.trim()) {
      return;
    }
    setIsSubmitting(true);
    try {
      await reviseDayPlan(planId, dayNumber, prompt.trim());
      setSubmitted(true);
      setPrompt("");
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 2000);
    } catch {
      setIsSubmitting(false);
    }
  }

  async function handleOptimize() {
    setIsOptimizing(true);
    try {
      const result = await optimizeDayPlan(planId, dayNumber);
      setSuggestions(result);
    } catch {
      setSuggestions([]);
    } finally {
      setIsOptimizing(false);
    }
  }

  function handleApprove(id: string) {
    setApprovedIds((prev) => new Set(prev).add(id));
    setRejectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleReject(id: string) {
    setRejectedIds((prev) => new Set(prev).add(id));
    setApprovedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  async function handleApplyApproved() {
    const approved = suggestions.filter((s) => approvedIds.has(s.id));
    if (approved.length === 0) {
      return;
    }
    setIsSubmitting(true);
    const summaryPrompt = approved
      .map((s) => s.description)
      .join(". ");
    try {
      await reviseDayPlan(planId, dayNumber, `Apply these optimizations: ${summaryPrompt}`);
      setSubmitted(true);
      setSuggestions([]);
      setApprovedIds(new Set());
      setRejectedIds(new Set());
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 2000);
    } catch {
      setIsSubmitting(false);
    }
  }

  const pendingSuggestions = suggestions.filter(
    (s) => !approvedIds.has(s.id) && !rejectedIds.has(s.id),
  );
  const approvedSuggestions = suggestions.filter((s) => approvedIds.has(s.id));

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        <Sparkles size={14} />
        Revise with AI
      </button>
    );
  }

  if (submitted) {
    return (
      <div className="w-full rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
        <p className="text-sm font-medium text-primary">
          Revision submitted! The day will be updated shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 rounded-lg border border-border-muted bg-surface p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Sparkles size={14} className="text-primary" />
        Revise Day {dayNumber}
      </div>

      {/* Manual revision */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. Replace the museum visit with a food tour, add a sunset viewpoint..."
        rows={3}
        disabled={isSubmitting || isOptimizing}
        className="w-full resize-none rounded-lg border border-border-muted bg-background px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-subtle focus:border-primary focus:outline-none disabled:opacity-50"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || isOptimizing || !prompt.trim()}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Send size={14} />
          {isSubmitting ? "Submitting\u2026" : "Submit"}
        </button>
        <button
          type="button"
          onClick={handleOptimize}
          disabled={isSubmitting || isOptimizing || suggestions.length > 0}
          className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/10 disabled:opacity-50"
        >
          <Wand2 size={14} />
          {isOptimizing ? "Analyzing\u2026" : "Optimize with AI"}
        </button>
        <button
          type="button"
          onClick={() => { setIsOpen(false); setPrompt(""); setSuggestions([]); setApprovedIds(new Set()); setRejectedIds(new Set()); }}
          disabled={isSubmitting || isOptimizing}
          className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          Cancel
        </button>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-3 border-t border-border-muted pt-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Wand2 size={14} className="text-primary" />
            AI Suggestions
          </div>
          <p className="text-xs text-muted-foreground">
            Review each suggestion — approve the ones you like, reject the rest.
          </p>

          <div className="space-y-2">
            {pendingSuggestions.map((s) => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                onApprove={() => handleApprove(s.id)}
                onReject={() => handleReject(s.id)}
              />
            ))}
          </div>

          {approvedSuggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-primary">
                {approvedSuggestions.length} suggestion{approvedSuggestions.length > 1 ? "s" : ""} approved
              </p>
              <button
                type="button"
                onClick={handleApplyApproved}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                <Check size={14} />
                {isSubmitting ? "Applying\u2026" : `Apply ${approvedSuggestions.length} change${approvedSuggestions.length > 1 ? "s" : ""}`}
              </button>
            </div>
          )}

          {pendingSuggestions.length === 0 && approvedSuggestions.length === 0 && (
            <p className="text-xs text-muted-foreground">All suggestions reviewed.</p>
          )}
        </div>
      )}
    </div>
  );
}

export function PlanItineraryTimeline({ days: initialDays }: Props) {
  const params = useParams<{ planId: string }>();
  const planId = params.planId;

  const [orderedDays, setOrderedDays] = useState(initialDays);
  const [expandedDays, setExpandedDays] = useState<string[]>(
    initialDays.slice(0, 2).map((d) => d.id),
  );
  const [selectedDay, setSelectedDay] = useState<string>(initialDays[0]?.id ?? "");

  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const activityDragRef = useRef<ActivityDragData | null>(null);
  const [activityDragOver, setActivityDragOver] = useState<ActivityDragData | null>(null);

  function handleDragStart(index: number) {
    dragIndexRef.current = index;
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndexRef.current !== null && dragIndexRef.current !== index) {
      setDragOverIndex(index);
    }
  }

  function handleDragLeave() {
    setDragOverIndex(null);
  }

  function handleDrop(targetIndex: number) {
    const sourceIndex = dragIndexRef.current;
    if (sourceIndex === null || sourceIndex === targetIndex) {
      dragIndexRef.current = null;
      setDragOverIndex(null);
      return;
    }

    setOrderedDays((prev) => {
      const next = [...prev];
      const removed = next.splice(sourceIndex, 1);
      const movedDay = removed[0];
      if (!movedDay) {
        return prev;
      }
      next.splice(targetIndex, 0, movedDay);
      return next.map((day, i) => ({
        ...day,
        dayNumber: i + 1,
      }));
    });

    dragIndexRef.current = null;
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    dragIndexRef.current = null;
    setDragOverIndex(null);
    activityDragRef.current = null;
    setActivityDragOver(null);
  }

  function handleActivityDragStart(data: ActivityDragData) {
    activityDragRef.current = data;
    dragIndexRef.current = null;
  }

  function handleActivityDragOver(e: React.DragEvent, target: ActivityDragData) {
    e.preventDefault();
    if (!activityDragRef.current) {
      return;
    }
    const src = activityDragRef.current;
    if (src.dayId === target.dayId && src.slotKey === target.slotKey && src.activityIndex === target.activityIndex) {
      return;
    }
    setActivityDragOver(target);
  }

  function handleActivityDragLeave() {
    setActivityDragOver(null);
  }

  function handleActivityDrop(target: ActivityDragData) {
    const source = activityDragRef.current;
    activityDragRef.current = null;
    setActivityDragOver(null);

    if (!source) {
      return;
    }
    if (source.dayId === target.dayId && source.slotKey === target.slotKey && source.activityIndex === target.activityIndex) {
      return;
    }

    setOrderedDays((prev) => {
      const next = prev.map((d) => ({
        ...d,
        morning: [...d.morning],
        afternoon: [...d.afternoon],
        evening: [...d.evening],
      }));

      const srcDay = next.find((d) => d.id === source.dayId);
      const tgtDay = next.find((d) => d.id === target.dayId);
      if (!srcDay || !tgtDay) {
        return prev;
      }

      const srcSlot = srcDay[source.slotKey];
      const removed = srcSlot.splice(source.activityIndex, 1);
      const movedActivity = removed[0];
      if (!movedActivity) {
        return prev;
      }

      const tgtSlot = tgtDay[target.slotKey];
      const insertAt = target.activityIndex === -1 ? tgtSlot.length : target.activityIndex;
      tgtSlot.splice(insertAt, 0, movedActivity);

      return next;
    });
  }

  const toggleDay = (id: string) => {
    setExpandedDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
    setSelectedDay(id);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Day-by-Day Itinerary
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-subtle">Drag to reorder</span>
          <span aria-hidden="true" className="text-subtle">|</span>
          <button
            type="button"
            onClick={() => setExpandedDays(orderedDays.map((d) => d.id))}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Expand all
          </button>
          <span aria-hidden="true" className="text-subtle">|</span>
          <button
            type="button"
            onClick={() => setExpandedDays([])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Collapse all
          </button>
        </div>
      </div>

      <ol className="space-y-2">
        {orderedDays.map((day, index) => {
          const isExpanded = expandedDays.includes(day.id);
          const isSelected = selectedDay === day.id;
          const isDragOver = dragOverIndex === index;
          const panelId = `day-panel-${day.id}`;

          return (
            <li
              key={day.id}
              draggable
              onDragStart={(e) => { if (activityDragRef.current) { e.preventDefault(); return; } handleDragStart(index); }}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              className={`group relative rounded-lg border transition-all ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : isSelected
                    ? "border-primary/50 bg-primary-subtle"
                    : "border-border-muted bg-surface hover:border-border"
              }`}
            >
              {index < orderedDays.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute -bottom-2 left-6 h-2 w-px bg-border-muted"
                />
              )}

              <div className="flex w-full items-center gap-1 p-3">
                {/* Drag handle */}
                <div
                  className="flex-shrink-0 cursor-grab text-subtle opacity-0 transition-opacity active:cursor-grabbing group-hover:opacity-100"
                  aria-label="Drag to reorder"
                >
                  <GripVertical size={14} />
                </div>

                <button
                  type="button"
                  onClick={() => toggleDay(day.id)}
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  className="flex flex-1 items-center gap-3"
                >
                  <div
                    aria-hidden="true"
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {day.dayNumber}
                  </div>

                  <div className="flex flex-1 items-center gap-3 text-left">
                    <div className="flex-1">
                      <span className="font-medium text-foreground">
                        {day.theme}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        Day {day.dayNumber} &middot; {day.date}
                      </div>
                    </div>

                    {!isExpanded && day.morning.length > 0 && (
                      <div
                        aria-hidden="true"
                        className="hidden max-w-xs truncate text-xs text-subtle lg:block"
                      >
                        {day.morning[0]?.title}
                      </div>
                    )}
                  </div>

                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-muted-foreground transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>

              {isExpanded && (
                <div
                  id={panelId}
                  className="border-t border-border-muted px-3 pb-3 pt-3"
                >
                  <div className="ml-11 space-y-3">
                    <div className="grid gap-2 sm:grid-cols-3">
                      <TimeSlot
                        label="Morning"
                        slotKey="morning"
                        dayId={day.id}
                        activities={day.morning}
                        icon={morningIcon}
                        onActivityDragStart={handleActivityDragStart}
                        onActivityDrop={handleActivityDrop}
                        activityDragOver={activityDragOver}
                        onActivityDragOver={handleActivityDragOver}
                        onActivityDragLeave={handleActivityDragLeave}
                      />
                      <TimeSlot
                        label="Afternoon"
                        slotKey="afternoon"
                        dayId={day.id}
                        activities={day.afternoon}
                        icon={afternoonIcon}
                        onActivityDragStart={handleActivityDragStart}
                        onActivityDrop={handleActivityDrop}
                        activityDragOver={activityDragOver}
                        onActivityDragOver={handleActivityDragOver}
                        onActivityDragLeave={handleActivityDragLeave}
                      />
                      <TimeSlot
                        label="Evening"
                        slotKey="evening"
                        dayId={day.id}
                        activities={day.evening}
                        icon={eveningIcon}
                        onActivityDragStart={handleActivityDragStart}
                        onActivityDrop={handleActivityDrop}
                        activityDragOver={activityDragOver}
                        onActivityDragOver={handleActivityDragOver}
                        onActivityDragLeave={handleActivityDragLeave}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-muted pt-3">
                      <RevisionInput planId={planId} dayNumber={day.dayNumber} />
                      <Link
                        href={`/plan/${planId}/day/${day.dayNumber}`}
                        className="flex flex-shrink-0 items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                      >
                        View full day
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
