export interface ItineraryDay {
  day: number;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  activities: string[];
}

export interface TravelPackage {
  id: string;
  title: string;
  category: string;
  rating: number;
  duration: string;
  destinations: string;
  price: string;
  image: string;
  heroImage?: string;
  features: string[];
  overview?: string;
  highlights?: string[];
  itinerary?: ItineraryDay[];
  inclusions?: string[];
  exclusions?: string[];
  travelTips?: string[];
}

export const defaultPackages: TravelPackage[] = [
  {
    id: "new-zealand-wonders",
    title: "Natural Wonders of New Zealand – 10 Nights / 11 Days",
    category: "Luxury",
    rating: 4.9,
    duration: "11 Days / 10 Nights",
    destinations: "Auckland • Rotorua • Queenstown • Milford Sound • Franz Josef • Christchurch",
    price: "₹2,49,999",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=1800&auto=format&fit=crop",
    features: [
      "TranzAlpine Scenic Train Journey",
      "Milford Sound Nature Cruise with Lunch",
      "Waitomo Glowworm Caves Boat Ride",
      "Skyline Gondola & Dinner in Queenstown",
      "4-Star & 5-Star Handpicked Stays"
    ],
    overview: "Experience the awe-inspiring landscapes of Middle-earth on this signature 11-day journey across New Zealand's North and South Islands. From the subterranean glow of Waitomo Caves and geothermal wonders of Rotorua to the dramatic fjords of Milford Sound and alpine peaks of Queenstown, this trip delivers pure luxury and adventure.",
    highlights: [
      "Guided boat tour through the illuminated Waitomo Glowworm Caves",
      "Full-length scenic fjord cruise in world-famous Milford Sound",
      "Historic TranzAlpine train ride through the Southern Alps",
      "Evening Maori cultural performance and traditional Hangi feast",
      "Panoramic Skyline Gondola ride overlooking Lake Wakatipu",
      "Glacier viewing and alpine walks at Franz Josef"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Auckland",
        subtitle: "Welcome to the City of Sails",
        image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=1000&auto=format&fit=crop",
        activities: [
          "Meet & greet at Auckland Airport with private luxury transfer",
          "Transfer to hotel & smooth check-in",
          "Evening at leisure – Optional Sky Tower observation deck entry",
          "Overnight stay in Auckland"
        ]
      },
      {
        day: 2,
        title: "Auckland – Waitomo Caves – Rotorua",
        subtitle: "Underground Glowworms & Geothermal Majesty",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop",
        activities: [
          "Scenic morning drive through the lush Waikato farmland",
          "Guided boat exploration of the world-renowned Waitomo Glowworm Caves",
          "Continue journey to Rotorua, New Zealand's geothermal capital",
          "Evening authentic Maori cultural performance & traditional Hangi dinner",
          "Overnight stay in Rotorua"
        ]
      },
      {
        day: 3,
        title: "Rotorua Sightseeing",
        subtitle: "Geysers, Redwoods & Native Wildlife",
        image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1000&auto=format&fit=crop",
        activities: [
          "Visit Te Puia thermal reserve and witness the Pohutu Geyser eruption",
          "Experience the majestic Redwood Treewalk suspended high above the forest floor",
          "Watch the entertaining Agrodome agricultural farm show",
          "Evening soak at the Polynesian Spa hot mineral pools (optional)",
          "Overnight stay in Rotorua"
        ]
      },
      {
        day: 4,
        title: "Rotorua – Queenstown (Flight)",
        subtitle: "Gateway to the Southern Alps",
        image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=1000&auto=format&fit=crop",
        activities: [
          "Transfer to airport for scenic domestic flight to Queenstown",
          "Arrive in Queenstown, the world capital of adventure and natural beauty",
          "Ride the Skyline Gondola for breathtaking panoramic views of Lake Wakatipu and The Remarkables",
          "Overnight stay in Queenstown"
        ]
      },
      {
        day: 5,
        title: "Adventure Day in Queenstown (Optional)",
        subtitle: "Thrills, Alpine Lakes & Historic Towns",
        image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000&auto=format&fit=crop",
        activities: [
          "Optional thrilling Shotover River Jet Boat ride or Kawarau Bridge bungy jump",
          "Relaxing lakeside promenade stroll and visit to historic Arrowtown gold rush village",
          "Gourmet wine tasting in the famed Gibbston Valley Pinot Noir region",
          "Overnight stay in Queenstown"
        ]
      },
      {
        day: 6,
        title: "Milford Sound Cruise Day Trip",
        subtitle: "The Eighth Wonder of the World",
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000&auto=format&fit=crop",
        activities: [
          "Scenic coach drive through Fiordland National Park via the Homer Tunnel",
          "Board modern catamaran for an unforgettable cruise under Mitre Peak waterfalls",
          "Spot fur seals, dolphins, and rare Fiordland crested penguins in the wild",
          "Delicious hot buffet lunch served onboard during the cruise",
          "Scenic evening return drive to Queenstown"
        ]
      },
      {
        day: 7,
        title: "Queenstown to Franz Josef (By Road/Coach)",
        subtitle: "Lakes, Mountain Passes & Rainforests",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
        activities: [
          "Travel along the edges of Lake Wanaka and Lake Hawea",
          "Cross the dramatic Haast Pass through UNESCO World Heritage rainforests",
          "Stop at Thunder Creek Falls and the crystalline Blue Pools",
          "Arrive at the Franz Josef glacier village and check in",
          "Overnight stay in Franz Josef"
        ]
      },
      {
        day: 8,
        title: "Franz Josef Glacier Experience",
        subtitle: "Ancient Ice & Mountain Serenity",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop",
        activities: [
          "Guided alpine walk to the Franz Josef Glacier viewing viewpoint",
          "Optional Heli-Hike: helicopter flight landing directly onto the glacier ice",
          "Relax and rejuvenate in the Franz Josef Glacier Hot Pools tucked into the rainforest",
          "Overnight stay in Franz Josef"
        ]
      },
      {
        day: 9,
        title: "Franz Josef to Christchurch (Train + Coach Transfer)",
        subtitle: "The Legendary TranzAlpine Rail Expedition",
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop",
        activities: [
          "Morning coach transfer north along the rugged West Coast to Greymouth",
          "Board the world-famous TranzAlpine train across Arthur's Pass and Southern Alps gorges",
          "Marvel at deep river valleys, beech forests, and sweeping Canterbury Plains",
          "Arrive in the historic Garden City of Christchurch and hotel transfer",
          "Overnight stay in Christchurch"
        ]
      },
      {
        day: 10,
        title: "Christchurch Sightseeing",
        subtitle: "English Heritage & Modern Resilience",
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop",
        activities: [
          "Peaceful traditional punt ride down the serene Avon River with a costumed punter",
          "Explore the world-famous Christchurch Botanic Gardens",
          "Visit the innovative Transitional Cardboard Cathedral and vibrant Riverside Market",
          "Farewell dinner celebrating your grand New Zealand expedition",
          "Overnight stay in Christchurch"
        ]
      },
      {
        day: 11,
        title: "Departure from Christchurch",
        subtitle: "Haere Rā (Farewell)",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop",
        activities: [
          "Enjoy a leisurely breakfast at your luxury hotel",
          "Morning at leisure for last-minute souvenir shopping (Manuka honey, Merino wool)",
          "Private transfer to Christchurch International Airport for your flight home",
          "Depart with lifetime memories of New Zealand's pure beauty"
        ]
      }
    ],
    inclusions: [
      "10 Nights handpicked premium 4-Star & 5-Star hotel accommodations",
      "Daily buffet breakfast at all hotels",
      "Waitomo Glowworm Caves guided boat tour",
      "Te Puia geothermal reserve and cultural evening in Rotorua with Hangi feast",
      "Skyline Gondola ride in Queenstown",
      "Milford Sound scenic catamaran cruise with international buffet lunch",
      "World-famous TranzAlpine scenic train journey (Greymouth to Christchurch)",
      "All inter-city transfers in modern AC luxury coaches / private vehicles",
      "Airport meet & greet and private airport-hotel transfers",
      "All national park permits, driver allowances, toll charges, and local GST"
    ],
    exclusions: [
      "International flights to Auckland and return from Christchurch",
      "Domestic flight from Rotorua to Queenstown (can be arranged upon request)",
      "New Zealand Tourist Visa (NZeTA / Visitor Visa fees)",
      "Optional adventure sports (Shotover Jet, Bungy, Heli-Hike)",
      "Personal expenses such as laundry, telephone calls, tips, and minibar",
      "Comprehensive international travel & medical insurance"
    ],
    travelTips: [
      "Best Time to Visit: October to April offers pleasant warm weather ideal for outdoor sightseeing and alpine adventures.",
      "Visa: Indian passport holders require a New Zealand Visitor Visa. Visa processing takes approx 3–4 weeks. MHM Travels assists with end-to-end documentation.",
      "Currency: New Zealand Dollar (NZD). Credit cards (Visa/Mastercard) are universally accepted everywhere.",
      "Clothing: The South Island weather can change rapidly. Layering is key: pack thermal innerwear, a windproof & waterproof jacket, and sturdy walking shoes.",
      "Driving & Safety: In NZ, traffic moves on the left. Emergency number is 111."
    ]
  },
  {
    id: "luxury-japan",
    title: "Signature Japan Chronicles",
    category: "Luxury",
    rating: 4.9,
    duration: "9 Days / 8 Nights",
    destinations: "Tokyo • Kyoto • Hakone • Osaka",
    price: "₹1,49,999",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1800&auto=format&fit=crop",
    features: [
      "5-Star Ryokan stays with Onsen",
      "Private Shinkansen Bullet Train tickets",
      "Guided authentic tea ceremony",
      "All entry vouchers & English guide"
    ],
    overview: "Embark on an enchanting 9-day voyage through the land of the rising sun. Seamlessly blending ultra-modern Tokyo with the spiritual heritage of Kyoto, tranquil hot springs of Hakone, and culinary wonders of Osaka.",
    highlights: [
      "Private ride on Japan's world-famous Shinkansen bullet train",
      "Traditional Kaiseki dinner and hot spring onsen in Hakone",
      "Exclusive tea ceremony in a historic Kyoto Buddhist temple",
      "Visit Fushimi Inari Shrine's iconic 10,000 vermilion torii gates",
      "Explore Tokyo's Shibuya Crossing, Senso-ji, and TeamLab Borderless"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive in Tokyo – Neon & Modernity",
        subtitle: "Konnichiwa Tokyo",
        activities: [
          "Arrive at Tokyo Haneda/Narita Airport & VIP private transfer to hotel",
          "Evening walk through glittering Shinjuku and Omoide Yokocho",
          "Welcome dinner featuring Japanese Wagyu BBQ",
          "Overnight in Tokyo"
        ]
      },
      {
        day: 2,
        title: "Tokyo Highlights – Ancient & Futuristic",
        subtitle: "Temples, Shrines & Digital Art",
        activities: [
          "Morning visit to Tokyo's oldest temple, Senso-ji in Asakusa",
          "Stroll through the serene Meiji Jingu shrine gardens",
          "Experience the famous Shibuya Crossing and Harajuku fashion street",
          "Immerse in TeamLab Planets immersive digital art museum",
          "Overnight in Tokyo"
        ]
      },
      {
        day: 3,
        title: "Tokyo to Mount Fuji & Hakone",
        subtitle: "Thermal Onsens & Sacred Peaks",
        activities: [
          "Scenic luxury drive to Mt. Fuji 5th Station for panoramic views",
          "Cruise across crater Lake Ashi on a pirate ship",
          "Ride Hakone Ropeway with views of active volcanic vents",
          "Check in to boutique luxury Ryokan with private outdoor Onsen",
          "Traditional multi-course Kaiseki dinner",
          "Overnight in Hakone"
        ]
      },
      {
        day: 4,
        title: "Hakone to Kyoto by Bullet Train",
        subtitle: "The Imperial Capital Awaits",
        activities: [
          "Morning Shinkansen bullet train ride at 300 km/h to Kyoto",
          "Visit the golden pavilion Kinkaku-ji reflecting on mirror pond",
          "Stroll through the whispering Arashiyama Bamboo Grove",
          "Evening walking tour through Gion geisha district",
          "Overnight in Kyoto"
        ]
      },
      {
        day: 5,
        title: "Spiritual Kyoto & Tea Tradition",
        subtitle: "Torii Gates & Zen Masters",
        activities: [
          "Early morning exploration of Fushimi Inari-taisha torii gate paths",
          "Participate in a private, authentic matcha tea ceremony with master",
          "Visit Kiyomizu-dera temple overlooking Kyoto city",
          "Overnight in Kyoto"
        ]
      },
      {
        day: 6,
        title: "Kyoto – Nara Deer Park – Osaka",
        subtitle: "Friendly Deer & Culinary Capital",
        activities: [
          "Morning excursion to Nara: bow with sacred free-roaming deer",
          "Marvel at Todai-ji temple and the Great Bronze Buddha",
          "Afternoon transfer to vibrant Osaka",
          "Evening street food safari in Dotonbori (Takoyaki, Okonomiyaki)",
          "Overnight in Osaka"
        ]
      },
      {
        day: 7,
        title: "Osaka Castle & Universal Studios Japan",
        subtitle: "History Meets Super Nintendo World",
        activities: [
          "Explore the historic grounds of Osaka Castle",
          "Full-day VIP access to Universal Studios Japan & Super Nintendo World",
          "Overnight in Osaka"
        ]
      },
      {
        day: 8,
        title: "Hiroshima & Miyajima Island Excursion",
        subtitle: "Floating Torii & Peace Memorial",
        activities: [
          "Bullet train day trip to Hiroshima Peace Memorial Park & Museum",
          "Ferry to sacred Miyajima Island to witness the iconic Floating Torii Gate",
          "Return to Osaka for farewell dinner",
          "Overnight in Osaka"
        ]
      },
      {
        day: 9,
        title: "Sayonara Japan",
        subtitle: "Departure",
        activities: [
          "Leisure morning shopping in Umeda & Shinsaibashi",
          "Private transfer to Kansai International Airport (KIX)",
          "Board your flight home with cherished memories"
        ]
      }
    ],
    inclusions: [
      "8 Nights accommodation in 5-star hotels & authentic luxury Ryokan",
      "Daily Japanese/Western gourmet buffet breakfast",
      "Unlimited 7-Day Japan Rail (JR) Bullet Train Pass",
      "Private airport transfers and English-speaking tour guides",
      "All temple, museum, and theme park entry vouchers",
      "Authentic Kaiseki dinner in Hakone"
    ],
    exclusions: [
      "International airfare",
      "Japan tourist e-visa fees",
      "Personal expenses and porterage",
      "Travel insurance"
    ],
    travelTips: [
      "Best Time: Spring (Cherry Blossoms in Mar-Apr) or Autumn (Foliage in Oct-Nov).",
      "Currency: Japanese Yen (JPY). Cash is still preferred in small shops; 7-Eleven ATMs work with foreign cards.",
      "Tipping: There is no tipping culture in Japan; exceptional service is standard!"
    ]
  },
  {
    id: "honeymoon-swiss",
    title: "Romantic Switzerland Hideaway",
    category: "Honeymoon",
    rating: 5.0,
    duration: "8 Days / 7 Nights",
    destinations: "Zurich • Interlaken • Lucerne • Zermatt",
    price: "₹1,99,999",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1000&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1800&auto=format&fit=crop",
    features: [
      "1st Class Swiss Travel Rail Pass",
      "Private mountain picnic at Matterhorn",
      "Boutique alpine spa resort stays",
      "Sunset Lake Lucerne dinner cruise"
    ],
    overview: "A dream honeymoon amidst snow-capped peaks, crystal alpine lakes, and fairytale Swiss villages. Experience the pinnacle of romance in Zurich, Interlaken, Lucerne, and car-free Zermatt.",
    highlights: [
      "First-class unlimited rail travel across the world's most scenic network",
      "Excursion to Jungfraujoch – Top of Europe at 3,454m altitude",
      "Romantic cable car ride to Matterhorn Glacier Paradise in Zermatt",
      "Private champagne cruise across Lake Lucerne",
      "Indulgent Swiss fondue and Swiss chocolate workshop"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive in Zurich – Old Town Romance",
        subtitle: "Lakeside Elegance",
        activities: [
          "Arrive at Zurich Airport and board scenic train to city center",
          "Romantic stroll along Lake Zurich and Bahnhofstrasse",
          "Welcome Swiss chocolate tasting experience",
          "Overnight in Zurich"
        ]
      },
      {
        day: 2,
        title: "Zurich to Lucerne & Mount Titlis",
        subtitle: "Glaciers & Revolving Cable Cars",
        activities: [
          "Scenic train ride to picturesque Lucerne",
          "Ascend Mt. Titlis in the world's first revolving cable car",
          "Walk across the Titlis Cliff Walk suspension bridge",
          "Evening romantic walk across Chapel Bridge",
          "Overnight in Lucerne"
        ]
      },
      {
        day: 3,
        title: "Lake Lucerne to Interlaken",
        subtitle: "Between Two Turquoise Lakes",
        activities: [
          "Board the Luzern-Interlaken Express scenic train",
          "Check in to luxury alpine resort in Interlaken",
          "Sunset boat cruise on Lake Brienz",
          "Overnight in Interlaken"
        ]
      },
      {
        day: 4,
        title: "Jungfraujoch – Top of Europe",
        subtitle: "Eternal Snow & Ice Palace",
        activities: [
          "Ride the Eiger Express gondola and cogwheel train to 3,454m",
          "Explore the Ice Palace and Sphinx Observation Terrace",
          "Breathtaking views of the Aletsch Glacier (UNESCO site)",
          "Romantic mountain lunch overlooking the peaks",
          "Overnight in Interlaken"
        ]
      },
      {
        day: 5,
        title: "Interlaken to Zermatt – Matterhorn Majesty",
        subtitle: "Car-Free Alpine Paradise",
        activities: [
          "Travel south by panoramic train to car-free Zermatt",
          "Marvel at the iconic triangular silhouette of the Matterhorn",
          "Horse-drawn carriage ride through cobblestone streets",
          "Overnight in Zermatt"
        ]
      },
      {
        day: 6,
        title: "Gornergrat Cogwheel Train & Glacier Walk",
        subtitle: "The Most Scenic Vista in the Alps",
        activities: [
          "Ride Europe's highest open-air cogwheel train to Gornergrat (3,089m)",
          "Reflect the Matterhorn in the pristine waters of Riffelsee lake",
          "Private picnic hamper with Swiss cheeses and wine",
          "Evening couple's spa treatment at alpine wellness hotel",
          "Overnight in Zermatt"
        ]
      },
      {
        day: 7,
        title: "Zermatt to Zurich via Glacier Express Route",
        subtitle: "Grand Farewell",
        activities: [
          "Scenic rail journey back to Zurich",
          "Farewell candlelight dinner overlooking the Limmat river",
          "Overnight in Zurich"
        ]
      },
      {
        day: 8,
        title: "Departure from Zurich",
        subtitle: "Fond Memories of Switzerland",
        activities: [
          "Breakfast with views of Zurich lake",
          "Transfer to Zurich International Airport for return flight"
        ]
      }
    ],
    inclusions: [
      "7 Nights in luxury 4-star & 5-star boutique honeymoon suites",
      "Daily Swiss breakfast buffet",
      "8-Day 1st Class Swiss Travel Rail Pass",
      "Excursion tickets to Jungfraujoch and Mount Titlis",
      "Gornergrat cogwheel train tickets in Zermatt",
      "Sunset Lake Lucerne romantic cruise",
      "Bottle of champagne and fruit basket in hotel upon arrival"
    ],
    exclusions: [
      "International airfare",
      "Schengen Visa fees",
      "Personal meals and activities not listed"
    ],
    travelTips: [
      "Best Time: June to September for green meadows, or December to March for romantic winter wonderland.",
      "Visa: Requires a Schengen Visa. Apply 2-3 months in advance.",
      "Currency: Swiss Franc (CHF). Cards are accepted everywhere."
    ]
  },
  {
    id: "family-dubai",
    title: "Dubai & Abu Dhabi Discovery",
    category: "Family",
    rating: 4.7,
    duration: "6 Days / 5 Nights",
    destinations: "Dubai Downtown • Palm Jumeirah • Yas Island",
    price: "₹74,999",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1800&auto=format&fit=crop",
    features: [
      "Burj Khalifa 124th & 125th Floor VIP entry",
      "Desert safari with 4x4 dune bashing & BBQ",
      "Ferrari World or Warner Bros park passes",
      "Luxury private yacht marina cruise"
    ],
    overview: "The ultimate family getaway to the jewel of the Middle East. Featuring world-record attractions, thrilling theme parks, golden desert dunes, and futuristic luxury.",
    highlights: [
      "Stand on top of the world at Burj Khalifa observation decks",
      "Adrenaline-pumping desert dune bashing, camel rides & belly dance show",
      "Full-day pass to Yas Island Abu Dhabi (Ferrari World / Warner Bros)",
      "Tour the magnificent Sheikh Zayed Grand Mosque in Abu Dhabi",
      "Private luxury marina sunset cruise"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive in Dubai & Marina Dhow Cruise",
        subtitle: "Welcome to Dubai",
        activities: [
          "Meet & greet at Dubai International Airport with private transfer",
          "Check in to 5-star hotel in Dubai Downtown / Marina",
          "Evening luxury Marina Dhow Cruise with international buffet dinner",
          "Overnight in Dubai"
        ]
      },
      {
        day: 2,
        title: "Dubai City Tour & Burj Khalifa",
        subtitle: "Heritage & Heights",
        activities: [
          "Half-day city tour: Dubai Frame, Jumeirah Mosque, and Burj Al Arab photo stop",
          "Visit Dubai Mall & watch the mesmerizing Dubai Fountain show",
          "Ascend to Burj Khalifa 124th & 125th floor for 360-degree sunset views",
          "Overnight in Dubai"
        ]
      },
      {
        day: 3,
        title: "Desert Safari Extravaganza",
        subtitle: "Golden Sands & Arab Nights",
        activities: [
          "Morning at leisure for shopping or beach relaxing",
          "Afternoon pickup in 4x4 Land Cruisers for thrilling dune bashing",
          "Camel rides, sandboarding, and henna painting at Bedouin camp",
          "Lavish BBQ dinner buffet with live Tanoura and fire dance performances",
          "Overnight in Dubai"
        ]
      },
      {
        day: 4,
        title: "Full Day Abu Dhabi & Theme Park Excursion",
        subtitle: "Grand Mosque & World-Class Thrills",
        activities: [
          "Scenic drive to Abu Dhabi capital",
          "Guided tour of the architectural masterpiece: Sheikh Zayed Grand Mosque",
          "Visit Yas Island and enjoy full-day pass to Ferrari World or Warner Bros",
          "Drive along Abu Dhabi Corniche",
          "Return to Dubai for overnight stay"
        ]
      },
      {
        day: 5,
        title: "Museum of the Future & Aquaventure Waterpark",
        subtitle: "Wonder & Water Splashes",
        activities: [
          "Morning visit to the iconic Museum of the Future",
          "Afternoon thrilling rides at Atlantis Aquaventure Waterpark & Lost Chambers Aquarium",
          "Overnight in Dubai"
        ]
      },
      {
        day: 6,
        title: "Souk Shopping & Departure",
        subtitle: "Farewell Dubai",
        activities: [
          "Explore the historic Gold & Spice Souks across Dubai Creek by Abra boat",
          "Last-minute luxury shopping",
          "Private transfer to Dubai International Airport for return flight"
        ]
      }
    ],
    inclusions: [
      "5 Nights 5-star hotel stay in Dubai",
      "Daily breakfast buffet",
      "Airport transfers in private AC vehicle",
      "Burj Khalifa 124/125th floor tickets",
      "Desert Safari with 4x4 dune bashing, BBQ dinner & shows",
      "Abu Dhabi day tour with Grand Mosque & 1 Theme Park entry",
      "Dubai Marina Dhow Cruise with dinner"
    ],
    exclusions: [
      "International flight tickets",
      "Dubai tourist visa & Tourism Dirham tax (paid directly to hotel)",
      "Meals not specified in inclusions"
    ],
    travelTips: [
      "Best Time: November to March has pleasant 24°C–28°C weather.",
      "Dress Code: Modest clothing is required when visiting religious sites like Sheikh Zayed Mosque (arms & legs covered, headscarf for women).",
      "Visa: 30-day tourist e-visa is processed quickly within 48-72 hours."
    ]
  },
  {
    id: "luxury-maldives",
    title: "Overwater Villa Retreat",
    category: "Luxury",
    rating: 4.9,
    duration: "5 Days / 4 Nights",
    destinations: "Private Island Resort • North Malé Atoll",
    price: "₹99,999",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1800&auto=format&fit=crop",
    features: [
      "Overwater villa with direct ocean access",
      "All-Inclusive gourmet dining & premium beverages",
      "Speedboat / Seaplane scenic transfers",
      "Sunset dolphin cruise with champagne"
    ],
    overview: "Pure tropical paradise in the Indian Ocean. Step directly from your private overwater villa into crystal-clear turquoise lagoons filled with colorful coral reefs and exotic marine life.",
    highlights: [
      "Private overwater bungalow with glass floor viewing panels & sun deck",
      "All-inclusive dining with world cuisine, cocktails, and mocktails",
      "Sunset cruise spotting spinner dolphins playing in ocean waves",
      "Guided reef snorkeling safari with sea turtles and manta rays",
      "Romantic 3-course private beach candlelit dinner under the stars"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Malé & Island Speedboat Transfer",
        subtitle: "Welcome to Paradise",
        activities: [
          "Arrive at Velana International Airport (Malé)",
          "Warm resort welcome and scenic speedboat ride across azure waters to private island",
          "Check in to your breathtaking private Overwater Villa",
          "Sunset tropical cocktail on your private sun deck",
          "Overnight in Maldives"
        ]
      },
      {
        day: 2,
        title: "Snorkeling Safari & Lagoon Bliss",
        subtitle: "Discover Underwater Wonders",
        activities: [
          "Floating breakfast in your private plunge pool (optional)",
          "Guided house reef snorkeling tour to see colorful corals and tropical fish",
          "Afternoon kayaking and stand-up paddleboarding in calm turquoise lagoon",
          "Gourmet international buffet dinner",
          "Overnight in Maldives"
        ]
      },
      {
        day: 3,
        title: "Sunset Dolphin Cruise & Beachside Dining",
        subtitle: "Magic on the Ocean",
        activities: [
          "Morning relaxing spa massage overlooking ocean waves",
          "Afternoon leisure on powdered white sand beaches",
          "Late afternoon luxury cruise into the sunset with spinner dolphins",
          "Romantic beach barbecue dinner",
          "Overnight in Maldives"
        ]
      },
      {
        day: 4,
        title: "Water Sports & Stargazing",
        subtitle: "Tropical Adventures",
        activities: [
          "Jet ski tour or parasailing high above the atolls (optional)",
          "Bespoke cooking demonstration with executive island chef",
          "Relax at the infinity pool with panoramic ocean horizon views",
          "Overnight in Maldives"
        ]
      },
      {
        day: 5,
        title: "Farewell Maldives",
        subtitle: "Until We Meet Again",
        activities: [
          "Sumptuous breakfast over the water",
          "Speedboat transfer back to Malé International Airport for your departure flight"
        ]
      }
    ],
    inclusions: [
      "4 Nights in luxury Overwater Villa with ocean plunge pool",
      "All-Inclusive meal plan (Breakfast, Lunch, Dinner, Snacks & Drinks)",
      "Return speedboat / seaplane transfers from Malé Airport",
      "Complimentary snorkeling gear and non-motorized water sports",
      "Sunset Dolphin Cruise excursion",
      "All Maldivian Green Tax and service charges"
    ],
    exclusions: [
      "International flight tickets",
      "Motorized water sports (Jet Ski, Parasailing)",
      "Personal laundry and premium cellar wines"
    ],
    travelTips: [
      "Visa: Free 30-day tourist visa granted upon arrival for all nationalities.",
      "Best Time: November to April offers crystal-clear calm seas and maximum sunshine.",
      "Packing: High SPF sunscreen, sunglasses, swimwear, and underwater phone pouch!"
    ]
  }
];

