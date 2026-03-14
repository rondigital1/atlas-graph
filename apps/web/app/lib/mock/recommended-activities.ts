import type { RecommendedActivity } from "../types";

const activitiesByDestination: Record<string, RecommendedActivity[]> = {
  tokyo: [
    {
      id: "a-tokyo-1",
      title: "Meiji Shrine Morning Walk",
      description: "Peaceful stroll through the forested shrine grounds before the crowds arrive.",
      category: "culture",
      suggestedTime: "morning",
      duration: "1.5 hrs",
    },
    {
      id: "a-tokyo-2",
      title: "Teamlab Borderless Digital Art",
      description: "Immersive digital art museum with infinite rooms of light and color.",
      category: "culture",
      suggestedTime: "afternoon",
      duration: "2 hrs",
    },
    {
      id: "a-tokyo-3",
      title: "Golden Gai Bar Hopping",
      description: "Explore the tiny themed bars of Shinjuku's atmospheric Golden Gai alleyways.",
      category: "leisure",
      suggestedTime: "evening",
      duration: "2 hrs",
    },
    {
      id: "a-tokyo-4",
      title: "Tsukiji Outer Market Food Tour",
      description: "Sample fresh tamagoyaki, tuna skewers, and mochi at the legendary market stalls.",
      category: "food",
      suggestedTime: "morning",
      duration: "2 hrs",
    },
    {
      id: "a-tokyo-5",
      title: "Shibuya Sky Observation Deck",
      description: "360-degree open-air rooftop views from atop Shibuya Scramble Square.",
      category: "landmark",
      suggestedTime: "afternoon",
      duration: "1 hr",
    },
  ],
  barcelona: [
    {
      id: "a-bcn-1",
      title: "Park Güell Sunrise Visit",
      description: "Beat the crowds at Gaudí's mosaic wonderland with golden morning light.",
      category: "landmark",
      suggestedTime: "morning",
      duration: "1.5 hrs",
    },
    {
      id: "a-bcn-2",
      title: "Gothic Quarter Walking Tour",
      description: "Wind through medieval alleys, Roman ruins, and hidden plazas.",
      category: "culture",
      suggestedTime: "afternoon",
      duration: "2 hrs",
    },
    {
      id: "a-bcn-3",
      title: "Barceloneta Beach Sunset",
      description: "End the day with a swim and chiringuito drinks on the city beach.",
      category: "leisure",
      suggestedTime: "evening",
      duration: "2 hrs",
    },
    {
      id: "a-bcn-4",
      title: "Sagrada Familia Interior Tour",
      description: "Gaudí's unfinished masterpiece — the interior light show through stained glass is breathtaking.",
      category: "landmark",
      suggestedTime: "morning",
      duration: "1.5 hrs",
    },
  ],
  rome: [
    {
      id: "a-rome-1",
      title: "Vatican Museums Early Entry",
      description: "Skip the lines and see the Sistine Chapel in relative peace.",
      category: "culture",
      suggestedTime: "morning",
      duration: "3 hrs",
    },
    {
      id: "a-rome-2",
      title: "Trastevere Evening Passeggiata",
      description: "Join the locals for an evening stroll through Rome's most charming neighborhood.",
      category: "leisure",
      suggestedTime: "evening",
      duration: "1.5 hrs",
    },
    {
      id: "a-rome-3",
      title: "Colosseum Underground Tour",
      description: "Access the gladiator tunnels and arena floor — far beyond the standard visit.",
      category: "landmark",
      suggestedTime: "afternoon",
      duration: "2 hrs",
    },
    {
      id: "a-rome-4",
      title: "Gelato Tasting in Centro Storico",
      description: "Hit the top three gelaterias within walking distance of the Pantheon.",
      category: "food",
      suggestedTime: "afternoon",
      duration: "1 hr",
    },
  ],
  paris: [
    {
      id: "a-paris-1",
      title: "Musée d'Orsay Impressionist Wing",
      description: "Monet, Renoir, and Degas in the converted Beaux-Arts train station.",
      category: "culture",
      suggestedTime: "morning",
      duration: "2.5 hrs",
    },
    {
      id: "a-paris-2",
      title: "Seine River Sunset Cruise",
      description: "Glide past Notre-Dame, the Louvre, and the Eiffel Tower as the city lights up.",
      category: "leisure",
      suggestedTime: "evening",
      duration: "1.5 hrs",
    },
    {
      id: "a-paris-3",
      title: "Montmartre Art Walk",
      description: "Sacré-Cœur views, Place du Tertre artists, and hidden vineyard pathways.",
      category: "culture",
      suggestedTime: "afternoon",
      duration: "2 hrs",
    },
    {
      id: "a-paris-4",
      title: "Le Marais Vintage Shopping",
      description: "Browse concept stores, vintage boutiques, and artisan workshops in the hippest quarter.",
      category: "leisure",
      suggestedTime: "afternoon",
      duration: "2 hrs",
    },
  ],
};

const fallbackActivities: RecommendedActivity[] = [
  {
    id: "a-gen-1",
    title: "Old Town Walking Tour",
    description: "Discover the historic heart of the city with a self-guided or local-led walk.",
    category: "culture",
    suggestedTime: "morning",
    duration: "2 hrs",
  },
  {
    id: "a-gen-2",
    title: "Local Cooking Class",
    description: "Learn to prepare signature dishes with a local chef and bring recipes home.",
    category: "food",
    suggestedTime: "afternoon",
    duration: "3 hrs",
  },
  {
    id: "a-gen-3",
    title: "Sunset Viewpoint",
    description: "Find the highest point in the city for a panoramic golden-hour view.",
    category: "leisure",
    suggestedTime: "evening",
    duration: "1 hr",
  },
  {
    id: "a-gen-4",
    title: "Central Market Visit",
    description: "Browse fresh produce, street food stalls, and local specialties.",
    category: "food",
    suggestedTime: "morning",
    duration: "1.5 hrs",
  },
];

export function getActivitiesForDestination(
  destination: string,
): RecommendedActivity[] {
  const lower = destination.toLowerCase();

  for (const [keyword, activities] of Object.entries(activitiesByDestination)) {
    if (lower.includes(keyword)) {
      return activities;
    }
  }

  return fallbackActivities;
}
