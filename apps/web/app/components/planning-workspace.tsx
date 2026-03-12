"use client";

import { useState } from "react";
import { StepIndicator } from "./step-indicator";
import { ChipSelector } from "./chip-selector";
import { PromptInput } from "./prompt-input";
import { AIPreviewPanel } from "./ai-preview-panel";
import { TemplateCards } from "./template-cards";

const STEPS = [
  { id: "basics", label: "Trip Basics" },
  { id: "preferences", label: "Preferences" },
  { id: "travel", label: "Flights & Stay" },
  { id: "experiences", label: "Experiences" },
  { id: "generate", label: "Generate" },
];

const DESTINATION_TYPES = [
  { id: "beach", label: "Beach" },
  { id: "city", label: "City" },
  { id: "mountains", label: "Mountains" },
  { id: "countryside", label: "Countryside" },
  { id: "tropical", label: "Tropical" },
  { id: "luxury", label: "Luxury" },
  { id: "adventure", label: "Adventure" },
  { id: "foodie", label: "Foodie" },
  { id: "nightlife", label: "Nightlife" },
  { id: "romantic", label: "Romantic" },
  { id: "family-friendly", label: "Family" },
  { id: "wellness", label: "Wellness" },
];

const TRIP_TYPES = [
  { id: "solo", label: "Solo" },
  { id: "couple", label: "Couple" },
  { id: "friends", label: "Friends" },
  { id: "family", label: "Family" },
  { id: "business", label: "Business" },
  { id: "remote-work", label: "Remote Work" },
];

const PLANNING_MODES = [
  { id: "weekend", label: "Weekend" },
  { id: "1-week", label: "1 Week" },
  { id: "2-weeks", label: "2 Weeks" },
  { id: "custom", label: "Custom" },
  { id: "multi-city", label: "Multi-City" },
];

const BUDGET_LEVELS = [
  { id: "budget", label: "Budget" },
  { id: "moderate", label: "Moderate" },
  { id: "premium", label: "Premium" },
  { id: "luxury", label: "Luxury" },
];

const FLIGHT_PREFERENCES = [
  { id: "shortest", label: "Shortest" },
  { id: "cheapest", label: "Cheapest" },
  { id: "best-overall", label: "Best Overall" },
  { id: "premium-cabin", label: "Premium Cabin" },
  { id: "flexible", label: "Flexible" },
];

const ACCOMMODATION_TYPES = [
  { id: "hotel", label: "Hotel" },
  { id: "boutique", label: "Boutique" },
  { id: "airbnb", label: "Airbnb" },
  { id: "resort", label: "Resort" },
  { id: "hostel", label: "Hostel" },
  { id: "mixed", label: "Mixed" },
];

const TRAVEL_PACE = [
  { id: "relaxed", label: "Relaxed" },
  { id: "balanced", label: "Balanced" },
  { id: "fast-paced", label: "Fast-Paced" },
];

const INTERESTS = [
  { id: "food", label: "Food" },
  { id: "art", label: "Art" },
  { id: "architecture", label: "Architecture" },
  { id: "hiking", label: "Hiking" },
  { id: "beaches", label: "Beaches" },
  { id: "shopping", label: "Shopping" },
  { id: "museums", label: "Museums" },
  { id: "cafes", label: "Cafes" },
  { id: "nightlife", label: "Nightlife" },
  { id: "local", label: "Local Experiences" },
  { id: "nature", label: "Nature" },
  { id: "photography", label: "Photography" },
];

const CONSTRAINTS = [
  { id: "pet-friendly", label: "Pet Friendly" },
  { id: "walkable", label: "Walkable" },
  { id: "remote-work", label: "Remote Work Ready" },
  { id: "kid-friendly", label: "Kid Friendly" },
  { id: "quiet", label: "Quiet Area" },
  { id: "transit", label: "Public Transit" },
  { id: "visa-friendly", label: "Visa Friendly" },
  { id: "low-transfers", label: "Low Transfers" },
];

export interface TripSelections {
  destinationType: string[];
  tripType: string[];
  planningMode: string[];
  budget: string[];
  flightPreference: string[];
  accommodation: string[];
  travelPace: string[];
  interests: string[];
  constraints: string[];
}

