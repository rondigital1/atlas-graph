import type { Continent, ExploreItinerary } from "../types";

export interface ContinentOption {
  id: Continent;
  label: string;
  backgroundUrl: string;
}

export const continents: ContinentOption[] = [
  {
    id: "all",
    label: "All",
    backgroundUrl: "",
  },
  {
    id: "europe",
    label: "Europe",
    // Santorini blue domes
    backgroundUrl:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=80",
  },
  {
    id: "asia",
    label: "Asia",
    // Angkor Wat sunrise
    backgroundUrl:
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80",
  },
  {
    id: "africa",
    label: "Africa",
    // Serengeti savanna with acacia tree
    backgroundUrl:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&q=80",
  },
  {
    id: "north-america",
    label: "North America",
    // Grand Canyon
    backgroundUrl:
      "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=1920&q=80",
  },
  {
    id: "south-america",
    label: "South America",
    // Machu Picchu
    backgroundUrl:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1920&q=80",
  },
  {
    id: "oceania",
    label: "Oceania",
    // Great Barrier Reef aerial
    backgroundUrl:
      "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1920&q=80",
  },
];

export const exploreItineraries: ExploreItinerary[] = [
  // Asia
  {
    id: "tokyo-kyoto-10d",
    title: "Tokyo to Kyoto: Temples, Tech & Street Food",
    destination: "Japan",
    continent: "asia",
    imageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    duration: "10 days",
    budget: "Mid-range",
    description:
      "From the neon-lit streets of Shinjuku to the serene bamboo groves of Arashiyama. Bullet trains, hidden izakayas, and ancient shrines.",
    tags: ["Culture", "Food", "City"],
  },
  {
    id: "bali-ubud-12d",
    title: "Bali: Beaches, Rice Terraces & Wellness",
    destination: "Indonesia",
    continent: "asia",
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    duration: "12 days",
    budget: "Budget",
    description:
      "Surf in Canggu, hike through Tegallalang rice terraces, and find your zen at an Ubud wellness retreat.",
    tags: ["Beach", "Nature", "Wellness"],
  },
  {
    id: "vietnam-14d",
    title: "Vietnam: Hanoi to Ho Chi Minh by Rail",
    destination: "Vietnam",
    continent: "asia",
    imageUrl:
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
    duration: "14 days",
    budget: "Budget",
    description:
      "Ride the Reunification Express through emerald karsts, ancient towns, and bustling cities. Pho for breakfast, every day.",
    tags: ["Culture", "Food", "Adventure"],
  },

  // Europe
  {
    id: "barcelona-provence-8d",
    title: "Barcelona & Provence: Mediterranean Soul",
    destination: "Spain & France",
    continent: "europe",
    imageUrl:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    duration: "8 days",
    budget: "Mid-range",
    description:
      "Gaudí's mosaics, tapas crawls through El Born, then lavender fields and rosé in the south of France.",
    tags: ["Culture", "Food", "Romance"],
  },
  {
    id: "iceland-ring-road-9d",
    title: "Iceland Ring Road: Fire, Ice & Northern Lights",
    destination: "Iceland",
    continent: "europe",
    imageUrl:
      "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80",
    duration: "9 days",
    budget: "Premium",
    description:
      "Drive the full ring road past glaciers, volcanic beaches, geysers, and hot springs under the aurora borealis.",
    tags: ["Adventure", "Nature", "Road Trip"],
  },
  {
    id: "amalfi-coast-7d",
    title: "Amalfi Coast: Cliffside Villages & Limoncello",
    destination: "Italy",
    continent: "europe",
    imageUrl:
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=80",
    duration: "7 days",
    budget: "Premium",
    description:
      "Wind along the dramatic coastline from Positano to Ravello. Fresh pasta, boat trips to Capri, and sunset aperitivos.",
    tags: ["Romance", "Food", "Beach"],
  },
  {
    id: "lisbon-porto-6d",
    title: "Portugal: Lisbon, Porto & the Douro Valley",
    destination: "Portugal",
    continent: "europe",
    imageUrl:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
    duration: "6 days",
    budget: "Budget",
    description:
      "Ride vintage trams through Alfama, taste pastéis de nata, then cruise the Douro Valley wine region.",
    tags: ["City", "Food", "Culture"],
  },

  // Africa
  {
    id: "morocco-10d",
    title: "Morocco: Medinas, Desert & Atlas Mountains",
    destination: "Morocco",
    continent: "africa",
    imageUrl:
      "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80",
    duration: "10 days",
    budget: "Budget",
    description:
      "Get lost in the souks of Marrakech, camp under Saharan stars, and trek through the Atlas Mountains.",
    tags: ["Adventure", "Culture", "Nature"],
  },
  {
    id: "tanzania-safari-8d",
    title: "Tanzania: Serengeti, Ngorongoro & Zanzibar",
    destination: "Tanzania",
    continent: "africa",
    imageUrl:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    duration: "8 days",
    budget: "Premium",
    description:
      "Witness the Great Migration on safari, descend into the Ngorongoro Crater, then unwind on Zanzibar's white-sand beaches.",
    tags: ["Wildlife", "Nature", "Beach"],
  },

  // South America
  {
    id: "patagonia-14d",
    title: "Patagonia: Glaciers, Peaks & Endless Trails",
    destination: "Argentina & Chile",
    continent: "south-america",
    imageUrl:
      "https://images.unsplash.com/photo-1531794302044-dbb28b1e9e40?w=800&q=80",
    duration: "14 days",
    budget: "Mid-range",
    description:
      "Hike the W Trek in Torres del Paine, witness Perito Moreno glacier, and explore the wild end of the world.",
    tags: ["Adventure", "Nature", "Hiking"],
  },
  {
    id: "peru-12d",
    title: "Peru: Lima, Cusco & the Sacred Valley",
    destination: "Peru",
    continent: "south-america",
    imageUrl:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80",
    duration: "12 days",
    budget: "Mid-range",
    description:
      "World-class ceviche in Lima, the Inca Trail to Machu Picchu, and Rainbow Mountain at dawn.",
    tags: ["Culture", "Adventure", "Hiking"],
  },

  // North America
  {
    id: "california-coast-10d",
    title: "California Coast: PCH from SF to LA",
    destination: "United States",
    continent: "north-america",
    imageUrl:
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800&q=80",
    duration: "10 days",
    budget: "Mid-range",
    description:
      "Drive the Pacific Coast Highway past Big Sur cliffs, Monterey's sea otters, and Santa Barbara's wine country.",
    tags: ["Road Trip", "Nature", "Beach"],
  },
  {
    id: "mexico-city-oaxaca-9d",
    title: "Mexico: Mexico City, Oaxaca & the Coast",
    destination: "Mexico",
    continent: "north-america",
    imageUrl:
      "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80",
    duration: "9 days",
    budget: "Budget",
    description:
      "Street tacos in CDMX, mezcal tastings in Oaxaca, and hidden Pacific beaches in Huatulco.",
    tags: ["Food", "Culture", "Beach"],
  },

  // Oceania
  {
    id: "new-zealand-16d",
    title: "New Zealand: Mountains, Fjords & Middle-earth",
    destination: "New Zealand",
    continent: "oceania",
    imageUrl:
      "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80",
    duration: "16 days",
    budget: "Mid-range",
    description:
      "From Auckland to Queenstown — kayak Milford Sound, bungee jump, and road-trip through landscapes straight out of a fantasy film.",
    tags: ["Adventure", "Nature", "Road Trip"],
  },
  {
    id: "australia-east-coast-12d",
    title: "Australia: Sydney to the Great Barrier Reef",
    destination: "Australia",
    continent: "oceania",
    imageUrl:
      "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80",
    duration: "12 days",
    budget: "Mid-range",
    description:
      "Opera House selfie, surf at Byron Bay, snorkel the reef, and road-trip through tropical Queensland.",
    tags: ["Beach", "Nature", "Adventure"],
  },
];
