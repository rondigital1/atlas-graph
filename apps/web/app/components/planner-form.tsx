"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChipSelector } from "./chip-selector";
import { PromptInput } from "./prompt-input";
import { TemplateDropdown } from "./template-dropdown";
import type { TripSelections } from "../lib/types";
import {
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

export function PlannerForm() {
  const router = useRouter();
  const [selections, setSelections] = useState<TripSelections>(EMPTY_SELECTIONS);
  const [prompt, setPrompt] = useState("");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Plan your trip
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Describe your dream trip or pick a few preferences below.
        </p>
      </div>

      <div className="space-y-8">
        {/* Hero prompt input */}
        <PromptInput
          value={prompt}
          onChange={setPrompt}
          onSubmit={handleGenerate}
          onSurprise={handleSurprise}
          isGenerating={isGenerating}
          canSubmit={canSubmit}
        />

        <TemplateDropdown onSelect={handleTemplateSelect} />

        {/* Separator */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground">Or guide the AI</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Essential chips */}
        <div className="space-y-6">
          <ChipSelector
            label="Destination type"
            description="What kind of places interest you?"
            options={DESTINATION_TYPES}
            selected={selections.destinationType}
            onChange={(v) => updateSelection("destinationType", v)}
            multiple
          />
          <div className="grid gap-6 sm:grid-cols-2">
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

        {/* More options accordion */}
        <div>
          <button
            type="button"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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

          {showMoreOptions && (
            <div className="mt-4 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
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
              <div className="grid gap-6 sm:grid-cols-2">
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
          )}
        </div>
      </div>
    </div>
  );
}
