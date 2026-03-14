import type {
  Accommodation,
  DayItem,
  Experience,
  FlightOption,
  VersionHistoryItem,
} from "../types";

export const itineraryDays: DayItem[] = [
  {
    id: "1",
    day: 1,
    date: "Oct 15",
    city: "Barcelona",
    morning: "Arrive at BCN, transfer to Gothic Quarter hotel",
    afternoon: "Explore Las Ramblas and La Boqueria market",
    evening: "Sunset drinks at rooftop bar in El Born",
    dining: "Can Culleretes - traditional Catalan dinner",
    neighborhood: "Gothic Quarter",
    notes: "Check-in after 3pm. Pre-book dinner.",
    daySummary:
      "Arrive in Barcelona and settle into the historic Gothic Quarter. Ease into the city with a market stroll and rooftop sunset.",
    morningActivities: [
      {
        id: "1-m-1",
        name: "Airport Transfer to Gothic Quarter",
        description:
          "Private transfer from BCN El Prat to your hotel in the Gothic Quarter. Driver meets you at arrivals.",
        tags: ["Transfer"],
        duration: "45 min",
        activityType: "transit",
      },
    ],
    afternoonActivities: [
      {
        id: "1-a-1",
        name: "Las Ramblas Walk",
        description:
          "Stroll down Barcelona's iconic tree-lined boulevard from Placa Catalunya to the waterfront.",
        tags: ["Outdoor", "Free"],
        duration: "1 hour",
        activityType: "leisure",
      },
      {
        id: "1-a-2",
        name: "La Boqueria Market",
        description:
          "Explore the famous covered market bursting with fresh produce, tapas bars, and local delicacies.",
        tags: ["Must See", "Culinary"],
        duration: "1.5 hours",
        costRange: "$",
        activityType: "food",
      },
    ],
    eveningActivities: [
      {
        id: "1-e-1",
        name: "Rooftop Sunset Drinks",
        description:
          "Craft cocktails with panoramic views over Barcelona's skyline at a boutique hotel rooftop in El Born.",
        tags: ["Romantic", "Views"],
        duration: "1.5 hours",
        costRange: "$$",
        activityType: "leisure",
      },
      {
        id: "1-e-2",
        name: "Can Culleretes Dinner",
        description:
          "One of Barcelona's oldest restaurants, serving traditional Catalan cuisine since 1786.",
        tags: ["Historic", "Culinary"],
        duration: "2 hours",
        costRange: "$$",
        activityType: "food",
      },
    ],
  },
  {
    id: "2",
    day: 2,
    date: "Oct 16",
    city: "Barcelona",
    morning: "Sagrada Familia (timed entry 9am)",
    afternoon: "Park Guell exploration + Gracia neighborhood",
    evening: "Tapas crawl in El Born district",
    dining: "Cal Pep - fresh seafood tapas",
    neighborhood: "Eixample / El Born",
    daySummary:
      "A full day of Gaudi masterpieces — from the soaring Sagrada Familia to the whimsical mosaics of Park Guell, ending with a lively tapas crawl.",
    morningActivities: [
      {
        id: "2-m-1",
        name: "Sagrada Familia",
        description:
          "Skip-the-line timed entry at 9am to Gaudi's unfinished masterpiece. Tower access included.",
        tags: ["Must See", "Book Ahead"],
        duration: "2 hours",
        costRange: "$$$",
        activityType: "landmark",
        linkUrl: "https://sagradafamilia.org",
        linkLabel: "Book tickets",
      },
    ],
    afternoonActivities: [
      {
        id: "2-a-1",
        name: "Park Guell",
        description:
          "Explore Gaudi's colorful mosaic park with sweeping views over Barcelona. Monumental zone requires tickets.",
        tags: ["Scenic", "Outdoor"],
        duration: "1.5 hours",
        costRange: "$",
        activityType: "landmark",
      },
      {
        id: "2-a-2",
        name: "Gracia Neighborhood",
        description:
          "Wander the bohemian streets of Gracia — indie boutiques, plaza cafes, and local street art.",
        tags: ["Local Favorite", "Free"],
        duration: "1.5 hours",
        activityType: "leisure",
      },
    ],
    eveningActivities: [
      {
        id: "2-e-1",
        name: "El Born Tapas Crawl",
        description:
          "Hit 3-4 tapas bars across El Born district with local specialties at each stop.",
        tags: ["Culinary", "Nightlife"],
        duration: "3 hours",
        costRange: "$$",
        activityType: "food",
      },
    ],
  },
  {
    id: "3",
    day: 3,
    date: "Oct 17",
    city: "Barcelona",
    morning: "Picasso Museum + El Born Cultural Center",
    afternoon: "Beach time at Barceloneta",
    evening: "Flamenco show at Palau de la Musica",
    dining: "La Mar Salada - paella by the beach",
    neighborhood: "El Born / Barceloneta",
    daySummary:
      "Art, beach, and culture — from Picasso's early works to sun-soaked Barceloneta and an evening flamenco performance.",
    morningActivities: [
      {
        id: "3-m-1",
        name: "Picasso Museum",
        description:
          "Comprehensive collection of Picasso's formative years in five adjoining medieval palaces.",
        tags: ["Culture", "Must See"],
        duration: "2 hours",
        costRange: "$$",
        activityType: "culture",
      },
      {
        id: "3-m-2",
        name: "El Born Cultural Center",
        description:
          "Former market hall turned archaeological site revealing 18th-century Barcelona beneath glass floors.",
        tags: ["Historic", "Free"],
        duration: "45 min",
        activityType: "culture",
      },
    ],
    afternoonActivities: [
      {
        id: "3-a-1",
        name: "Barceloneta Beach",
        description:
          "Relax on Barcelona's most popular urban beach. Rent a sunbed or swim in the Mediterranean.",
        tags: ["Outdoor", "Relaxing"],
        duration: "3 hours",
        costRange: "$",
        activityType: "leisure",
      },
    ],
    eveningActivities: [
      {
        id: "3-e-1",
        name: "Flamenco at Palau de la Musica",
        description:
          "Intimate flamenco performance inside one of the world's most beautiful concert halls.",
        tags: ["Romantic", "Must See"],
        duration: "1.5 hours",
        costRange: "$$",
        activityType: "culture",
        linkUrl: "https://palaumusica.cat",
        linkLabel: "View showtimes",
      },
    ],
  },
  {
    id: "4",
    day: 4,
    date: "Oct 18",
    city: "Barcelona to Provence",
    isTransit: true,
    morning: "Early checkout, train to Avignon (4h15m)",
    afternoon: "Arrive Avignon, check into hotel",
    evening: "Evening stroll through old town",
    dining: "Le Vintage - casual French bistro",
    neighborhood: "Avignon Centre",
    notes: "TGV train departs 8:42am. Book first class.",
    daySummary:
      "Travel day — high-speed TGV from Barcelona to Avignon. Settle into your Provencal hotel and explore the medieval old town.",
    morningActivities: [
      {
        id: "4-m-1",
        name: "TGV Barcelona to Avignon",
        description:
          "High-speed train from Barcelona Sants to Avignon TGV. Book first class for extra legroom and quiet car.",
        tags: ["Transit", "Book Ahead"],
        duration: "4h 15m",
        costRange: "$$",
        activityType: "transit",
      },
    ],
    afternoonActivities: [
      {
        id: "4-a-1",
        name: "Check into La Mirande",
        description:
          "Arrive at your historic hotel steps from Palais des Papes. Take time to settle in and freshen up.",
        tags: ["Hotel"],
        duration: "1 hour",
        activityType: "leisure",
      },
    ],
    eveningActivities: [
      {
        id: "4-e-1",
        name: "Old Town Evening Stroll",
        description:
          "Walk the cobblestone streets of Avignon, past Place de l'Horloge and the famous half-bridge Pont d'Avignon.",
        tags: ["Free", "Scenic"],
        duration: "1.5 hours",
        activityType: "leisure",
      },
      {
        id: "4-e-2",
        name: "Dinner at Le Vintage",
        description:
          "Casual French bistro near Place des Corps Saints with seasonal Provencal dishes.",
        tags: ["Culinary"],
        duration: "1.5 hours",
        costRange: "$$",
        activityType: "food",
      },
    ],
  },
  {
    id: "5",
    day: 5,
    date: "Oct 19",
    city: "Provence",
    morning: "Day trip to Luberon villages",
    afternoon: "Gordes, Roussillon ochre trails",
    evening: "Return to Avignon",
    dining: "Picnic lunch from local markets",
    neighborhood: "Luberon Valley",
    notes: "Rent car for day trip recommended.",
    daySummary:
      "Full-day road trip through the stunning Luberon Valley — perched hilltop villages, ochre cliffs, and a rustic market picnic.",
    morningActivities: [
      {
        id: "5-m-1",
        name: "Drive to Luberon",
        description:
          "Pick up rental car and drive through lavender fields toward the first hilltop village.",
        tags: ["Scenic", "Road Trip"],
        duration: "1 hour",
        costRange: "$$",
        activityType: "transit",
      },
      {
        id: "5-m-2",
        name: "Gordes Village",
        description:
          "Explore one of France's most beautiful villages, perched dramatically on a rocky hillside.",
        tags: ["Must See", "Scenic"],
        duration: "1.5 hours",
        activityType: "landmark",
      },
    ],
    afternoonActivities: [
      {
        id: "5-a-1",
        name: "Roussillon Ochre Trails",
        description:
          "Hike through surreal ochre quarries with vivid red, orange, and yellow rock formations.",
        tags: ["Nature", "Outdoor"],
        duration: "2 hours",
        costRange: "$",
        activityType: "nature",
      },
      {
        id: "5-a-2",
        name: "Market Picnic",
        description:
          "Grab cheese, bread, charcuterie, and wine from a village market for a scenic hillside lunch.",
        tags: ["Budget-Friendly", "Local Favorite"],
        duration: "1 hour",
        costRange: "$",
        activityType: "food",
      },
    ],
    eveningActivities: [
      {
        id: "5-e-1",
        name: "Return to Avignon",
        description:
          "Scenic drive back to Avignon through the golden-hour countryside.",
        tags: ["Transit"],
        duration: "1 hour",
        activityType: "transit",
      },
    ],
  },
  {
    id: "6",
    day: 6,
    date: "Oct 20",
    city: "Provence",
    morning: "Pont du Gard Roman aqueduct",
    afternoon: "Wine tasting in Chateauneuf-du-Pape",
    evening: "Dinner in Avignon",
    dining: "La Mirande - fine dining experience",
    neighborhood: "Avignon / Chateauneuf",
    daySummary:
      "Roman engineering and world-class wine — visit the towering Pont du Gard aqueduct, then taste legendary Chateauneuf-du-Pape reds.",
    morningActivities: [
      {
        id: "6-m-1",
        name: "Pont du Gard",
        description:
          "Marvel at the 2,000-year-old Roman aqueduct bridge, one of the best-preserved in the world. Walk across the top tier.",
        tags: ["Must See", "Historic"],
        duration: "2.5 hours",
        costRange: "$",
        activityType: "landmark",
        linkUrl: "https://pontdugard.fr",
        linkLabel: "Learn more",
      },
    ],
    afternoonActivities: [
      {
        id: "6-a-1",
        name: "Chateauneuf-du-Pape Wine Tasting",
        description:
          "Private tasting at a family-run vineyard with cellar tour. Sample the region's iconic reds.",
        tags: ["Premium", "Local Favorite"],
        duration: "2.5 hours",
        costRange: "$$$",
        activityType: "food",
      },
    ],
    eveningActivities: [
      {
        id: "6-e-1",
        name: "Fine Dining at La Mirande",
        description:
          "Michelin-starred dinner in your hotel's acclaimed restaurant — multi-course Provencal tasting menu.",
        tags: ["Fine Dining", "Splurge"],
        duration: "2.5 hours",
        costRange: "$$$$",
        activityType: "food",
      },
    ],
  },
  {
    id: "7",
    day: 7,
    date: "Oct 21",
    city: "Provence to Nice",
    isTransit: true,
    morning: "Morning in Avignon, train to Nice (3h)",
    afternoon: "Arrive Nice, explore Vieux Nice",
    evening: "Promenade des Anglais sunset walk",
    dining: "Chez Pipo - authentic socca",
    neighborhood: "Old Nice",
    daySummary:
      "Train along the Mediterranean coast to Nice. Spend the afternoon exploring the colorful old town and catch a seaside sunset.",
    morningActivities: [
      {
        id: "7-m-1",
        name: "Train to Nice",
        description:
          "Scenic 3-hour TGV journey from Avignon to Nice Ville station, hugging the coast for the final stretch.",
        tags: ["Transit", "Scenic"],
        duration: "3 hours",
        costRange: "$$",
        activityType: "transit",
      },
    ],
    afternoonActivities: [
      {
        id: "7-a-1",
        name: "Vieux Nice Exploration",
        description:
          "Wander narrow alleys filled with Baroque churches, gelato shops, and hidden squares in Nice's old town.",
        tags: ["Free", "Culture"],
        duration: "2 hours",
        activityType: "leisure",
      },
    ],
    eveningActivities: [
      {
        id: "7-e-1",
        name: "Promenade des Anglais Sunset",
        description:
          "Walk along the iconic waterfront promenade as the sun sets over the Baie des Anges.",
        tags: ["Romantic", "Free"],
        duration: "1 hour",
        activityType: "leisure",
      },
      {
        id: "7-e-2",
        name: "Dinner at Chez Pipo",
        description:
          "Try authentic Nicoise socca (chickpea flatbread) at this beloved local institution since 1923.",
        tags: ["Local Favorite", "Budget-Friendly"],
        duration: "1 hour",
        costRange: "$",
        activityType: "food",
      },
    ],
  },
  {
    id: "8",
    day: 8,
    date: "Oct 22",
    city: "Nice",
    morning: "Cours Saleya market + Castle Hill",
    afternoon: "Day trip to Eze village",
    evening: "Dinner in Nice port area",
    dining: "Jan - modern Mediterranean",
    neighborhood: "Old Nice / Eze",
    daySummary:
      "Market morning and hilltop village — browse Cours Saleya's flowers and produce, then visit the medieval clifftop village of Eze.",
    morningActivities: [
      {
        id: "8-m-1",
        name: "Cours Saleya Market",
        description:
          "Nice's vibrant outdoor market with fresh flowers, produce, olives, and local specialties every morning.",
        tags: ["Local Favorite", "Culinary"],
        duration: "1.5 hours",
        costRange: "$",
        activityType: "food",
      },
      {
        id: "8-m-2",
        name: "Castle Hill Viewpoint",
        description:
          "Climb to the top of Colline du Chateau for panoramic views of Nice, the port, and the coastline.",
        tags: ["Views", "Free"],
        duration: "1 hour",
        activityType: "nature",
      },
    ],
    afternoonActivities: [
      {
        id: "8-a-1",
        name: "Eze Village",
        description:
          "Medieval hilltop village with exotic botanical gardens, artisan shops, and views down to the sea.",
        tags: ["Scenic", "Hidden Gem"],
        duration: "3 hours",
        costRange: "$",
        activityType: "landmark",
      },
    ],
    eveningActivities: [
      {
        id: "8-e-1",
        name: "Dinner at Jan",
        description:
          "Michelin-starred South African-French fusion in Nice's port district. Creative tasting menu.",
        tags: ["Fine Dining", "Unique"],
        duration: "2 hours",
        costRange: "$$$$",
        activityType: "food",
      },
    ],
  },
  {
    id: "9",
    day: 9,
    date: "Oct 23",
    city: "Nice",
    morning: "Matisse Museum + Cimiez gardens",
    afternoon: "Beach relaxation / optional Monaco trip",
    evening: "Final dinner in Old Nice",
    dining: "Olive et Artichaut - farm to table",
    neighborhood: "Cimiez / Beach",
    daySummary:
      "A relaxed final full day — art at the Matisse Museum, beach time or an optional Monaco excursion, and a farewell dinner.",
    morningActivities: [
      {
        id: "9-m-1",
        name: "Matisse Museum",
        description:
          "Beautiful collection of Matisse paintings, drawings, and cut-outs in a 17th-century Genoese villa.",
        tags: ["Culture", "Relaxing"],
        duration: "1.5 hours",
        costRange: "$",
        activityType: "culture",
      },
      {
        id: "9-m-2",
        name: "Cimiez Gardens",
        description:
          "Peaceful olive groves and Roman ruins surrounding the museum. Perfect morning stroll.",
        tags: ["Free", "Nature"],
        duration: "45 min",
        activityType: "nature",
      },
    ],
    afternoonActivities: [
      {
        id: "9-a-1",
        name: "Beach Relaxation",
        description:
          "Soak up the sun on a private or public beach along the Promenade des Anglais.",
        tags: ["Relaxing", "Outdoor"],
        duration: "2-3 hours",
        costRange: "$",
        activityType: "leisure",
      },
      {
        id: "9-a-2",
        name: "Monaco Day Trip (Optional)",
        description:
          "Take the coastal train to Monte Carlo — see the casino, oceanographic museum, and prince's palace.",
        tags: ["Luxurious", "Popular"],
        duration: "Half day",
        costRange: "$$",
        activityType: "landmark",
      },
    ],
    eveningActivities: [
      {
        id: "9-e-1",
        name: "Farewell Dinner at Olive et Artichaut",
        description:
          "Farm-to-table Nicoise cuisine in a cozy Old Nice setting. The perfect last supper.",
        tags: ["Culinary", "Local Favorite"],
        duration: "2 hours",
        costRange: "$$",
        activityType: "food",
      },
    ],
  },
  {
    id: "10",
    day: 10,
    date: "Oct 24",
    city: "Departure",
    isTransit: true,
    morning: "Leisurely breakfast, pack",
    afternoon: "Transfer to Nice airport (NCE)",
    evening: "Flight home",
    neighborhood: "Nice Airport",
    notes: "Flight departs 4:30pm. Arrive airport by 2pm.",
    daySummary:
      "Departure day — enjoy a leisurely final breakfast, then transfer to Nice airport for your flight home.",
    morningActivities: [
      {
        id: "10-m-1",
        name: "Leisurely Breakfast",
        description:
          "Final croissants and cafe au lait at your hotel or a favorite cafe before packing up.",
        tags: ["Relaxing"],
        duration: "1.5 hours",
        activityType: "leisure",
      },
    ],
    afternoonActivities: [
      {
        id: "10-a-1",
        name: "Airport Transfer",
        description:
          "Private transfer or tram to Nice Cote d'Azur airport (NCE). Allow 2 hours before departure.",
        tags: ["Transit"],
        duration: "30 min",
        activityType: "transit",
      },
    ],
    eveningActivities: [
      {
        id: "10-e-1",
        name: "Flight Home",
        description: "Depart Nice for your return journey.",
        tags: ["Transit"],
        duration: "10+ hours",
        activityType: "transit",
      },
    ],
  },
];

