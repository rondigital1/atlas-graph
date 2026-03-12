import type {
  DestinationSummary,
  PlaceCandidate,
  TripRequest,
  WeatherSummary,
} from "@atlas-graph/core/types";

const MOCK_SOURCE = "mock";
const MAX_PLACE_RESULTS = 6;

interface MockPlaceRecord extends PlaceCandidate {
  tags: string[];
}

interface MockDestinationRecord {
  canonicalDestination: string;
  aliases: string[];
  destinationSummary: Omit<DestinationSummary, "destination">;
  weatherSummary: Omit<WeatherSummary, "destination">;
  places: MockPlaceRecord[];
}

interface ResolvedMockDestination {
  key: string;
  destination: string;
  record?: MockDestinationRecord;
}

const MOCK_DESTINATIONS: Record<string, MockDestinationRecord> = {
  paris: {
    canonicalDestination: "Paris",
    aliases: ["paris, france", "city of light"],
    destinationSummary: {
      country: "France",
      summary:
        "Paris blends major museums, cafe culture, and compact neighborhoods that are easy to combine into walkable days.",
      bestAreas: ["Le Marais", "Saint-Germain-des-Pres", "7th arrondissement"],
      notes: [
        "Metro access makes it easy to mix museums with neighborhood walking.",
        "Reserve flagship museums in advance if you want a tighter daily plan.",
      ],
    },
    weatherSummary: {
      summary:
        "Mock seasonal profile: expect mild days, cool evenings, and the occasional passing shower.",
      dailyNotes: [
        "A light jacket covers most morning and evening temperature swings.",
        "Comfortable walking shoes matter more than heavy layers.",
      ],
      averageHighC: 18,
      averageLowC: 10,
    },
    places: [
      {
        id: "paris-louvre",
        name: "Louvre Museum",
        category: "attraction",
        address: "Rue de Rivoli, 75001 Paris",
        rating: 4.8,
        priceLevel: 3,
        lat: 48.8606,
        lng: 2.3376,
        source: MOCK_SOURCE,
        summary: "Large-scale art museum anchored by classical highlights and major temporary shows.",
        tags: ["art", "culture", "history", "museum"],
      },
      {
        id: "paris-seine-cruise",
        name: "Seine Evening Cruise",
        category: "activity",
        rating: 4.6,
        priceLevel: 2,
        lat: 48.8584,
        lng: 2.2945,
        source: MOCK_SOURCE,
        summary: "A relaxed way to connect major landmarks after a full day of walking.",
        tags: ["sightseeing", "romance", "relaxed", "nightlife"],
      },
      {
        id: "paris-marais-bistro",
        name: "Marais Bistro Table",
        category: "restaurant",
        address: "24 Rue Vieille du Temple, 75004 Paris",
        rating: 4.5,
        priceLevel: 3,
        lat: 48.8579,
        lng: 2.3622,
        source: MOCK_SOURCE,
        summary: "Modern French small plates in a busy neighborhood dining corridor.",
        tags: ["food", "dining", "local", "nightlife"],
      },
      {
        id: "paris-left-bank-stay",
        name: "Left Bank Corner Hotel",
        category: "hotel",
        address: "8 Rue de l'Ancienne Comedie, 75006 Paris",
        rating: 4.4,
        priceLevel: 3,
        lat: 48.8535,
        lng: 2.3388,
        source: MOCK_SOURCE,
        summary: "Central boutique-style base with fast metro access and easy evening walks.",
        tags: ["hotel", "balanced", "walkable"],
      },
      {
        id: "paris-montmartre-walk",
        name: "Montmartre Hill Walk",
        category: "activity",
        lat: 48.8867,
        lng: 2.3431,
        source: MOCK_SOURCE,
        summary: "Self-guided route for cafe stops, city views, and smaller galleries.",
        tags: ["architecture", "culture", "walking", "photography"],
      },
      {
        id: "paris-orsay",
        name: "Musee d'Orsay",
        category: "attraction",
        address: "Esplanade Valery Giscard d'Estaing, 75007 Paris",
        rating: 4.7,
        priceLevel: 3,
        lat: 48.86,
        lng: 2.3266,
        source: MOCK_SOURCE,
        summary: "A strong Impressionist collection in a converted rail station.",
        tags: ["art", "museum", "culture"],
      },
    ],
  },
  tokyo: {
    canonicalDestination: "Tokyo",
    aliases: ["tokyo, japan"],
    destinationSummary: {
      country: "Japan",
      summary:
        "Tokyo offers dense neighborhood variety, excellent transit, and a strong mix of food, culture, and late-day activity.",
      bestAreas: ["Shibuya", "Asakusa", "Shinjuku"],
      notes: [
        "Train access is usually the fastest way to link neighborhoods.",
        "Neighborhoods shift character quickly, so grouping nearby stops keeps days efficient.",
      ],
    },
    weatherSummary: {
      summary:
        "Mock seasonal profile: generally mild spring conditions with crisp mornings and comfortable afternoons.",
      dailyNotes: [
        "Carry a light layer for evening temperature drops.",
        "Short rain showers are possible, but all-day heavy gear is usually unnecessary.",
      ],
      averageHighC: 19,
      averageLowC: 11,
    },
    places: [
      {
        id: "tokyo-sensoji",
        name: "Senso-ji Temple",
        category: "attraction",
        address: "2-3-1 Asakusa, Taito City, Tokyo",
        rating: 4.7,
        priceLevel: 1,
        lat: 35.7148,
        lng: 139.7967,
        source: MOCK_SOURCE,
        summary: "Historic temple complex with a market street and strong early-day atmosphere.",
        tags: ["culture", "history", "temple", "architecture"],
      },
      {
        id: "tokyo-shibuya-sky",
        name: "Shibuya Sky",
        category: "activity",
        address: "2-24-12 Shibuya, Shibuya City, Tokyo",
        rating: 4.6,
        priceLevel: 3,
        lat: 35.6595,
        lng: 139.7005,
        source: MOCK_SOURCE,
        summary: "Observation deck suited to sunset views and an energetic evening handoff.",
        tags: ["sightseeing", "nightlife", "photography"],
      },
      {
        id: "tokyo-tsukiji-breakfast",
        name: "Tsukiji Morning Counter",
        category: "restaurant",
        address: "4-10-5 Tsukiji, Chuo City, Tokyo",
        rating: 4.5,
        priceLevel: 2,
        lat: 35.6655,
        lng: 139.7708,
        source: MOCK_SOURCE,
        summary: "A seafood-forward breakfast stop near the former wholesale market area.",
        tags: ["food", "dining", "local"],
      },
      {
        id: "tokyo-park-hotel",
        name: "Shiodome Park Hotel",
        category: "hotel",
        address: "1-7-1 Higashi-Shimbashi, Minato City, Tokyo",
        rating: 4.4,
        priceLevel: 3,
        lat: 35.6644,
        lng: 139.7596,
        source: MOCK_SOURCE,
        summary: "Reliable central base for first-time city coverage across multiple train lines.",
        tags: ["hotel", "balanced", "transit"],
      },
      {
        id: "tokyo-meiji-shrine",
        name: "Meiji Shrine",
        category: "attraction",
        address: "1-1 Yoyogikamizonocho, Shibuya City, Tokyo",
        rating: 4.7,
        priceLevel: 1,
        lat: 35.6764,
        lng: 139.6993,
        source: MOCK_SOURCE,
        summary: "Wooded shrine grounds that give a quieter reset between busier districts.",
        tags: ["culture", "nature", "history"],
      },
      {
        id: "tokyo-izakaya-alley-tour",
        name: "Shinjuku Izakaya Alley Walk",
        category: "activity",
        lat: 35.6938,
        lng: 139.7034,
        source: MOCK_SOURCE,
        summary: "Compact evening route focused on casual dining, neon streets, and small bars.",
        tags: ["food", "nightlife", "local", "walking"],
      },
    ],
  },
  barcelona: {
    canonicalDestination: "Barcelona",
    aliases: ["barcelona, spain", "bcn"],
    destinationSummary: {
      country: "Spain",
      summary:
        "Barcelona is well suited to travelers who want architecture, neighborhood dining, and easy shifts between city blocks and the waterfront.",
      bestAreas: ["El Born", "Eixample", "Gracia"],
      notes: [
        "Major Gaudi sites benefit from timed entry reservations.",
        "Walking works well inside neighborhoods, with metro hops filling the longer gaps.",
      ],
    },
    weatherSummary: {
      summary:
        "Mock seasonal profile: warm daytime conditions, comfortable evenings, and low weather friction for walking.",
      dailyNotes: [
        "Sun protection is useful even when mornings start cool.",
        "A light overshirt is usually enough after sunset near the waterfront.",
      ],
      averageHighC: 22,
      averageLowC: 15,
    },
    places: [
      {
        id: "barcelona-sagrada-familia",
        name: "Sagrada Familia",
        category: "attraction",
        address: "Carrer de Mallorca, 401, 08013 Barcelona",
        rating: 4.8,
        priceLevel: 3,
        lat: 41.4036,
        lng: 2.1744,
        source: MOCK_SOURCE,
        summary: "Signature architecture stop with a strong payoff for advance booking.",
        tags: ["architecture", "culture", "history"],
      },
      {
        id: "barcelona-gothic-quarter-walk",
        name: "Gothic Quarter Walk",
        category: "activity",
        lat: 41.3839,
        lng: 2.1764,
        source: MOCK_SOURCE,
        summary: "Compact route through older streets, plazas, and church facades.",
        tags: ["walking", "history", "culture", "photography"],
      },
      {
        id: "barcelona-born-tapas",
        name: "Born Tapas House",
        category: "restaurant",
        address: "Carrer de la Princesa, 19, 08003 Barcelona",
        rating: 4.5,
        priceLevel: 2,
        lat: 41.3853,
        lng: 2.1816,
        source: MOCK_SOURCE,
        summary: "Lively small-plate stop that works well after museum or old-town blocks.",
        tags: ["food", "dining", "local", "nightlife"],
      },
      {
        id: "barcelona-eixample-stay",
        name: "Eixample Gallery Hotel",
        category: "hotel",
        address: "Carrer d'Arago, 256, 08007 Barcelona",
        rating: 4.4,
        priceLevel: 3,
        lat: 41.3914,
        lng: 2.1648,
        source: MOCK_SOURCE,
        summary: "Well-located mock stay between transit access, restaurants, and key sights.",
        tags: ["hotel", "balanced", "walkable"],
      },
      {
        id: "barcelona-barceloneta-cycle",
        name: "Barceloneta Waterfront Ride",
        category: "activity",
        lat: 41.3765,
        lng: 2.1924,
        source: MOCK_SOURCE,
        summary: "Easy shoreline outing for travelers who want a lighter active block.",
        tags: ["nature", "activity", "relaxed"],
      },
      {
        id: "barcelona-picasso-museum",
        name: "Picasso Museum",
        category: "attraction",
        address: "Carrer de Montcada, 15-23, 08003 Barcelona",
        rating: 4.4,
        priceLevel: 2,
        lat: 41.3853,
        lng: 2.181,
        source: MOCK_SOURCE,
        summary: "Strong museum option inside El Born with an easy add-on lunch window nearby.",
        tags: ["art", "museum", "culture"],
      },
    ],
  },
  "new-york": {
    canonicalDestination: "New York",
    aliases: ["new york city", "nyc", "new york, usa", "new york, united states"],
    destinationSummary: {
      country: "United States",
      summary:
        "New York works best when days are grouped by neighborhood, balancing major icons with shorter local food and park breaks.",
      bestAreas: ["Lower Manhattan", "Upper West Side", "Williamsburg"],
      notes: [
        "Subway transfers are efficient, but keeping each day borough-aware reduces backtracking.",
        "Advance tickets help for observatories, Broadway, and limited-entry museums.",
      ],
    },
    weatherSummary: {
      summary:
        "Mock seasonal profile: moderate temperatures, windier waterfront pockets, and cooler evenings than the daytime suggests.",
      dailyNotes: [
        "A mid-weight layer is useful once the sun drops.",
        "Expect comfortable walking conditions if you pace indoor and outdoor stops together.",
      ],
      averageHighC: 20,
      averageLowC: 11,
    },
    places: [
      {
        id: "nyc-central-park",
        name: "Central Park",
        category: "attraction",
        address: "New York, NY 10024",
        rating: 4.8,
        priceLevel: 1,
        lat: 40.7829,
        lng: -73.9654,
        source: MOCK_SOURCE,
        summary: "Flexible green-space anchor that pairs well with nearby museums or brunch.",
        tags: ["nature", "walking", "family", "photography"],
      },
      {
        id: "nyc-metropolitan-museum",
        name: "The Metropolitan Museum of Art",
        category: "attraction",
        address: "1000 5th Ave, New York, NY 10028",
        rating: 4.8,
        priceLevel: 3,
        lat: 40.7794,
        lng: -73.9632,
        source: MOCK_SOURCE,
        summary: "Large museum visit best paired with a focused wing or exhibition plan.",
        tags: ["art", "museum", "culture", "history"],
      },
      {
        id: "nyc-village-bistro",
        name: "Village Corner Bistro",
        category: "restaurant",
        address: "81 Bedford St, New York, NY 10014",
        rating: 4.5,
        priceLevel: 3,
        lat: 40.7322,
        lng: -74.0027,
        source: MOCK_SOURCE,
        summary: "Neighborhood dining option that fits well after downtown walking blocks.",
        tags: ["food", "dining", "local"],
      },
      {
        id: "nyc-midtown-stay",
        name: "Midtown Loft Hotel",
        category: "hotel",
        address: "44 W 37th St, New York, NY 10018",
        rating: 4.3,
        priceLevel: 3,
        lat: 40.7504,
        lng: -73.9857,
        source: MOCK_SOURCE,
        summary: "Transit-friendly mock stay that keeps multiple neighborhoods within easy reach.",
        tags: ["hotel", "balanced", "transit"],
      },
      {
        id: "nyc-brooklyn-bridge-walk",
        name: "Brooklyn Bridge Walk",
        category: "activity",
        lat: 40.7061,
        lng: -73.9969,
        source: MOCK_SOURCE,
        summary: "High-payoff skyline walk that works best in shoulder hours.",
        tags: ["walking", "photography", "sightseeing"],
      },
      {
        id: "nyc-broadway-evening",
        name: "Broadway Evening Show",
        category: "activity",
        lat: 40.759,
        lng: -73.9845,
        source: MOCK_SOURCE,
        summary: "Classic evening anchor for travelers who want a single fixed reservation block.",
        tags: ["nightlife", "culture", "entertainment"],
      },
    ],
  },
};

