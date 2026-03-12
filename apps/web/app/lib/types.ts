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
