"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "./step-indicator";
import { ChipSelector } from "./chip-selector";
import { PromptInput } from "./prompt-input";
import { AIPreviewPanel } from "./ai-preview-panel";
import { TemplateCards } from "./template-cards";
import type { TripSelections } from "../lib/types";
import { RecentPlansPanel } from "./recent-plans-panel";
import {
  STEPS,
  DESTINATION_TYPES,
  TRIP_TYPES,
  PLANNING_MODES,
  BUDGET_LEVELS,
  TRAVEL_PACE,
  INTERESTS,
  FLIGHT_PREFERENCES,
  ACCOMMODATION_TYPES,
  CONSTRAINTS,
  TEMPLATES,
  SURPRISE_SELECTIONS,
  SURPRISE_PROMPT,
} from "../lib/mock/wizard-options";

export type { TripSelections };

const EMPTY_SELECTIONS: TripSelections = {
  destinationType: [],
  tripType: [],
  planningMode: [],
  budget: [],
  flightPreference: [],
  accommodation: [],
  travelPace: [],
  interests: [],
  constraints: [],
};

const STEP_HEADINGS = [
  {
    heading: "Where do you want to go?",
    subtitle: "Tell us about your destination and trip.",
  },
  {
    heading: "What's your style?",
    subtitle: "Set your budget, pace, and interests.",
  },
  {
    heading: "How do you want to travel?",
    subtitle: "Flights, accommodation, and requirements.",
  },
  {
    heading: "Ready to generate your plan",
    subtitle: "Add any final details or go ahead and generate.",
  },
] as const;

export function PlanningWorkspace() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selections, setSelections] = useState<TripSelections>(EMPTY_SELECTIONS);

  const updateSelection = (key: keyof TripSelections, value: string[]) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setSelections((prev) => ({ ...prev, ...template.selections }));
      if (template.prompt) {
        setPrompt(template.prompt);
      }
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // TODO: wire to real /api/plan-trip endpoint; navigate with run ID
    setTimeout(() => {
      setIsGenerating(false);
      router.push("/results");
    }, 2000);
  };

  const handleSurprise = () => {
    setSelections(SURPRISE_SELECTIONS);
    setPrompt(SURPRISE_PROMPT);
  };

  const canSubmit =
    selections.destinationType.length > 0 || prompt.trim().length > 10;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <ChipSelector
              label="Destination type"
              description="What kind of places interest you?"
              options={DESTINATION_TYPES}
              selected={selections.destinationType}
              onChange={(v) => updateSelection("destinationType", v)}
              multiple
            />
            <div className="grid gap-8 lg:grid-cols-2">
              <ChipSelector
                label="Travelers"
                options={TRIP_TYPES}
                selected={selections.tripType}
                onChange={(v) => updateSelection("tripType", v)}
              />
              <ChipSelector
                label="Duration"
                options={PLANNING_MODES}
                selected={selections.planningMode}
                onChange={(v) => updateSelection("planningMode", v)}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <ChipSelector
                label="Budget"
                options={BUDGET_LEVELS}
                selected={selections.budget}
                onChange={(v) => updateSelection("budget", v)}
              />
              <ChipSelector
                label="Pace"
                description="How do you like to travel?"
                options={TRAVEL_PACE}
                selected={selections.travelPace}
                onChange={(v) => updateSelection("travelPace", v)}
              />
            </div>
            <ChipSelector
              label="Interests"
              description="What activities do you enjoy?"
              options={INTERESTS}
              selected={selections.interests}
              onChange={(v) => updateSelection("interests", v)}
              multiple
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <ChipSelector
                label="Flights"
                description="What matters most?"
                options={FLIGHT_PREFERENCES}
                selected={selections.flightPreference}
                onChange={(v) => updateSelection("flightPreference", v)}
              />
              <ChipSelector
                label="Accommodation"
                options={ACCOMMODATION_TYPES}
                selected={selections.accommodation}
                onChange={(v) => updateSelection("accommodation", v)}
              />
            </div>
            <ChipSelector
              label="Requirements"
              description="Any specific needs?"
              options={CONSTRAINTS}
              selected={selections.constraints}
              onChange={(v) => updateSelection("constraints", v)}
              multiple
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleGenerate}
              onSurprise={handleSurprise}
              isGenerating={isGenerating}
              canSubmit={canSubmit}
            />
            <TemplateCards onSelect={handleTemplateSelect} />
          </div>
        );
      default:
        return null;
    }
  };

  const { heading, subtitle } = STEP_HEADINGS[currentStep] ?? STEP_HEADINGS[0];

  return (
    <div className="flex flex-1 gap-6 lg:gap-8">
      {/* Main Workspace */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Step Indicator */}
        <div className="mb-6">
          <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 rounded-xl border border-border bg-surface p-6 sm:p-8">
          {/* Step heading */}
          <div className="mb-6 border-b border-border-muted pb-5">
            <h2 className="text-base font-semibold text-foreground">{heading}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </button>

          {currentStep < STEPS.length - 1 && (
            <button
              type="button"
              onClick={() =>
                setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))
              }
              className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Continue
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* AI Context Panel - Desktop */}
      <div className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-14 space-y-4">
          <AIPreviewPanel
            selections={selections}
            prompt={prompt}
            currentStep={currentStep}
          />
          <RecentPlansPanel />
        </div>
      </div>

      {/* AI Context Panel - Mobile */}
      <div className="fixed bottom-4 left-4 right-4 lg:hidden">
        <details className="group rounded-xl border border-border bg-surface shadow-lg">
          <summary className="flex cursor-pointer list-none items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <div
                aria-hidden="true"
                className="flex h-5 w-5 items-center justify-center rounded bg-primary/15"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground">
                Context
              </span>
            </div>
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground transition-transform group-open:rotate-180"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div className="max-h-80 overflow-y-auto border-t border-border-muted">
            <AIPreviewPanel
              selections={selections}
              prompt={prompt}
              currentStep={currentStep}
            />
          </div>
        </details>
      </div>
    </div>
  );
}
