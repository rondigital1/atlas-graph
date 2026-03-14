"use client";

import { useState, useRef, useCallback } from "react";

import { ChipSelector } from "./chip-selector";
import { DestinationAutocomplete } from "./destination-autocomplete";
import { PromptInput } from "./prompt-input";
import { TemplateSidebar } from "./template-sidebar";
import { usePlanSubmission } from "./use-plan-submission";
import {
  buildTripRequestFromForm,
  PlannerFormValidationError,
} from "../lib/planner-form-request";
import type { PlannerFormState, TripSelections } from "../lib/types";
import {
  ACCOMMODATION_TYPES,
  BUDGET_LEVELS,
  CONSTRAINTS,
  DESTINATION_TYPES,
  FLIGHT_PREFERENCES,
  INTERESTS,
  TEMPLATES,
  TRAVEL_PACE,
  TRIP_TYPES,
  generateSurprise,
} from "../lib/mock/wizard-options";

const EMPTY_SELECTIONS: TripSelections = {
  accommodation: [],
  budget: [],
  constraints: [],
  destinationType: [],
  flightPreference: [],
  interests: [],
  travelPace: [],
  tripType: [],
};

const INITIAL_FORM_STATE: PlannerFormState = {
  destination: "",
  endDate: "",
  prompt: "",
  selections: EMPTY_SELECTIONS,
  startDate: "",
};