const DESTINATION_LOOKUP = new Map<string, MockDestinationRecord>();

for (const record of Object.values(MOCK_DESTINATIONS)) {
  DESTINATION_LOOKUP.set(normalizeLookupValue(record.canonicalDestination), record);

  for (const alias of record.aliases) {
    DESTINATION_LOOKUP.set(normalizeLookupValue(alias), record);
  }
}

function normalizeLookupValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyValue(value: string): string {
  const normalized = normalizeLookupValue(value);

  if (normalized.length === 0) {
    return "destination";
  }

  return normalized.replace(/\s+/g, "-");
}

function normalizeInterest(value: string): string {
  return normalizeLookupValue(value);
}

function resolveMockDestination(destination: string): ResolvedMockDestination {
  const normalizedDestination = normalizeLookupValue(destination);
  const record = DESTINATION_LOOKUP.get(normalizedDestination);

  if (record) {
    return {
      key: slugifyValue(record.canonicalDestination),
      destination: record.canonicalDestination,
      record,
    };
  }

  return {
    key: slugifyValue(destination),
    destination: destination.trim(),
  };
}

function stripPlaceTags(place: MockPlaceRecord): PlaceCandidate {
  const { tags: _tags, ...candidate } = place; // eslint-disable-line @typescript-eslint/no-unused-vars

  return candidate;
}