export const outboundFlights: FlightOption[] = [
  {
    id: "out-1",
    airline: "Iberia",
    departure: "JFK 7:15pm",
    arrival: "BCN 8:45am+1",
    duration: "7h 30m",
    layovers: 0,
    price: 645,
    cabinClass: "Economy Plus",
    comfortScore: 4.2,
    isRecommended: true,
    reason: "Best balance of price, timing, and comfort",
  },
  {
    id: "out-2",
    airline: "Delta / Air France",
    departure: "JFK 5:30pm",
    arrival: "BCN 11:15am+1",
    duration: "11h 45m",
    layovers: 1,
    layoverCities: ["Paris CDG"],
    price: 520,
    cabinClass: "Economy",
    comfortScore: 3.5,
    reason: "Lowest price option",
  },
  {
    id: "out-3",
    airline: "British Airways",
    departure: "JFK 9:00pm",
    arrival: "BCN 2:30pm+1",
    duration: "11h 30m",
    layovers: 1,
    layoverCities: ["London LHR"],
    price: 890,
    cabinClass: "Premium Economy",
    comfortScore: 4.6,
    reason: "Most comfortable option",
  },
  {
    id: "out-4",
    airline: "Lufthansa",
    departure: "JFK 6:00pm",
    arrival: "BCN 10:30am+1",
    duration: "10h 30m",
    layovers: 1,
    layoverCities: ["Frankfurt"],
    price: 0,
    cabinClass: "Economy",
    comfortScore: 0,
    status: "checking",
  },
];

