"use client";

import { useState } from "react";
import { StepIndicator } from "./step-indicator";
import { ChipSelector } from "./chip-selector";
import { PromptInput } from "./prompt-input";
import { AIPreviewPanel } from "./ai-preview-panel";
import { TemplateCards } from "./template-cards";

const STEPS = [
  { id: "basics", label: "Basics" },
  { id: "preferences", label: "Preferences" },
  { id: "logistics", label: "Logistics" },
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
];

const PLANNING_MODES = [
  { id: "weekend", label: "Weekend" },
  { id: "1-week", label: "1 Week" },
  { id: "2-weeks", label: "2 Weeks" },
  { id: "3-weeks", label: "3+ Weeks" },
  { id: "multi-city", label: "Multi-City" },
];

const BUDGET_LEVELS = [
  { id: "budget", label: "Budget" },
  { id: "moderate", label: "Moderate" },
  { id: "premium", label: "Premium" },
  { id: "luxury", label: "Luxury" },
];

const TRAVEL_PACE = [
  { id: "relaxed", label: "Relaxed" },
  { id: "balanced", label: "Balanced" },
  { id: "fast-paced", label: "Fast-Paced" },
];

const INTERESTS = [
  { id: "food", label: "Food & Dining" },
  { id: "art", label: "Art & Museums" },
  { id: "architecture", label: "Architecture" },
  { id: "hiking", label: "Hiking" },
  { id: "beaches", label: "Beaches" },
  { id: "shopping", label: "Shopping" },
  { id: "nightlife", label: "Nightlife" },
  { id: "local", label: "Local Culture" },
  { id: "nature", label: "Nature" },
  { id: "photography", label: "Photography" },
];

const FLIGHT_PREFERENCES = [
  { id: "shortest", label: "Shortest" },
  { id: "cheapest", label: "Cheapest" },
  { id: "best-overall", label: "Best Value" },
  { id: "premium-cabin", label: "Premium" },
];

const ACCOMMODATION_TYPES = [
  { id: "hotel", label: "Hotel" },
  { id: "boutique", label: "Boutique" },
  { id: "airbnb", label: "Airbnb" },
  { id: "resort", label: "Resort" },
  { id: "hostel", label: "Hostel" },
];

const CONSTRAINTS = [
  { id: "pet-friendly", label: "Pet Friendly" },
  { id: "walkable", label: "Walkable" },
  { id: "remote-work", label: "Remote Work" },
  { id: "kid-friendly", label: "Kid Friendly" },
  { id: "transit", label: "Public Transit" },
  { id: "visa-friendly", label: "Easy Visa" },
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
    const templates: Record<string, Partial<TripSelections>> = {
      "european-food": {
        destinationType: ["city", "foodie"],
        tripType: ["couple"],
        planningMode: ["1-week"],
        budget: ["moderate"],
        interests: ["food", "art", "architecture"],
      },
      "tropical-remote": {
        destinationType: ["tropical", "beach"],
        tripType: ["solo"],
        planningMode: ["2-weeks"],
        budget: ["moderate"],
        constraints: ["remote-work", "walkable"],
        interests: ["beaches", "nature"],
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
      setSelections((prev) => ({ ...prev, ...template }));
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentStep(3);
    }, 3000);
  };

  const handleSurprise = () => {
    setSelections({
      destinationType: ["city", "foodie"],
      tripType: ["couple"],
      planningMode: ["1-week"],
      budget: ["moderate"],
      flightPreference: ["best-overall"],
      accommodation: ["boutique"],
      travelPace: ["balanced"],
      interests: ["food", "art", "local"],
      constraints: ["walkable"],
    });
    setPrompt("Surprise me with a memorable trip focused on authentic local experiences and great food.");
  };

  const canSubmit = selections.destinationType.length > 0 || prompt.trim().length > 10;

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
              columns={6}
            />
            <div className="grid gap-8 lg:grid-cols-2">
              <ChipSelector
                label="Travelers"
                options={TRIP_TYPES}
                selected={selections.tripType}
                onChange={(v) => updateSelection("tripType", v)}
                columns={5}
              />
              <ChipSelector
                label="Duration"
                options={PLANNING_MODES}
                selected={selections.planningMode}
                onChange={(v) => updateSelection("planningMode", v)}
                columns={5}
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
                columns={4}
              />
              <ChipSelector
                label="Pace"
                description="How do you like to travel?"
                options={TRAVEL_PACE}
                selected={selections.travelPace}
                onChange={(v) => updateSelection("travelPace", v)}
                columns={3}
              />
            </div>
            <ChipSelector
              label="Interests"
              description="What activities do you enjoy?"
              options={INTERESTS}
              selected={selections.interests}
              onChange={(v) => updateSelection("interests", v)}
              multiple
              columns={5}
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
                columns={4}
              />
              <ChipSelector
                label="Accommodation"
                options={ACCOMMODATION_TYPES}
                selected={selections.accommodation}
                onChange={(v) => updateSelection("accommodation", v)}
                columns={5}
              />
            </div>
            <ChipSelector
              label="Requirements"
              description="Any specific needs?"
              options={CONSTRAINTS}
              selected={selections.constraints}
              onChange={(v) => updateSelection("constraints", v)}
              multiple
              columns={6}
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
        <div className="flex-1 rounded-xl border border-border bg-surface p-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
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
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </button>
          
          {currentStep < STEPS.length - 1 && (
            <button
              onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
              className="flex items-center gap-1.5 rounded-lg bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Continue
              <svg
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
        <div className="sticky top-14">
          <AIPreviewPanel selections={selections} prompt={prompt} currentStep={currentStep} />
        </div>
      </div>

      {/* AI Context Panel - Mobile */}
      <div className="fixed bottom-4 left-4 right-4 lg:hidden">
        <details className="group rounded-xl border border-border bg-surface shadow-lg">
          <summary className="flex cursor-pointer items-center justify-between p-3 [&::-webkit-details-marker]:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/15">
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
              <span className="text-sm font-medium text-foreground">Context</span>
            </div>
            <svg
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
            <AIPreviewPanel selections={selections} prompt={prompt} currentStep={currentStep} />
          </div>
        </details>
      </div>
    </div>
  );
}