function hasInterestMatch(place: MockPlaceRecord, interests: Set<string>): boolean {
  if (interests.size === 0) {
    return false;
  }

  return place.tags.some((tag) => interests.has(tag));
}

function buildFallbackPlaceCandidates(
  destination: string,
  destinationKey: string
): PlaceCandidate[] {
  return [
    {
      id: `${destinationKey}-city-highlights-walk`,
      name: `${destination} City Highlights Walk`,
      category: "activity",
      source: MOCK_SOURCE,
      summary:
        "Deterministic mock walking route covering the most likely central sights and cafe stops.",
    },
    {
      id: `${destinationKey}-central-landmark`,
      name: `${destination} Central Landmark`,
      category: "attraction",
      source: MOCK_SOURCE,
      summary: "A generic headline sight used as a safe placeholder for local development.",
    },
    {
      id: `${destinationKey}-market-kitchen`,
      name: `${destination} Market Kitchen`,
      category: "restaurant",
      source: MOCK_SOURCE,
      summary: "Mock casual dining option with a balanced price point and flexible timing.",
    },
    {
      id: `${destinationKey}-city-stay`,
      name: `${destination} City Stay`,
      category: "hotel",
      source: MOCK_SOURCE,
      summary: "Mock centrally located stay used to exercise hotel-related planning flows.",
    },
  ];
}

