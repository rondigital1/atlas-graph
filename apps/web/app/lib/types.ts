// Shared UI domain types for the AtlasGraph frontend.
// All inline interfaces from components should be imported from here.

export interface ChipOption {
  id: string;
  label: string;
}

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

// Results page types

export interface DayItem {
  id: string;
  day: number;
  date: string;
  city: string;
  isTransit?: boolean;
  morning?: string;
  afternoon?: string;
  evening?: string;
  dining?: string;
  neighborhood?: string;
  notes?: string;
}

export interface FlightOption {
  id: string;
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  layovers: number;
  layoverCities?: string[];
  price: number;
  cabinClass: string;
  comfortScore: number;
  isRecommended?: boolean;
  reason?: string;
  status?: "available" | "checking" | "unavailable";
}

export interface Accommodation {
  id: string;
  city: string;
  dates: string;
  nights: number;
  name: string;
  type: string;
  neighborhood: string;
  pricePerNight: number;
  rating: number;
  vibe: string[];
  features: string[];
  reason: string;
  isRecommended?: boolean;
}

export interface Experience {
  id: string;
  name: string;
  category: string;
  city: string;
  description: string;
  idealTime: string;
  vibe: string[];
  bookingUrgency?: "high" | "medium" | "low";
  priceRange?: string;
}

export interface VersionHistoryItem {
  id: string;
  label: string;
  timestamp: string;
  changes: string;
  isActive?: boolean;
}

export type StatusTone = "neutral" | "success" | "warning" | "danger";

export interface RecentRunItemViewModel {
  href: string;
  id: string;
  meta: string;
  statusLabel: string;
  statusTone: StatusTone;
  subtitle: string;
  title: string;
}

export interface RecentRunsPanelViewModel {
  items: RecentRunItemViewModel[];
  state: "empty" | "ready" | "unavailable";
}

export interface PlansListItemViewModel {
  id: string;
  href: string;
  destination: string;
  tripDates: string;
  statusLabel: string;
  statusTone: StatusTone;
  budget: string | null;
  travelStyle: string | null;
  groupType: string | null;
  createdAt: string;
}

export interface PlansListViewModel {
  items: PlansListItemViewModel[];
  state: "empty" | "ready" | "error";
}

export interface VersionListItemViewModel {
  id: string;
  versionNumber: number;
  label: string;
  generatedAt: string;
  isCurrent: boolean;
  statusLabel: string;
  statusTone: StatusTone;
}

export interface VersionListViewModel {
  items: VersionListItemViewModel[];
  state: "single" | "multi" | "empty";
  activeVersionId: string;
}

export type RegenerationAvailability = "available" | "unavailable" | "in-progress";

export interface RegenerationTriggerViewModel {
  availability: RegenerationAvailability;
  unavailableReason?: string;
  planId: string;
}

export type RunInspectorTabId = "errors" | "input" | "output" | "toolData";

export interface RunInspectorHeaderViewModel {
  budget: string | null;
  completedAt: string | null;
  createdAt: string;
  defaultTab: RunInspectorTabId;
  destination: string;
  duration: string | null;
  groupType: string | null;
  id: string;
  modelName: string | null;
  promptVersion: string | null;
  requestId: string;
  startedAt: string | null;
  statusLabel: string;
  statusTone: StatusTone;
  travelStyle: string | null;
  tripDates: string;
}

export interface RunInspectorInputViewModel {
  isLegacyPayload: boolean;
  normalizedPayload: unknown | null;
  recordedAt: string | null;
  submittedPayload: unknown | null;
}

export interface RunInspectorToolResultViewModel {
  createdAt: string;
  id: string;
  latency: string | null;
  payload: unknown;
  provider: string | null;
  sequenceLabel: string;
  statusLabel: string;
  statusTone: StatusTone;
  title: string;
  toolCategory: string | null;
}

export interface RunInspectorOutputViewModel {
  createdAt: string;
  outputFormat: string | null;
  payload: unknown;
}

export interface RunInspectorErrorViewModel {
  createdAt: string;
  details: unknown | null;
  errorType: string | null;
  id: string;
  message: string;
  stepName: string | null;
}

export interface RunInspectorViewModel {
  errors: RunInspectorErrorViewModel[];
  header: RunInspectorHeaderViewModel;
  input: RunInspectorInputViewModel;
  output: RunInspectorOutputViewModel | null;
  toolResults: RunInspectorToolResultViewModel[];
}

// Plan detail view model types

export interface PlanOverviewViewModel {
  destination: string;
  tripStyleSummary: string;
  dates: string;
  budget: string | null;
  statusLabel: string;
  statusTone: StatusTone;
  practicalNotes: string[];
  warnings: string[];
  rationale: string;
}

export interface PlanActivityViewModel {
  title: string;
  description: string;
}

export interface PlanDayViewModel {
  id: string;
  dayNumber: number;
  date: string;
  theme: string;
  morning: PlanActivityViewModel[];
  afternoon: PlanActivityViewModel[];
  evening: PlanActivityViewModel[];
}

export interface PlanRecommendationViewModel {
  name: string;
  reason: string;
}

export interface PlanDetailViewModel {
  overview: PlanOverviewViewModel;
  days: PlanDayViewModel[];
  topRecommendations: PlanRecommendationViewModel[];
}
