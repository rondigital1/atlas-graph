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
      budget: ["moderate"],
      constraints: ["kid-friendly", "walkable"],
      travelPace: ["relaxed"],
    },
  },
];

export const SURPRISE_SELECTIONS: TripSelections = {
  destinationType: ["city", "foodie"],
  tripType: ["couple"],
  budget: ["moderate"],
  flightPreference: ["best-overall"],
  accommodation: ["boutique"],
  travelPace: ["balanced"],
  interests: ["food", "art", "local"],
  constraints: ["walkable"],
};

export const SURPRISE_PROMPT =
  "Surprise me with a memorable trip focused on authentic local experiences and great food.";

// --- Surprise Me randomization ---

const SURPRISE_CITIES = [
  "Tokyo, Japan",
  "Lisbon, Portugal",
  "Buenos Aires, Argentina",
  "Cape Town, South Africa",
  "Kyoto, Japan",
  "Reykjavik, Iceland",
  "Bangkok, Thailand",
  "New York, USA",
  "Barcelona, Spain",
  "Havana, Cuba",
  "Sydney, Australia",
  "Prague, Czech Republic",
  "Mexico City, Mexico",
  "Santorini, Greece",
  "Nairobi, Kenya",
  "Vienna, Austria",
  "Seoul, South Korea",
  "Dubrovnik, Croatia",
  "Cartagena, Colombia",
  "Amsterdam, Netherlands",
  "Chiang Mai, Thailand",
  "Rio de Janeiro, Brazil",
];

const SURPRISE_PROMPTS = [
  "Surprise me with a memorable trip focused on authentic local experiences and great food.",
  "I want an unforgettable adventure exploring hidden gems and vibrant culture.",
  "Plan me a spontaneous getaway full of local flavors and surprising discoveries.",
  "Take me somewhere amazing — I'm open to anything memorable and unique.",
  "I want to explore like a local and discover things most tourists miss.",
];

function pickRandom<T>(arr: readonly T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

let lastSurpriseCity = "";

export function generateSurprise(): {
  destination: string;
  startDate: string;
  endDate: string;
  prompt: string;
  selections: TripSelections;
} {
  // Pick a city different from the last one
  let city = pickOne(SURPRISE_CITIES);
  while (city === lastSurpriseCity && SURPRISE_CITIES.length > 1) {
    city = pickOne(SURPRISE_CITIES);
  }
  lastSurpriseCity = city;

  // Random duration 3–14 days, starting ~30 days from now
  const duration = 3 + Math.floor(Math.random() * 12);
  const start = new Date();
  start.setDate(start.getDate() + 25 + Math.floor(Math.random() * 15));
  const end = new Date(start);
  end.setDate(end.getDate() + duration);

  const formatDate = (d: Date): string => d.toISOString().slice(0, 10);

  const destTypes = pickRandom(
    DESTINATION_TYPES.map((d) => d.id),
    2 + Math.floor(Math.random() * 2)
  );
  const interests = pickRandom(
    INTERESTS.map((i) => i.id),
    3 + Math.floor(Math.random() * 3)
  );

  return {
    destination: city,
    startDate: formatDate(start),
    endDate: formatDate(end),
    prompt: pickOne(SURPRISE_PROMPTS),
    selections: {
      destinationType: destTypes,
      tripType: [pickOne(TRIP_TYPES.map((t) => t.id))],
      budget: [pickOne(BUDGET_LEVELS.map((b) => b.id))],
      flightPreference: [pickOne(FLIGHT_PREFERENCES.map((f) => f.id))],
      accommodation: [pickOne(ACCOMMODATION_TYPES.map((a) => a.id))],
      travelPace: [pickOne(TRAVEL_PACE.map((p) => p.id))],
      interests,
      constraints: pickRandom(
        CONSTRAINTS.map((c) => c.id),
        Math.floor(Math.random() * 3)
      ),
    },
  };
}