export function buildMockDestinationSummary(input: TripRequest): DestinationSummary {
  const resolved = resolveMockDestination(input.destination);

  if (resolved.record) {
    return {
      destination: resolved.destination,
      ...resolved.record.destinationSummary,
    };
  }

  return {
    destination: resolved.destination,
    summary: `${resolved.destination} is using AtlasGraph's deterministic mock destination profile for local development.`,
    bestAreas: ["City Center", "Old Town"],
    notes: [
      "No destination-specific mock data exists yet, so a generic profile is being used.",
      "This fallback is stable and intended for local planning-service development only.",
    ],
  };
}

export function buildMockPlaceCandidates(input: TripRequest): PlaceCandidate[] {
  const resolved = resolveMockDestination(input.destination);

  if (!resolved.record) {
    return buildFallbackPlaceCandidates(resolved.destination, resolved.key);
  }

  const normalizedInterests = new Set(input.interests.map(normalizeInterest));
  const matchedPlaces = resolved.record.places.filter((place) =>
    hasInterestMatch(place, normalizedInterests)
  );
  const unmatchedPlaces = resolved.record.places.filter(
    (place) => !matchedPlaces.some((matchedPlace) => matchedPlace.id === place.id)
  );

  return [...matchedPlaces, ...unmatchedPlaces]
    .slice(0, MAX_PLACE_RESULTS)
    .map(stripPlaceTags);
}

export function buildMockWeatherSummary(input: TripRequest): WeatherSummary {
  const resolved = resolveMockDestination(input.destination);

  if (resolved.record) {
    return {
      destination: resolved.destination,
      ...resolved.record.weatherSummary,
    };
  }

  return {
    destination: resolved.destination,
    summary: `Mock seasonal profile for ${resolved.destination}: expect moderate conditions with a mix of clear periods and light weather variability.`,
    dailyNotes: [
      "Pack layers so the same plan works for cooler mornings and milder afternoons.",
      "This weather summary is deterministic mock data for local development.",
    ],
    averageHighC: 22,
    averageLowC: 14,
  };
}