export const returnFlights: FlightOption[] = [
  {
    id: "ret-1",
    airline: "Air France",
    departure: "NCE 12:30pm",
    arrival: "JFK 4:45pm",
    duration: "10h 15m",
    layovers: 1,
    layoverCities: ["Paris CDG"],
    price: 580,
    cabinClass: "Economy Plus",
    comfortScore: 4.0,
    isRecommended: true,
    reason: "Good timing for last day exploration",
  },
  {
    id: "ret-2",
    airline: "Swiss",
    departure: "NCE 6:45am",
    arrival: "JFK 12:10pm",
    duration: "11h 25m",
    layovers: 1,
    layoverCities: ["Zurich"],
    price: 495,
    cabinClass: "Economy",
    comfortScore: 3.8,
    reason: "Arrives early, lowest price",
  },
];

export const accommodations: Accommodation[] = [
  {
    id: "bcn",
    city: "Barcelona",
    dates: "Oct 15-18",
    nights: 3,
    name: "Hotel Neri",
    type: "Boutique Hotel",
    neighborhood: "Gothic Quarter",
    pricePerNight: 285,
    rating: 4.7,
    vibe: ["Historic", "Central", "Romantic"],
    features: ["Rooftop terrace", "Walking distance to sites", "24h concierge"],
    reason:
      "Perfect Gothic Quarter location with authentic character. Easy access to La Rambla and Born district.",
    isRecommended: true,
  },
  {
    id: "avignon",
    city: "Avignon",
    dates: "Oct 18-21",
    nights: 3,
    name: "La Mirande",
    type: "Historic Hotel",
    neighborhood: "Old Town",
    pricePerNight: 320,
    rating: 4.8,
    vibe: ["Elegant", "Peaceful", "Luxurious"],
    features: ["Michelin restaurant", "Garden courtyard", "Spa access"],
    reason:
      "Historic palace hotel steps from Palais des Papes. Ideal base for Provence exploration.",
    isRecommended: true,
  },
  {
    id: "nice",
    city: "Nice",
    dates: "Oct 21-24",
    nights: 3,
    name: "Hotel La Perouse",
    type: "Seaside Hotel",
    neighborhood: "Old Nice",
    pricePerNight: 245,
    rating: 4.5,
    vibe: ["Sea views", "Quiet", "Classic"],
    features: ["Pool", "Beach access", "Breakfast included"],
    reason:
      "Tucked into the cliff below Castle Hill with stunning sea views. Walking distance to Old Nice.",
    isRecommended: true,
  },
];

