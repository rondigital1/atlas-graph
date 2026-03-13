"use client";

import { useState } from "react";

import { ChipSelector } from "./chip-selector";
import { PromptInput } from "./prompt-input";
import { TemplateDropdown } from "./template-dropdown";
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
  SURPRISE_PROMPT,
  SURPRISE_SELECTIONS,
  TEMPLATES,
  TRAVEL_PACE,
  TRIP_TYPES,
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
  const { errorMessage, isSubmitting, submissionStage, submit } =
    usePlanSubmission();

  const updateSelection = (key: keyof TripSelections, value: string[]) => {
    setValidationError(null);
    setFormState((prev) => ({
      ...prev,
      selections: {
        ...prev.selections,
        [key]: value,
      },
    }));
  };

  const updateField = (
    key: "destination" | "endDate" | "prompt" | "startDate",
    value: string
  ) => {
    setValidationError(null);
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = TEMPLATES.find((candidate) => candidate.id === templateId);
    if (!template) {
      return;
    }

    setValidationError(null);
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
    setFormState((prev) => ({
      ...prev,
      prompt: SURPRISE_PROMPT,
      selections: SURPRISE_SELECTIONS,
    }));
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

  let canSubmit = false;

  try {
    buildTripRequestFromForm(formState);
    canSubmit = true;
  } catch {
    canSubmit = false;
  }

  const activeError = validationError ?? errorMessage;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Plan your trip
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Describe your trip, then fill in the details needed to generate a real
          persisted plan.
        </p>
      </div>

      <div className="space-y-8">
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

        <TemplateDropdown disabled={isSubmitting} onSelect={handleTemplateSelect} />

        {activeError ? (
          <div
            role="alert"
            className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-200"
          >
            {activeError}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-[1.6fr_1fr_1fr]">
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Destination</span>
            <input
              type="text"
              value={formState.destination}
              onChange={(event) => updateField("destination", event.target.value)}
              disabled={isSubmitting}
              placeholder="Lisbon, Portugal"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Start date</span>
            <input
              type="date"
              value={formState.startDate}
              onChange={(event) => updateField("startDate", event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">End date</span>
            <input
              type="date"
              value={formState.endDate}
              min={formState.startDate || undefined}
              onChange={(event) => updateField("endDate", event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground">
            Trip preferences
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-6">
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
                  onChange={(value) => updateSelection("flightPreference", value)}
                />
                <ChipSelector
                  label="Accommodation"
                  disabled={isSubmitting}
                  options={ACCOMMODATION_TYPES}
                  selected={formState.selections.accommodation}
                  onChange={(value) => updateSelection("accommodation", value)}
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
  );
}