export function PlannerForm() {
  const [formState, setFormState] = useState<PlannerFormState>(INITIAL_FORM_STATE);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [flashKey, setFlashKey] = useState(0);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const { errorMessage, isSubmitting, submissionStage, submit } =
    usePlanSubmission();

  const updateSelection = (key: keyof TripSelections, value: string[]) => {
    setActiveTemplateId(null);
    setValidationError(null);
    setFormState((prev) => ({
      ...prev,
      selections: {
        ...prev.selections,
        [key]: value,
      },
    }));
  };

  const updateField = useCallback(
    (
      key: "destination" | "endDate" | "prompt" | "startDate",
      value: string
    ) => {
      setActiveTemplateId(null);
      setValidationError(null);
      setFormState((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleTemplateSelect = (templateId: string) => {
    const template = TEMPLATES.find((candidate) => candidate.id === templateId);
    if (!template) {
      return;
    }

    setValidationError(null);
    setActiveTemplateId(templateId);
    setFormState((prev) => ({
      ...prev,
      prompt: template.prompt ?? prev.prompt,
      selections: {
        ...prev.selections,
        ...template.selections,
      },
    }));
  };

  const handleSurprise = () => {
    if (isSubmitting) {
      return;
    }

    setValidationError(null);
    setActiveTemplateId(null);
    const surprise = generateSurprise();
    setFormState({
      destination: surprise.destination,
      startDate: surprise.startDate,
      endDate: surprise.endDate,
      prompt: surprise.prompt,
      selections: surprise.selections,
    });
    setFlashKey((prev) => prev + 1);
  };

  const handleGenerate = async () => {
    if (isSubmitting) {
      return;
    }

    setValidationError(null);

    try {
      const request = buildTripRequestFromForm(formState);
      await submit(request);
    } catch (error) {
      if (error instanceof PlannerFormValidationError) {
        setValidationError(error.message);
        return;
      }

      setValidationError("Complete the required trip details before generating.");
    }
  };

  const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current && !isSubmitting) {
      ref.current.showPicker();
    }
  };

  let canSubmit = false;

  try {
    buildTripRequestFromForm(formState);
    canSubmit = true;
  } catch {
    canSubmit = false;
  }

  const activeError = validationError ?? errorMessage;

  const flashClass = flashKey > 0 ? "animate-flash" : "";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Plan your trip
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Describe your trip, then fill in the details needed to generate a real
          persisted plan.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Template sidebar (desktop) */}
        <TemplateSidebar
          variant="desktop"
          disabled={isSubmitting}
          activeTemplateId={activeTemplateId}
          onSelect={handleTemplateSelect}
        />

        {/* Main form */}
        <div className="min-w-0 flex-1 space-y-8">
          {/* Mobile template strip */}
          <div className="lg:hidden">
            <TemplateSidebar
              variant="mobile"
              disabled={isSubmitting}
              activeTemplateId={activeTemplateId}
              onSelect={handleTemplateSelect}
            />
          </div>

          <PromptInput
            value={formState.prompt}
            onChange={(value) => updateField("prompt", value)}
            onSubmit={handleGenerate}
            onSurprise={handleSurprise}
            canSubmit={canSubmit}
            disabled={isSubmitting}
            helperText="Optional notes only. Submission uses the destination, dates, and selections below."
            isSubmitting={isSubmitting}
            submissionStage={submissionStage}
          />

          {activeError ? (
            <div
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-200"
            >
              {activeError}
            </div>
          ) : null}

          <div key={`dest-dates-${flashKey}`} className={flashClass}>
            <div className="grid gap-4 sm:grid-cols-[1.6fr_1fr_1fr] sm:items-end">
              <DestinationAutocomplete
                value={formState.destination}
                onChange={(value) => updateField("destination", value)}
                disabled={isSubmitting}
              />
              <label className="space-y-2">
                <span className="text-sm font-medium text-foreground">
                  Start date
                </span>
                <div
                  onClick={() => openDatePicker(startDateRef)}
                  className="cursor-pointer"
                >
                  <input
                    ref={startDateRef}
                    type="date"
                    value={formState.startDate}
                    onChange={(event) =>
                      updateField("startDate", event.target.value)
                    }
                    disabled={isSubmitting}
                    className="pointer-events-auto w-full cursor-pointer rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-foreground">
                  End date
                </span>
                <div
                  onClick={() => openDatePicker(endDateRef)}
                  className="cursor-pointer"
                >
                  <input
                    ref={endDateRef}
                    type="date"
                    value={formState.endDate}
                    min={formState.startDate || undefined}
                    onChange={(event) =>
                      updateField("endDate", event.target.value)
                    }
                    disabled={isSubmitting}
                    className="pointer-events-auto w-full cursor-pointer rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground">
              Trip preferences
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div key={`prefs-${flashKey}`} className={`space-y-6 ${flashClass}`}>
            <ChipSelector
              label="Destination type"
              description="What kind of places interest you?"
              disabled={isSubmitting}
              options={DESTINATION_TYPES}
              selected={formState.selections.destinationType}
              onChange={(value) => updateSelection("destinationType", value)}
              multiple
            />
            <div className="grid gap-6 sm:grid-cols-3">
              <ChipSelector
                label="Travelers"
                disabled={isSubmitting}
                options={TRIP_TYPES}
                selected={formState.selections.tripType}
                onChange={(value) => updateSelection("tripType", value)}
              />
              <ChipSelector
                label="Budget"
                disabled={isSubmitting}
                options={BUDGET_LEVELS}
                selected={formState.selections.budget}
                onChange={(value) => updateSelection("budget", value)}
              />
              <ChipSelector
                label="Pace"
                description="How do you like to travel?"
                disabled={isSubmitting}
                options={TRAVEL_PACE}
                selected={formState.selections.travelPace}
                onChange={(value) => updateSelection("travelPace", value)}
              />
            </div>
            <ChipSelector
              label="Interests"
              description="Choose at least one interest or trip preference."
              disabled={isSubmitting}
              options={INTERESTS}
              selected={formState.selections.interests}
              onChange={(value) => updateSelection("interests", value)}
              multiple
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${showMoreOptions ? "rotate-90" : ""}`}
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
              More options
            </button>

            {showMoreOptions ? (
              <div className="mt-4 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <ChipSelector
                    label="Flights"
                    description="What matters most?"
                    disabled={isSubmitting}
                    options={FLIGHT_PREFERENCES}
                    selected={formState.selections.flightPreference}
                    onChange={(value) =>
                      updateSelection("flightPreference", value)
                    }
                  />
                  <ChipSelector
                    label="Accommodation"
                    disabled={isSubmitting}
                    options={ACCOMMODATION_TYPES}
                    selected={formState.selections.accommodation}
                    onChange={(value) =>
                      updateSelection("accommodation", value)
                    }
                  />
                </div>
                <ChipSelector
                  label="Requirements"
                  description="Any specific needs?"
                  disabled={isSubmitting}
                  options={CONSTRAINTS}
                  selected={formState.selections.constraints}
                  onChange={(value) => updateSelection("constraints", value)}
                  multiple
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