export const experiences: Experience[] = [
  {
    id: "1",
    name: "La Boqueria Culinary Walk",
    category: "food",
    city: "Barcelona",
    description: "Guided tasting tour through the iconic market with local chef",
    idealTime: "Day 1, Morning",
    vibe: ["Local favorite", "Culinary"],
    bookingUrgency: "high",
    priceRange: "$$",
  },
  {
    id: "2",
    name: "Sagrada Familia Guided Tour",
    category: "culture",
    city: "Barcelona",
    description: "Skip-the-line entry with architecture expert guide",
    idealTime: "Day 2, 9am",
    vibe: ["Popular", "Must-see"],
    bookingUrgency: "high",
    priceRange: "$$$",
  },
  {
    id: "3",
    name: "Flamenco at Palau de la Musica",
    category: "culture",
    city: "Barcelona",
    description: "Intimate flamenco performance in stunning modernist hall",
    idealTime: "Day 3, Evening",
    vibe: ["Romantic", "Authentic"],
    bookingUrgency: "medium",
    priceRange: "$$",
  },
  {
    id: "4",
    name: "Luberon Villages by Car",
    category: "nature",
    city: "Provence",
    description: "Self-drive through lavender fields and hilltop villages",
    idealTime: "Day 5, Full day",
    vibe: ["Scenic", "Relaxing"],
    priceRange: "$$",
  },
  {
    id: "5",
    name: "Chateauneuf-du-Pape Wine Tasting",
    category: "food",
    city: "Provence",
    description: "Private tasting at family-run vineyard with cellar tour",
    idealTime: "Day 6, Afternoon",
    vibe: ["Local favorite", "Premium"],
    bookingUrgency: "medium",
    priceRange: "$$$",
  },
  {
    id: "6",
    name: "Eze Village & Perfumery Visit",
    category: "culture",
    city: "Nice",
    description: "Medieval village exploration plus Fragonard factory tour",
    idealTime: "Day 8, Afternoon",
    vibe: ["Scenic", "Hidden gem"],
    priceRange: "$",
  },
  {
    id: "7",
    name: "Cours Saleya Market Morning",
    category: "food",
    city: "Nice",
    description: "Browse flowers, produce, and local specialties",
    idealTime: "Day 8, Morning",
    vibe: ["Local favorite", "Free"],
    priceRange: "$",
  },
  {
    id: "8",
    name: "Monaco Day Trip",
    category: "nature",
    city: "Nice",
    description: "Optional half-day to Monte Carlo and oceanographic museum",
    idealTime: "Day 9, Afternoon",
    vibe: ["Luxurious", "Popular"],
    priceRange: "$$",
  },
];

export const versionHistory: VersionHistoryItem[] = [
  {
    id: "v3",
    label: "Current",
    timestamp: "2 min ago",
    changes: "Added wine tasting, optimized hotel selection",
    isActive: true,
  },
  {
    id: "v2",
    label: "Revised",
    timestamp: "15 min ago",
    changes: "Adjusted pace, reduced early flights",
  },
  {
    id: "v1",
    label: "Initial",
    timestamp: "1 hour ago",
    changes: "First generation from preferences",
  },
];
