import type { RecommendedRestaurant } from "../types";

/**
 * Mock restaurant data keyed by destination keyword (lowercase).
 * In the future, this will come from the AI planning service.
 */
const restaurantsByDestination: Record<string, RecommendedRestaurant[]> = {
  tokyo: [
    {
      id: "r-tokyo-1",
      name: "Tsukiji Sushi Dai",
      cuisine: "Sushi",
      priceRange: "$$",
      rating: 4.8,
      description:
        "Legendary omakase counter near the outer market. Worth the early morning queue for the freshest fish in the city.",
      neighborhood: "Tsukiji",
      imageUrl:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80",
      tags: ["Sushi", "Omakase", "Seafood"],
    },
    {
      id: "r-tokyo-2",
      name: "Fuunji",
      cuisine: "Ramen",
      priceRange: "$",
      rating: 4.6,
      description:
        "Tiny tsukemen shop in Shinjuku with thick, rich dipping broth and perfectly chewy noodles.",
      neighborhood: "Shinjuku",
      imageUrl:
        "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&q=80",
      tags: ["Ramen", "Tsukemen", "Casual"],
    },
    {
      id: "r-tokyo-3",
      name: "Gonpachi Nishi-Azabu",
      cuisine: "Japanese Izakaya",
      priceRange: "$$$",
      rating: 4.5,
      description:
        "The iconic 'Kill Bill restaurant' with stunning traditional architecture, great yakitori, and handmade soba.",
      neighborhood: "Roppongi",
      imageUrl:
        "https://images.unsplash.com/photo-1554502078-ef0fc409efce?w=400&q=80",
      tags: ["Izakaya", "Yakitori", "Iconic"],
    },
    {
      id: "r-tokyo-4",
      name: "Ichiran Shibuya",
      cuisine: "Ramen",
      priceRange: "$",
      rating: 4.4,
      description:
        "Solo-dining ramen experience with customizable richness, spice, and garlic levels. Open 24/7.",
      neighborhood: "Shibuya",
      imageUrl:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
      tags: ["Ramen", "Late Night", "Solo"],
    },
  ],
  barcelona: [
    {
      id: "r-bcn-1",
      name: "Cal Pep",
      cuisine: "Tapas & Seafood",
      priceRange: "$$$",
      rating: 4.7,
      description:
        "Legendary counter-service tapas bar in El Born. The fried artichokes and baby squid are unmissable.",
      neighborhood: "El Born",
      imageUrl:
        "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&q=80",
      tags: ["Tapas", "Seafood", "Counter"],
    },
    {
      id: "r-bcn-2",
      name: "La Boqueria Market Stalls",
      cuisine: "Market Food",
      priceRange: "$",
      rating: 4.5,
      description:
        "Graze through Barcelona's most famous market — fresh juices, jamón ibérico, and seafood cones.",
      neighborhood: "Las Ramblas",
      imageUrl:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80",
      tags: ["Market", "Casual", "Street Food"],
    },
    {
      id: "r-bcn-3",
      name: "Cervecería Catalana",
      cuisine: "Tapas",
      priceRange: "$$",
      rating: 4.6,
      description:
        "Bustling tapas institution on Carrer de Mallorca. The montaditos and patatas bravas are outstanding.",
      neighborhood: "Eixample",
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
      tags: ["Tapas", "Wine", "Classic"],
    },
  ],
  rome: [
    {
      id: "r-rome-1",
      name: "Da Enzo al 29",
      cuisine: "Roman Trattoria",
      priceRange: "$$",
      rating: 4.8,
      description:
        "Trastevere gem serving the best cacio e pepe and carbonara in Rome. Arrive early — no reservations.",
      neighborhood: "Trastevere",
      imageUrl:
        "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&q=80",
      tags: ["Pasta", "Traditional", "Trattoria"],
    },
    {
      id: "r-rome-2",
      name: "Pizzarium Bonci",
      cuisine: "Pizza al Taglio",
      priceRange: "$",
      rating: 4.7,
      description:
        "Gabriele Bonci's legendary pizza-by-the-slice shop. Crispy, airy, and topped with seasonal ingredients.",
      neighborhood: "Prati",
      imageUrl:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
      tags: ["Pizza", "Casual", "Street Food"],
    },
    {
      id: "r-rome-3",
      name: "Roscioli",
      cuisine: "Italian Deli & Wine",
      priceRange: "$$$",
      rating: 4.6,
      description:
        "Part deli, part restaurant, part wine bar. Exceptional pasta, cured meats, and an overwhelming cheese selection.",
      neighborhood: "Centro Storico",
      imageUrl:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
      tags: ["Wine", "Deli", "Pasta"],
    },
  ],
  paris: [
    {
      id: "r-paris-1",
      name: "Le Comptoir du Panthéon",
      cuisine: "French Bistro",
      priceRange: "$$",
      rating: 4.5,
      description:
        "Classic Left Bank bistro with a terrace facing the Panthéon. Duck confit and crème brûlée done right.",
      neighborhood: "5th Arrondissement",
      imageUrl:
        "https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=400&q=80",
      tags: ["Bistro", "Classic", "Terrace"],
    },
    {
      id: "r-paris-2",
      name: "Breizh Café",
      cuisine: "Crêperie",
      priceRange: "$",
      rating: 4.6,
      description:
        "Upscale Breton crêperie in the Marais. Buckwheat galettes with artisanal fillings and proper cider.",
      neighborhood: "Le Marais",
      imageUrl:
        "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&q=80",
      tags: ["Crêpes", "Breton", "Casual"],
    },
    {
      id: "r-paris-3",
      name: "Bouillon Chartier",
      cuisine: "French Brasserie",
      priceRange: "$",
      rating: 4.4,
      description:
        "Stunning Belle Époque dining hall serving affordable French classics since 1896. A Paris institution.",
      neighborhood: "9th Arrondissement",
      imageUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
      tags: ["Historic", "Budget", "Brasserie"],
    },
  ],
};

/** Fallback restaurants for destinations without specific data. */
const fallbackRestaurants: RecommendedRestaurant[] = [
  {
    id: "r-gen-1",
    name: "Local Market Tour",
    cuisine: "Local Cuisine",
    priceRange: "$",
    rating: 4.5,
    description:
      "Explore the freshest local flavors at the city's central market. A must for any food lover.",
    neighborhood: "City Center",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
    tags: ["Market", "Local", "Street Food"],
  },
  {
    id: "r-gen-2",
    name: "Rooftop Dining Experience",
    cuisine: "Contemporary",
    priceRange: "$$$",
    rating: 4.6,
    description:
      "Elevated dining with panoramic city views. Seasonal tasting menus featuring local ingredients.",
    neighborhood: "Downtown",
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    tags: ["Fine Dining", "Views", "Seasonal"],
  },
  {
    id: "r-gen-3",
    name: "Hidden Street Food Gem",
    cuisine: "Street Food",
    priceRange: "$",
    rating: 4.7,
    description:
      "A locals-only spot serving the city's best street food. Simple, delicious, and incredibly affordable.",
    neighborhood: "Old Town",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    tags: ["Street Food", "Budget", "Authentic"],
  },
];

/**
 * Returns mock restaurant recommendations for a given destination.
 * Matches against known city keywords, falls back to generic recommendations.
 */
export function getRestaurantsForDestination(
  destination: string,
): RecommendedRestaurant[] {
  const lower = destination.toLowerCase();

  for (const [keyword, restaurants] of Object.entries(
    restaurantsByDestination,
  )) {
    if (lower.includes(keyword)) {
      return restaurants;
    }
  }

  return fallbackRestaurants;
}
