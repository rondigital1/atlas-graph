import type { ChipOption, TripSelections } from "../types";

export const STEPS = [
  { id: "basics", label: "Basics" },
  { id: "preferences", label: "Preferences" },
  { id: "logistics", label: "Logistics" },
  { id: "generate", label: "Generate" },
] as const;

export const DESTINATION_TYPES: ChipOption[] = [
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

export const TRIP_TYPES: ChipOption[] = [
  { id: "solo", label: "Solo" },
  { id: "couple", label: "Couple" },
  { id: "friends", label: "Friends" },
  { id: "family", label: "Family" },
  { id: "business", label: "Business" },
];

export const PLANNING_MODES: ChipOption[] = [
  { id: "weekend", label: "Weekend" },
  { id: "1-week", label: "1 Week" },
  { id: "2-weeks", label: "2 Weeks" },
  { id: "3-weeks", label: "3+ Weeks" },
  { id: "multi-city", label: "Multi-City" },
];

export const BUDGET_LEVELS: ChipOption[] = [
  { id: "budget", label: "Budget" },
  { id: "moderate", label: "Moderate" },
  { id: "premium", label: "Premium" },
  { id: "luxury", label: "Luxury" },
];

export const TRAVEL_PACE: ChipOption[] = [
  { id: "relaxed", label: "Relaxed" },
  { id: "balanced", label: "Balanced" },
  { id: "fast-paced", label: "Fast-Paced" },
];

export const INTERESTS: ChipOption[] = [
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

export const FLIGHT_PREFERENCES: ChipOption[] = [
  { id: "shortest", label: "Shortest" },
  { id: "cheapest", label: "Cheapest" },
  { id: "best-overall", label: "Best Value" },
  { id: "premium-cabin", label: "Premium" },
];

export const ACCOMMODATION_TYPES: ChipOption[] = [
  { id: "hotel", label: "Hotel" },
  { id: "boutique", label: "Boutique" },
  { id: "airbnb", label: "Airbnb" },
  { id: "resort", label: "Resort" },
  { id: "hostel", label: "Hostel" },
];

export const CONSTRAINTS: ChipOption[] = [
  { id: "pet-friendly", label: "Pet Friendly" },
  { id: "walkable", label: "Walkable" },
  { id: "remote-work", label: "Remote Work" },
  { id: "kid-friendly", label: "Kid Friendly" },
  { id: "transit", label: "Public Transit" },
  { id: "visa-friendly", label: "Easy Visa" },
];

export interface Template {
  id: string;
  title: string;
  description: string;
  selections: Partial<TripSelections>;
  prompt?: string;
}

export const TEMPLATES: Template[] = [
  {
    id: "european-food",
    title: "Food & Culture",
    description: "European cities, local cuisine",
    selections: {
      destinationType: ["city", "foodie"],
      tripType: ["couple"],
      planningMode: ["1-week"],
      budget: ["moderate"],
      interests: ["food", "art", "architecture"],
    },
  },
  {
    id: "tropical-remote",
    title: "Remote Work",
    description: "Beach destinations, reliable wifi",
    selections: {
      destinationType: ["tropical", "beach"],
      tripType: ["solo"],
      planningMode: ["2-weeks"],
      budget: ["moderate"],
      constraints: ["remote-work", "walkable"],
      interests: ["beaches", "nature"],
    },
  },
  {
    id: "luxury-couples",
    title: "Luxury Escape",
    description: "Premium stays, romantic",
    selections: {
      destinationType: ["luxury", "romantic"],
      tripType: ["couple"],
      planningMode: ["1-week"],
      budget: ["luxury"],
      accommodation: ["resort", "boutique"],
      interests: ["food", "beaches"],
    },
  },
  {
    id: "adventure-nature",
    title: "Adventure",
    description: "Mountains, hiking, nature",
    selections: {
      destinationType: ["mountains", "adventure"],
      tripType: ["friends"],
      planningMode: ["1-week"],
      budget: ["moderate"],
      travelPace: ["fast-paced"],
      interests: ["hiking", "nature", "photography"],
    },
  },
  {
    id: "budget-explorer",
    title: "Budget Explorer",
    description: "Multi-city, hostels",
    selections: {
      destinationType: ["city"],
      tripType: ["solo"],
      planningMode: ["multi-city"],
      budget: ["budget"],
      accommodation: ["hostel"],
      travelPace: ["fast-paced"],
      flightPreference: ["cheapest"],
    },
  },
  {
    id: "family-summer",
    title: "Family Trip",
    description: "Kid-friendly, beaches",
    selections: {
      destinationType: ["beach", "family-friendly"],
      tripType: ["family"],
      planningMode: ["2-weeks"],
      budget: ["moderate"],
      constraints: ["kid-friendly", "walkable"],
      travelPace: ["relaxed"],
    },
  },
];

export const SURPRISE_SELECTIONS: TripSelections = {
  destinationType: ["city", "foodie"],
  tripType: ["couple"],
  planningMode: ["1-week"],
  budget: ["moderate"],
  flightPreference: ["best-overall"],
  accommodation: ["boutique"],
  travelPace: ["balanced"],
  interests: ["food", "art", "local"],
  constraints: ["walkable"],
};

export const SURPRISE_PROMPT =
  "Surprise me with a memorable trip focused on authentic local experiences and great food.";
