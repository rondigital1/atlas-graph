import type { ExploreDay, ExploreItineraryDetail } from "../types";
import { exploreItineraries } from "./explore-itineraries";

const daysByItinerary: Record<string, ExploreDay[]> = {
  "tokyo-kyoto-10d": [
    {
      day: 1,
      title: "Arrive in Tokyo",
      slots: [
        {
          label: "Afternoon",
          activities: [
            {
              time: "2:00 PM",
              title: "Check in at Shinjuku hotel",
              description:
                "Settle in and get your bearings in one of Tokyo's busiest districts.",
            },
            {
              time: "4:00 PM",
              title: "Meiji Shrine & Harajuku stroll",
              description:
                "Walk through the serene forested approach to Meiji Shrine, then explore the quirky shops of Takeshita Street.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "Golden Gai bar hopping",
              description:
                "Squeeze into the tiny, character-filled bars of this iconic Shinjuku alley.",
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: "Tokyo: Markets & Pop Culture",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "6:00 AM",
              title: "Tsukiji Outer Market",
              description:
                "Arrive early for the freshest sushi breakfast and tamagoyaki in Tokyo.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Akihabara & teamLab Borderless",
              description:
                "Dive into anime culture, then lose yourself in the immersive digital art museum.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "Ramen in Shinjuku",
              description:
                "Slurp tonkotsu ramen at a highly rated local joint.",
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: "Bullet Train to Kyoto",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "8:30 AM",
              title: "Shinkansen to Kyoto",
              description:
                "Ride the bullet train — watch Mt. Fuji fly by on the right side.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "12:00 PM",
              title: "Fushimi Inari Taisha",
              description:
                "Hike through thousands of vermillion torii gates snaking up the mountainside.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:30 PM",
              title: "Pontocho alley dinner",
              description:
                "Dine along the lantern-lit canal-side alley, one of Kyoto's most atmospheric streets.",
            },
          ],
        },
      ],
    },
  ],

  "bali-ubud-12d": [
    {
      day: 1,
      title: "Arrive in Seminyak",
      slots: [
        {
          label: "Afternoon",
          activities: [
            {
              time: "3:00 PM",
              title: "Beach villa check-in",
              description:
                "Settle into your beachfront villa and dip in the infinity pool.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:00 PM",
              title: "Sunset at Ku De Ta",
              description:
                "Watch the sun melt into the Indian Ocean over craft cocktails.",
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: "Canggu Surf & Explore",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "7:00 AM",
              title: "Surf lesson at Batu Bolong",
              description:
                "Catch your first waves at Canggu's beginner-friendly beach break.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Rice paddy café lunch",
              description:
                "Enjoy a smoothie bowl overlooking emerald rice fields.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "5:30 PM",
              title: "Tanah Lot temple at sunset",
              description:
                "Visit the iconic sea temple silhouetted against a golden sky.",
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: "Ubud: Culture & Nature",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "8:00 AM",
              title: "Tegallalang Rice Terraces",
              description:
                "Walk through Bali's most photographed terraced landscape.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "2:00 PM",
              title: "Sacred Monkey Forest",
              description:
                "Wander the mossy temple ruins while long-tailed macaques swing overhead.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "Balinese dance performance",
              description:
                "Watch a traditional Kecak fire dance at Ubud Palace.",
            },
          ],
        },
      ],
    },
  ],

  "vietnam-14d": [
    {
      day: 1,
      title: "Hanoi Old Quarter",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "9:00 AM",
              title: "Pho breakfast on the street",
              description:
                "Pull up a tiny plastic stool and slurp pho bo with the locals.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Hoan Kiem Lake & Temple of Literature",
              description:
                "Stroll around the lake, then explore Vietnam's oldest university.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:00 PM",
              title: "Bia hoi corner",
              description:
                "Join the nightly sidewalk beer scene — fresh draft beer for pennies.",
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: "Ha Long Bay Cruise",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "7:00 AM",
              title: "Drive to Ha Long Bay",
              description:
                "Transfer to the harbor and board your overnight junk boat.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Kayak through limestone karsts",
              description:
                "Paddle into hidden lagoons surrounded by towering emerald pillars.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "Seafood dinner on deck",
              description:
                "Feast on fresh catch as the sun sets over the bay.",
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: "Train to Hué",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "8:00 AM",
              title: "Board the Reunification Express",
              description:
                "Begin the scenic rail journey south through rice paddies and coastline.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "3:00 PM",
              title: "Arrive in Hué",
              description:
                "Check in near the Perfume River and explore the riverside promenade.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:30 PM",
              title: "Bun bo Hué dinner",
              description:
                "Taste the city's signature spicy beef noodle soup at a local favorite.",
            },
          ],
        },
      ],
    },
  ],

  "barcelona-provence-8d": [
    {
      day: 1,
      title: "Barcelona: Gothic Quarter",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "10:00 AM",
              title: "La Boqueria market",
              description:
                "Graze through the famous market — fresh juice, jamón, and fruit.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "2:00 PM",
              title: "Gothic Quarter walking tour",
              description:
                "Wander medieval alleyways, hidden plazas, and the Barcelona Cathedral.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "8:30 PM",
              title: "Tapas crawl in El Born",
              description:
                "Hop between pintxos bars — patatas bravas, croquetas, and cava.",
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: "Gaudí & Montjuïc",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "9:00 AM",
              title: "Sagrada Família",
              description:
                "Marvel at Gaudí's unfinished masterpiece — the stained glass light show is unmissable.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "2:00 PM",
              title: "Park Güell",
              description:
                "Explore the colorful mosaic terraces with panoramic city views.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "Barceloneta beach sunset",
              description:
                "End the day with sangria on the sand as the Mediterranean glows amber.",
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: "Train to Provence",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "8:00 AM",
              title: "High-speed train to Avignon",
              description:
                "Cross the border and arrive in the heart of Provence by midday.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Pont du Gard & Avignon",
              description:
                "Visit the ancient Roman aqueduct, then stroll the walled city of Avignon.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:30 PM",
              title: "Farm-to-table dinner",
              description:
                "Dine on Provençal cuisine with local wine at a countryside auberge.",
            },
          ],
        },
      ],
    },
  ],

  "iceland-ring-road-9d": [
    {
      day: 1,
      title: "Reykjavik & the Golden Circle",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "9:00 AM",
              title: "Pick up rental car",
              description:
                "Grab your 4x4 and stock up on supplies in Reykjavik.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "12:00 PM",
              title: "Þingvellir, Geysir & Gullfoss",
              description:
                "Drive the Golden Circle — tectonic plates, erupting geysers, and a thundering waterfall.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "8:00 PM",
              title: "Secret Lagoon soak",
              description:
                "Relax in a natural hot spring under the wide Icelandic sky.",
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: "South Coast Waterfalls",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "8:00 AM",
              title: "Seljalandsfoss & Skógafoss",
              description:
                "Walk behind one waterfall and stand in the mist of another.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Reynisfjara black sand beach",
              description:
                "See the dramatic basalt columns and crashing North Atlantic waves.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:00 PM",
              title: "Vik village dinner",
              description:
                "Enjoy fresh Icelandic lamb at the southernmost village.",
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: "Glacier Lagoon",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "8:00 AM",
              title: "Drive to Jökulsárlón",
              description:
                "Head east along the coast toward the glacier lagoon.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "12:00 PM",
              title: "Jökulsárlón boat tour",
              description:
                "Cruise among floating icebergs calved from the glacier.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "5:00 PM",
              title: "Diamond Beach sunset",
              description:
                "Watch ice chunks glitter on the volcanic black sand.",
            },
          ],
        },
      ],
    },
  ],

  "amalfi-coast-7d": [
    {
      day: 1,
      title: "Arrive in Positano",
      slots: [
        {
          label: "Afternoon",
          activities: [
            {
              time: "2:00 PM",
              title: "Check in to clifftop hotel",
              description:
                "Settle into your room with a balcony view of the pastel village cascading to the sea.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "Aperitivo with a view",
              description:
                "Sip an Aperol spritz while watching the sunset paint Positano gold.",
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: "Path of the Gods",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "8:00 AM",
              title: "Hike the Sentiero degli Dei",
              description:
                "Walk the legendary cliff trail with vertigo-inducing coastal panoramas.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Lunch in Nocelle",
              description:
                "Refuel with fresh pasta and local wine at a tiny hillside trattoria.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:30 PM",
              title: "Seafood dinner on the beach",
              description:
                "Dine on grilled catch of the day with your feet nearly in the sand.",
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: "Capri Day Trip",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "9:00 AM",
              title: "Ferry to Capri",
              description:
                "Catch the morning boat across the sparkling Bay of Naples.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "12:00 PM",
              title: "Blue Grotto & island walk",
              description:
                "Enter the luminous sea cave, then wander Capri's chic piazzetta.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:00 PM",
              title: "Limoncello tasting",
              description:
                "Sample the coast's signature liqueur at a family-run distillery.",
            },
          ],
        },
      ],
    },
  ],

  "lisbon-porto-6d": [
    {
      day: 1,
      title: "Lisbon: Alfama & Belém",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "9:00 AM",
              title: "Tram 28 through Alfama",
              description:
                "Ride the iconic yellow tram through Lisbon's oldest neighborhood.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "2:00 PM",
              title: "Pastéis de Belém & Jerónimos Monastery",
              description:
                "Queue for the original custard tart, then tour the Manueline masterpiece.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "8:00 PM",
              title: "Fado in Mouraria",
              description:
                "Listen to hauntingly beautiful fado music in an intimate tavern.",
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: "Sintra & Cascais",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "9:00 AM",
              title: "Train to Sintra",
              description:
                "Explore the colorful Pena Palace perched above the misty hills.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "2:00 PM",
              title: "Quinta da Regaleira",
              description:
                "Descend the Initiation Well and wander the enchanted gardens.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:00 PM",
              title: "Seafood in Cascais",
              description:
                "End the day at the coast with grilled fish and cold vinho verde.",
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: "Porto: Wine & River",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "8:00 AM",
              title: "Train to Porto",
              description:
                "Arrive at São Bento station and admire its 20,000 azulejo tiles.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Ribeira & Dom Luís I Bridge",
              description:
                "Walk the colorful riverside district and cross the iconic iron bridge.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "5:00 PM",
              title: "Port wine tasting in Vila Nova de Gaia",
              description:
                "Sample vintage ports across the river in the historic wine cellars.",
            },
          ],
        },
      ],
    },
  ],

  "morocco-10d": [
    {
      day: 1,
      title: "Marrakech Medina",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "9:00 AM",
              title: "Jemaa el-Fnaa & souks",
              description:
                "Plunge into the labyrinthine markets — spices, leather, and lanterns.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "2:00 PM",
              title: "Bahia Palace & Saadian Tombs",
              description:
                "Marvel at intricate zellige tilework and carved cedar ceilings.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "Rooftop tagine dinner",
              description:
                "Savor slow-cooked lamb tagine overlooking the medina rooftops.",
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: "Atlas Mountains",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "7:00 AM",
              title: "Drive into the High Atlas",
              description:
                "Wind through mountain passes with views of Berber villages.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "12:00 PM",
              title: "Imlil Valley hike",
              description:
                "Trek through walnut groves to a traditional mountain lunch.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:00 PM",
              title: "Berber homestay dinner",
              description:
                "Share mint tea and couscous with a local family under the stars.",
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: "Sahara Desert",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "6:00 AM",
              title: "Drive to Merzouga",
              description:
                "Cross the dramatic Tizi n'Tichka pass and the Dadès Valley.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "4:00 PM",
              title: "Camel trek into Erg Chebbi",
              description:
                "Ride into the golden dunes as shadows lengthen across the sand.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "8:00 PM",
              title: "Desert camp under the stars",
              description:
                "Sleep in a Berber tent with drumming, dinner, and a sky full of stars.",
            },
          ],
        },
      ],
    },
  ],

  "tanzania-safari-8d": [
    {
      day: 1,
      title: "Arrive in Arusha",
      slots: [
        {
          label: "Afternoon",
          activities: [
            {
              time: "2:00 PM",
              title: "Lodge check-in near Arusha",
              description:
                "Settle in at a lodge at the foot of Mount Meru with views of Kilimanjaro.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:30 PM",
              title: "Safari briefing & dinner",
              description:
                "Meet your guide, review the route, and enjoy your first East African feast.",
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: "Serengeti: The Great Migration",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "6:00 AM",
              title: "Fly to the Serengeti",
              description:
                "Bush plane over the Rift Valley to the heart of the Serengeti.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "12:00 PM",
              title: "Game drive: big cats & herds",
              description:
                "Spot lions, cheetahs, and vast wildebeest herds on the endless plains.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:30 PM",
              title: "Sundowner on the savanna",
              description:
                "Toast to the African sunset with gin and tonics in the bush.",
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: "Ngorongoro Crater",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "6:30 AM",
              title: "Descend into the crater",
              description:
                "Drive down into the world's largest intact volcanic caldera.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "12:00 PM",
              title: "Crater floor game drive",
              description:
                "See rhinos, hippos, and flamingos in this natural amphitheatre.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "5:00 PM",
              title: "Crater rim lodge dinner",
              description:
                "Dine with a view 600 meters above the crater floor.",
            },
          ],
        },
      ],
    },
  ],

  "patagonia-14d": [
    {
      day: 1,
      title: "Arrive in El Calafate",
      slots: [
        {
          label: "Afternoon",
          activities: [
            {
              time: "2:00 PM",
              title: "Arrive & settle in",
              description:
                "Check into your lakeside hotel on Lago Argentino.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "Patagonian lamb asado",
              description:
                "Feast on slow-roasted lamb with Malbec at a local parrilla.",
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: "Perito Moreno Glacier",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "8:00 AM",
              title: "Drive to Los Glaciares National Park",
              description:
                "Enter the park and approach one of the world's few advancing glaciers.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "12:00 PM",
              title: "Glacier walkways & boat cruise",
              description:
                "Walk the boardwalks for face-to-face views, then cruise to the ice wall.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:00 PM",
              title: "Whisky on glacier ice",
              description:
                "End the day with a drink cooled by 10,000-year-old ice.",
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: "Torres del Paine: Day 1",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "7:00 AM",
              title: "Cross to Chile & enter the park",
              description:
                "Drive across the border to Torres del Paine National Park.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Hike to Mirador Base Torres",
              description:
                "Trek to the iconic viewpoint of the three granite towers.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "Refugio dinner",
              description:
                "Refuel with hearty mountain food at a trekking refuge.",
            },
          ],
        },
      ],
    },
  ],

  "peru-12d": [
    {
      day: 1,
      title: "Lima: Food Capital",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "10:00 AM",
              title: "Miraflores & Larcomar",
              description:
                "Stroll the clifftop parks and paraglide over the Pacific.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Ceviche lunch at La Mar",
              description:
                "Taste Peru's national dish at one of Lima's best cevicherías.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "8:00 PM",
              title: "Barranco nightlife",
              description:
                "Explore the bohemian neighborhood's bars and street art.",
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: "Fly to Cusco",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "7:00 AM",
              title: "Flight to Cusco",
              description:
                "Fly over the Andes to the ancient Inca capital at 3,400m.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Acclimatize & explore Plaza de Armas",
              description:
                "Take it slow — coca tea, the main square, and San Pedro Market.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "Pisco sour & alpaca steak",
              description:
                "Try the national cocktail and local delicacy at a cozy Cusco restaurant.",
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: "Sacred Valley",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "8:00 AM",
              title: "Pisac ruins & market",
              description:
                "Explore the terraced Inca fortress and the colorful artisan market below.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "2:00 PM",
              title: "Ollantaytambo fortress",
              description:
                "Climb the massive stone terraces of this living Inca town.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:00 PM",
              title: "Overnight in the Sacred Valley",
              description:
                "Stay in a valley hotel surrounded by mountains and farmland.",
            },
          ],
        },
      ],
    },
  ],

  "california-coast-10d": [
    {
      day: 1,
      title: "San Francisco",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "9:00 AM",
              title: "Golden Gate Bridge walk",
              description:
                "Cross the iconic bridge in the morning fog and snap photos from Battery Spencer.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Fisherman's Wharf & Chinatown",
              description:
                "Clam chowder in a sourdough bowl, then dim sum in the oldest Chinatown in the US.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "North Beach Italian dinner",
              description:
                "Feast on handmade pasta in San Francisco's Little Italy.",
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: "Monterey & Big Sur",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "8:00 AM",
              title: "Drive to Monterey",
              description:
                "Head south along the coast to Monterey Bay Aquarium.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Big Sur & Bixby Bridge",
              description:
                "Drive the dramatic Highway 1 cliffs and stop at McWay Falls.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:00 PM",
              title: "Big Sur lodge dinner",
              description:
                "Dine among the redwoods at Nepenthe with ocean views.",
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: "Santa Barbara Wine Country",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "9:00 AM",
              title: "Drive to Santa Barbara",
              description:
                "Continue south through rolling hills to the American Riviera.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Wine tasting in Los Olivos",
              description:
                "Sample Pinot Noir and Chardonnay in the Santa Ynez Valley.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "Stearns Wharf sunset",
              description:
                "Walk the pier and grab fish tacos as the sun sets over the Channel Islands.",
            },
          ],
        },
      ],
    },
  ],

  "mexico-city-oaxaca-9d": [
    {
      day: 1,
      title: "Mexico City: Centro Histórico",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "9:00 AM",
              title: "Zócalo & Templo Mayor",
              description:
                "Stand in the massive main square and explore Aztec ruins beneath the city.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Street taco crawl",
              description:
                "Hit the legendary taco stands — al pastor, suadero, and carnitas.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "Lucha libre & mezcal",
              description:
                "Watch masked wrestlers at Arena México, then sip smoky mezcal.",
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: "CDMX: Art & Gardens",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "9:00 AM",
              title: "Frida Kahlo Museum",
              description:
                "Tour the Blue House — Frida's life, art, and garden in Coyoacán.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "2:00 PM",
              title: "Xochimilco floating gardens",
              description:
                "Drift on a colorful trajinera through the ancient canal network.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "8:00 PM",
              title: "Roma Norte dinner",
              description:
                "Dine at one of the neighborhood's acclaimed restaurants.",
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: "Fly to Oaxaca",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "8:00 AM",
              title: "Flight to Oaxaca City",
              description:
                "A short hop to Mexico's culinary capital in the Sierra Madre.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "12:00 PM",
              title: "Monte Albán ruins",
              description:
                "Explore the ancient Zapotec mountaintop city above Oaxaca Valley.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "Mezcal tasting & tlayudas",
              description:
                "Sample artisanal mezcal varieties and Oaxaca's signature crispy tortilla.",
            },
          ],
        },
      ],
    },
  ],

  "new-zealand-16d": [
    {
      day: 1,
      title: "Auckland to Hobbiton",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "8:00 AM",
              title: "Pick up campervan in Auckland",
              description:
                "Collect your home on wheels and drive south toward the Waikato.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Hobbiton Movie Set tour",
              description:
                "Step into Middle-earth among the hobbit holes and the Green Dragon Inn.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:00 PM",
              title: "Rotorua geothermal park",
              description:
                "See bubbling mud pools and steaming geysers in the volcanic zone.",
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: "Tongariro Alpine Crossing",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "6:00 AM",
              title: "Start the crossing",
              description:
                "Begin New Zealand's best day hike through volcanic moonscapes.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "12:00 PM",
              title: "Emerald Lakes & Red Crater",
              description:
                "Reach the vivid turquoise lakes in the caldera — the hike's showpiece.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "5:00 PM",
              title: "Rest at Whakapapa Village",
              description:
                "Celebrate with a hot meal after 19km of volcanic terrain.",
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: "Drive to Queenstown",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "7:00 AM",
              title: "Ferry across Cook Strait",
              description:
                "Cross from the North to South Island on the scenic ferry.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "2:00 PM",
              title: "Drive through Canterbury",
              description:
                "Road-trip past golden tussock plains and braided rivers.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "Fergburger in Queenstown",
              description:
                "Grab New Zealand's most famous burger after arriving in the adventure capital.",
            },
          ],
        },
      ],
    },
  ],

  "australia-east-coast-12d": [
    {
      day: 1,
      title: "Sydney Harbour",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "9:00 AM",
              title: "Harbour Bridge climb or walk",
              description:
                "Get panoramic views of Sydney from the top of the bridge.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Opera House & Circular Quay",
              description:
                "Tour the iconic sails, then stroll the waterfront to the Botanic Gardens.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "7:00 PM",
              title: "Dinner in Surry Hills",
              description:
                "Explore Sydney's trendiest food neighborhood — Thai, Italian, or modern Australian.",
            },
          ],
        },
      ],
    },
    {
      day: 2,
      title: "Bondi to Coogee",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "8:00 AM",
              title: "Bondi to Coogee coastal walk",
              description:
                "Hike the clifftop trail past beaches, rock pools, and ocean views.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Bronte Beach lunch",
              description:
                "Fish and chips on the grass overlooking the ocean.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:00 PM",
              title: "Sunset at the Rocks",
              description:
                "Explore Sydney's oldest neighborhood and watch the harbour light up.",
            },
          ],
        },
      ],
    },
    {
      day: 3,
      title: "Drive to Byron Bay",
      slots: [
        {
          label: "Morning",
          activities: [
            {
              time: "7:00 AM",
              title: "Fly or drive north",
              description:
                "Head up the coast toward Australia's easternmost point.",
            },
          ],
        },
        {
          label: "Afternoon",
          activities: [
            {
              time: "1:00 PM",
              title: "Cape Byron Lighthouse walk",
              description:
                "Walk to the lighthouse and spot dolphins and (in season) whales.",
            },
          ],
        },
        {
          label: "Evening",
          activities: [
            {
              time: "6:00 PM",
              title: "Byron Bay sunset session",
              description:
                "Surf or swim at The Pass, then watch the sunset from the beach.",
            },
          ],
        },
      ],
    },
  ],
};