export function PlanningWorkspace() {
  const [currentStep, setCurrentStep] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selections, setSelections] = useState<TripSelections>({
    destinationType: [],
    tripType: [],
    planningMode: [],
    budget: [],
    flightPreference: [],
    accommodation: [],
    travelPace: [],
    interests: [],
    constraints: [],
  });

  const updateSelection = (key: keyof TripSelections, value: string[]) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
  };

  const handleTemplateSelect = (templateId: string) => {
    // Pre-fill based on template
    const templates: Record<string, Partial<TripSelections>> = {
      "european-food": {
        destinationType: ["city", "foodie"],
        tripType: ["couple"],
        planningMode: ["1-week"],
        budget: ["moderate"],
        interests: ["food", "art", "architecture", "cafes"],
      },
      "tropical-remote": {
        destinationType: ["tropical", "beach"],
        tripType: ["remote-work"],
        planningMode: ["2-weeks"],
        budget: ["moderate"],
        constraints: ["remote-work", "walkable"],
        interests: ["beaches", "cafes", "nature"],
      },
      "luxury-couples": {
        destinationType: ["luxury", "romantic"],
        tripType: ["couple"],
        planningMode: ["1-week"],
        budget: ["luxury"],
        accommodation: ["resort", "boutique"],
        interests: ["food", "beaches"],
      },
      "adventure-nature": {
        destinationType: ["mountains", "adventure"],
        tripType: ["friends"],
        planningMode: ["1-week"],
        budget: ["moderate"],
        travelPace: ["fast-paced"],
        interests: ["hiking", "nature", "photography"],
      },
      "budget-explorer": {
        destinationType: ["city"],
        tripType: ["solo"],
        planningMode: ["multi-city"],
        budget: ["budget"],
        accommodation: ["hostel"],
        travelPace: ["fast-paced"],
        flightPreference: ["cheapest"],
      },
      "family-summer": {
        destinationType: ["beach", "family-friendly"],
        tripType: ["family"],
        planningMode: ["2-weeks"],
        budget: ["moderate"],
        constraints: ["kid-friendly", "walkable"],
        travelPace: ["relaxed"],
      },
    };

    const template = templates[templateId];
    if (template) {
      setSelections((prev) => ({
        ...prev,
        ...template,
      }));
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentStep(4); // Move to generate step
    }, 3000);
  };

  const handleSurprise = () => {
    // Randomly fill selections
    setSelections({
      destinationType: ["city", "foodie"],
      tripType: ["couple"],
      planningMode: ["1-week"],
      budget: ["moderate"],
      flightPreference: ["best-overall"],
      accommodation: ["boutique"],
      travelPace: ["balanced"],
      interests: ["food", "art", "local", "cafes"],
      constraints: ["walkable"],
    });
    setPrompt(
      "Surprise me with a memorable trip focused on authentic local experiences, great food, and beautiful neighborhoods to explore on foot."
    );
  };

  const canSubmit =
    selections.destinationType.length > 0 || prompt.trim().length > 10;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <ChipSelector
              label="What kind of destination?"
              options={DESTINATION_TYPES}
              selected={selections.destinationType}
              onChange={(v) => updateSelection("destinationType", v)}
              multiple
              columns={4}
            />
            <ChipSelector
              label="Who's traveling?"
              options={TRIP_TYPES}
              selected={selections.tripType}
              onChange={(v) => updateSelection("tripType", v)}
              columns={6}
            />
            <ChipSelector
              label="Trip duration"
              options={PLANNING_MODES}
              selected={selections.planningMode}
              onChange={(v) => updateSelection("planningMode", v)}
              columns={5}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-8">
            <ChipSelector
              label="Budget level"
              options={BUDGET_LEVELS}
              selected={selections.budget}
              onChange={(v) => updateSelection("budget", v)}
              columns={4}
            />
            <ChipSelector
              label="Travel pace"
              options={TRAVEL_PACE}
              selected={selections.travelPace}
              onChange={(v) => updateSelection("travelPace", v)}
              columns={3}
            />
            <ChipSelector
              label="What are you into?"
              options={INTERESTS}
              selected={selections.interests}
              onChange={(v) => updateSelection("interests", v)}
              multiple
              columns={4}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <ChipSelector
              label="Flight preference"
              options={FLIGHT_PREFERENCES}
              selected={selections.flightPreference}
              onChange={(v) => updateSelection("flightPreference", v)}
              columns={5}
            />
            <ChipSelector
              label="Where to stay"
              options={ACCOMMODATION_TYPES}
              selected={selections.accommodation}
              onChange={(v) => updateSelection("accommodation", v)}
              columns={6}
            />
            <ChipSelector
              label="Trip constraints"
              options={CONSTRAINTS}
              selected={selections.constraints}
              onChange={(v) => updateSelection("constraints", v)}
              multiple
              columns={4}
            />
          </div>
        );
      case 3:
      case 4:
        return (
          <div className="space-y-8">
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

  return (
    <div className="flex flex-1 flex-col gap-6 lg:flex-row">
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

        {/* Step Content */}
        <div className="flex-1 rounded-xl border border-border bg-card p-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Previous
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>
          <button
            onClick={() =>
              setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))
            }
            disabled={currentStep === STEPS.length - 1}
            className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <svg
              width="16"
              height="16"
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
        </div>
      </div>

      {/* AI Preview Panel - Desktop */}
      <div className="hidden w-80 shrink-0 lg:block xl:w-96">
        <AIPreviewPanel selections={selections} prompt={prompt} />
      </div>

      {/* AI Preview Panel - Mobile */}
      <div className="lg:hidden">
        <details className="group rounded-xl border border-border bg-card">
          <summary className="flex cursor-pointer items-center justify-between p-4">
            <span className="text-sm font-semibold text-foreground">
              AI Plan Preview
            </span>
            <svg
              width="16"
              height="16"
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
          <div className="border-t border-border-subtle">
            <AIPreviewPanel selections={selections} prompt={prompt} />
          </div>
        </details>
      </div>
    </div>
  );
}