function buildHighlights(id: string): string[] {
  const highlightsByItinerary: Record<string, string[]> = {
    "tokyo-kyoto-10d": [
      "Ride the bullet train between Tokyo and Kyoto",
      "Explore 1,000+ torii gates at Fushimi Inari",
      "Taste fresh sushi at Tsukiji Outer Market",
    ],
    "bali-ubud-12d": [
      "Surf beginner waves at Canggu's Batu Bolong",
      "Walk through Tegallalang rice terraces",
      "Watch a traditional Kecak fire dance",
    ],
    "vietnam-14d": [
      "Kayak through Ha Long Bay's limestone karsts",
      "Ride the Reunification Express north to south",
      "Eat pho at street-side stalls in Hanoi",
    ],
    "barcelona-provence-8d": [
      "Tour Gaudí's Sagrada Família at golden hour",
      "Tapas crawl through El Born and La Boqueria",
      "Drive through lavender fields in Provence",
    ],
    "iceland-ring-road-9d": [
      "Walk behind Seljalandsfoss waterfall",
      "Cruise among icebergs at Jökulsárlón",
      "Soak in natural hot springs under the aurora",
    ],
    "amalfi-coast-7d": [
      "Hike the Path of the Gods cliff trail",
      "Enter the Blue Grotto on Capri by rowboat",
      "Sip limoncello at a family distillery",
    ],
    "lisbon-porto-6d": [
      "Ride Tram 28 through Alfama's steep lanes",
      "Taste the original pastéis de nata in Belém",
      "Sample vintage port wines in Gaia cellars",
    ],
    "morocco-10d": [
      "Haggle in the souks of Marrakech",
      "Ride camels into the Sahara at sunset",
      "Sleep under the stars at a desert camp",
    ],
    "tanzania-safari-8d": [
      "Witness the Great Migration on safari",
      "Descend into Ngorongoro Crater",
      "Sundowner drinks on the Serengeti plain",
    ],
    "patagonia-14d": [
      "Face-to-face with Perito Moreno glacier",
      "Hike to the base of Torres del Paine",
      "Taste Patagonian lamb asado with Malbec",
    ],
    "peru-12d": [
      "Eat world-class ceviche in Lima",
      "Walk the Inca Trail to Machu Picchu",
      "Explore the Sacred Valley fortress towns",
    ],
    "california-coast-10d": [
      "Drive Big Sur's Highway 1 cliffs",
      "Walk across the Golden Gate Bridge",
      "Wine tasting in Santa Ynez Valley",
    ],
    "mexico-city-oaxaca-9d": [
      "Street taco crawl through CDMX",
      "Visit Frida Kahlo's Blue House",
      "Mezcal tasting with tlayudas in Oaxaca",
    ],
    "new-zealand-16d": [
      "Complete the Tongariro Alpine Crossing",
      "Tour the Hobbiton Movie Set",
      "Kayak Milford Sound's fjords",
    ],
    "australia-east-coast-12d": [
      "Climb Sydney Harbour Bridge",
      "Surf at Byron Bay's The Pass",
      "Snorkel the Great Barrier Reef",
    ],
  };
  return highlightsByItinerary[id] ?? [];
}

export function getExploreItineraryDetail(
  id: string,
): ExploreItineraryDetail | undefined {
  const base = exploreItineraries.find((i) => i.id === id);
  if (!base) {
    return undefined;
  }

  const days = daysByItinerary[id];
  if (!days) {
    return undefined;
  }

  return {
    ...base,
    days,
    highlights: buildHighlights(id),
  };
}

export function getAllExploreItineraryIds(): string[] {
  return exploreItineraries.map((i) => i.id);
}
