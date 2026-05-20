export type TransportMode = "plane" | "train" | "bus" | "boat";

export type TravelPhoto = {
  src: string;
  caption: string;
  date?: string;
};

export type Visit = {
  id: string;
  label: string;
  photos: TravelPhoto[];
};

export type Location = {
  id: string;
  name: string;
  country: string;
  region: string;
  coords: [number, number];
  coverPhoto?: string;
  coverCaption?: string;
  visitMonth: string;
  visits: Visit[];
};

export type RouteSegment = {
  id: string;
  origin: string;
  destination: string;
  mode: TransportMode;
  month?: string;
};

export type Journey = {
  id: string;
  title: string;
  startMonth: string;
  endMonth: string;
  countries: string[];
  segments: string[];
  notes?: string;
};

export const MODE_STYLES: Record<TransportMode, { label: string; color: string }> = {
  plane: { label: "Plane", color: "#6EA8FE" },
  train: { label: "Train", color: "#4DD4AC" },
  bus: { label: "Bus", color: "#F59E6B" },
  boat: { label: "Boat", color: "#7DD3FC" },
};

export const LOCATIONS: Location[] = [
  {
    id: "washington-dc",
    name: "Washington, DC",
    country: "United States",
    region: "North America",
    coords: [-77.0369, 38.9072],
    visitMonth: "Home base",
    visits: [{ id: "washington-dc-home", label: "Home base", photos: [] }],
  },
  {
    id: "louisville",
    name: "Louisville",
    country: "United States",
    region: "North America",
    coords: [-85.7585, 38.2527],
    coverPhoto: "/photos/Louisville/1-30-26-salamanca.jpg",
    coverCaption: "Louisville memory",
    visitMonth: "Jan 2026",
    visits: [
      {
        id: "louisville-2026",
        label: "Jan 2026",
        photos: [
          {
            src: "/photos/Louisville/1-30-26-salamanca.jpg",
            caption: "Louisville memory",
            date: "Jan 2026",
          },
        ],
      },
    ],
  },
  {
    id: "madrid",
    name: "Madrid",
    country: "Spain",
    region: "Europe",
    coords: [-3.7038, 40.4168],
    coverPhoto: "/photos/Madrid/atletico-game.jpg",
    coverCaption: "Atletico Madrid match",
    visitMonth: "Study abroad",
    visits: [
      {
        id: "madrid-study-abroad",
        label: "Study abroad",
        photos: [
          {
            src: "/photos/Madrid/atletico-game.jpg",
            caption: "Atletico Madrid v Bodo Glimt",
          },
        ],
      },
    ],
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    region: "Europe",
    coords: [2.1734, 41.3851],
    visitMonth: "Summer 2023",
    visits: [{ id: "barcelona-2023", label: "Summer 2023", photos: [] }],
  },
  {
    id: "marseille",
    name: "Marseille",
    country: "France",
    region: "Europe",
    coords: [5.3698, 43.2965],
    visitMonth: "Summer 2023",
    visits: [{ id: "marseille-2023", label: "Summer 2023", photos: [] }],
  },
  {
    id: "nice",
    name: "Nice",
    country: "France",
    region: "Europe",
    coords: [7.262, 43.7102],
    visitMonth: "Summer 2023",
    visits: [{ id: "nice-2023", label: "Summer 2023", photos: [] }],
  },
  {
    id: "bolzano",
    name: "Bolzano",
    country: "Italy",
    region: "Europe",
    coords: [11.3548, 46.4983],
    visitMonth: "Summer 2023",
    visits: [{ id: "bolzano-2023", label: "Summer 2023", photos: [] }],
  },
  {
    id: "venice",
    name: "Venice",
    country: "Italy",
    region: "Europe",
    coords: [12.3155, 45.4408],
    visitMonth: "Summer 2023",
    visits: [{ id: "venice-2023", label: "Summer 2023", photos: [] }],
  },
  {
    id: "ljubljana",
    name: "Ljubljana",
    country: "Slovenia",
    region: "Europe",
    coords: [14.5058, 46.0569],
    visitMonth: "Summer 2023",
    visits: [{ id: "ljubljana-2023", label: "Summer 2023", photos: [] }],
  },
  {
    id: "lake-bled",
    name: "Lake Bled",
    country: "Slovenia",
    region: "Europe",
    coords: [14.0946, 46.3632],
    visitMonth: "Summer 2023",
    visits: [{ id: "lake-bled-2023", label: "Summer 2023", photos: [] }],
  },
  {
    id: "zagreb",
    name: "Zagreb",
    country: "Croatia",
    region: "Europe",
    coords: [15.9819, 45.815],
    visitMonth: "Summer 2023",
    visits: [{ id: "zagreb-2023", label: "Summer 2023", photos: [] }],
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    region: "Europe",
    coords: [-0.1276, 51.5072],
    visitMonth: "Europe",
    visits: [{ id: "london-europe", label: "Europe", photos: [] }],
  },
  {
    id: "edinburgh",
    name: "Edinburgh",
    country: "United Kingdom",
    region: "Europe",
    coords: [-3.1883, 55.9533],
    visitMonth: "Europe",
    visits: [{ id: "edinburgh-europe", label: "Europe", photos: [] }],
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    region: "Europe",
    coords: [2.3522, 48.8566],
    visitMonth: "Europe",
    visits: [{ id: "paris-europe", label: "Europe", photos: [] }],
  },
  {
    id: "budapest",
    name: "Budapest",
    country: "Hungary",
    region: "Europe",
    coords: [19.0402, 47.4979],
    visitMonth: "Study abroad",
    visits: [{ id: "budapest-study-abroad", label: "Study abroad", photos: [] }],
  },
  {
    id: "buenos-aires",
    name: "Buenos Aires",
    country: "Argentina",
    region: "South America",
    coords: [-58.3816, -34.6037],
    visitMonth: "Dec 2024",
    visits: [{ id: "buenos-aires-2024", label: "Dec 2024", photos: [] }],
  },
  {
    id: "santiago",
    name: "Santiago",
    country: "Chile",
    region: "South America",
    coords: [-70.6693, -33.4489],
    visitMonth: "Jan 2025",
    visits: [{ id: "santiago-2025", label: "Jan 2025", photos: [] }],
  },
  {
    id: "montevideo",
    name: "Montevideo",
    country: "Uruguay",
    region: "South America",
    coords: [-56.1645, -34.9011],
    visitMonth: "Jan 2025",
    visits: [{ id: "montevideo-2025", label: "Jan 2025", photos: [] }],
  },
  {
    id: "lima",
    name: "Lima",
    country: "Peru",
    region: "South America",
    coords: [-77.0428, -12.0464],
    visitMonth: "May 2025",
    visits: [{ id: "lima-2025", label: "May 2025", photos: [] }],
  },
  {
    id: "cusco",
    name: "Cusco",
    country: "Peru",
    region: "South America",
    coords: [-71.9675, -13.5319],
    visitMonth: "May 2025",
    visits: [{ id: "cusco-2025", label: "May 2025", photos: [] }],
  },
  {
    id: "arequipa",
    name: "Arequipa",
    country: "Peru",
    region: "South America",
    coords: [-71.5375, -16.409],
    visitMonth: "May 2025",
    visits: [{ id: "arequipa-2025", label: "May 2025", photos: [] }],
  },
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    region: "Southeast Asia",
    coords: [100.5018, 13.7563],
    visitMonth: "Summer 2024",
    visits: [{ id: "bangkok-2024", label: "Summer 2024", photos: [] }],
  },
  {
    id: "siem-reap",
    name: "Siem Reap",
    country: "Cambodia",
    region: "Southeast Asia",
    coords: [103.8564, 13.3633],
    visitMonth: "Summer 2024",
    visits: [{ id: "siem-reap-2024", label: "Summer 2024", photos: [] }],
  },
  {
    id: "phnom-penh",
    name: "Phnom Penh",
    country: "Cambodia",
    region: "Southeast Asia",
    coords: [104.9282, 11.5564],
    visitMonth: "Summer 2024",
    visits: [{ id: "phnom-penh-2024", label: "Summer 2024", photos: [] }],
  },
  {
    id: "ho-chi-minh-city",
    name: "Ho Chi Minh City",
    country: "Vietnam",
    region: "Southeast Asia",
    coords: [106.6297, 10.8231],
    visitMonth: "Summer 2024",
    visits: [{ id: "ho-chi-minh-city-2024", label: "Summer 2024", photos: [] }],
  },
  {
    id: "ninh-binh",
    name: "Ninh Binh",
    country: "Vietnam",
    region: "Southeast Asia",
    coords: [105.9745, 20.2506],
    visitMonth: "Summer 2024",
    visits: [{ id: "ninh-binh-2024", label: "Summer 2024", photos: [] }],
  },
  {
    id: "hoi-an",
    name: "Hoi An",
    country: "Vietnam",
    region: "Southeast Asia",
    coords: [108.338, 15.8801],
    visitMonth: "Summer 2024",
    visits: [{ id: "hoi-an-2024", label: "Summer 2024", photos: [] }],
  },
  {
    id: "hanoi",
    name: "Hanoi",
    country: "Vietnam",
    region: "Southeast Asia",
    coords: [105.8342, 21.0278],
    visitMonth: "Summer 2024",
    visits: [{ id: "hanoi-2024", label: "Summer 2024", photos: [] }],
  },
];

export const ROUTE_SEGMENTS: RouteSegment[] = [
  { id: "dc-buenos-aires", origin: "washington-dc", destination: "buenos-aires", mode: "plane", month: "Dec 2024" },
  { id: "buenos-aires-santiago", origin: "buenos-aires", destination: "santiago", mode: "plane", month: "Jan 2025" },
  { id: "buenos-aires-montevideo", origin: "buenos-aires", destination: "montevideo", mode: "boat", month: "Jan 2025" },
  { id: "louisville-lima", origin: "louisville", destination: "lima", mode: "plane", month: "May 2025" },
  { id: "lima-cusco", origin: "lima", destination: "cusco", mode: "plane", month: "May 2025" },
  { id: "cusco-arequipa", origin: "cusco", destination: "arequipa", mode: "bus", month: "May 2025" },
  { id: "dc-madrid", origin: "washington-dc", destination: "madrid", mode: "plane", month: "Study abroad" },
  { id: "madrid-budapest", origin: "madrid", destination: "budapest", mode: "plane", month: "Study abroad" },
  { id: "madrid-edinburgh", origin: "madrid", destination: "edinburgh", mode: "plane", month: "Study abroad" },
  { id: "dc-barcelona", origin: "washington-dc", destination: "barcelona", mode: "plane", month: "Summer 2023" },
  { id: "barcelona-marseille", origin: "barcelona", destination: "marseille", mode: "train", month: "Summer 2023" },
  { id: "marseille-nice", origin: "marseille", destination: "nice", mode: "train", month: "Summer 2023" },
  { id: "nice-bolzano", origin: "nice", destination: "bolzano", mode: "train", month: "Summer 2023" },
  { id: "bolzano-venice", origin: "bolzano", destination: "venice", mode: "train", month: "Summer 2023" },
  { id: "venice-ljubljana", origin: "venice", destination: "ljubljana", mode: "train", month: "Summer 2023" },
  { id: "ljubljana-lake-bled", origin: "ljubljana", destination: "lake-bled", mode: "train", month: "Summer 2023" },
  { id: "ljubljana-zagreb", origin: "ljubljana", destination: "zagreb", mode: "train", month: "Summer 2023" },
  { id: "zagreb-dc", origin: "zagreb", destination: "washington-dc", mode: "plane", month: "Summer 2023" },
  { id: "dc-london", origin: "washington-dc", destination: "london", mode: "plane" },
  { id: "london-edinburgh", origin: "london", destination: "edinburgh", mode: "train" },
  { id: "dc-paris", origin: "washington-dc", destination: "paris", mode: "plane" },
  { id: "dc-bangkok", origin: "washington-dc", destination: "bangkok", mode: "plane", month: "Summer 2024" },
  { id: "bangkok-siem-reap", origin: "bangkok", destination: "siem-reap", mode: "plane", month: "Summer 2024" },
  { id: "siem-reap-phnom-penh", origin: "siem-reap", destination: "phnom-penh", mode: "bus", month: "Summer 2024" },
  { id: "phnom-penh-ho-chi-minh-city", origin: "phnom-penh", destination: "ho-chi-minh-city", mode: "bus", month: "Summer 2024" },
  { id: "ho-chi-minh-city-hoi-an", origin: "ho-chi-minh-city", destination: "hoi-an", mode: "plane", month: "Summer 2024" },
  { id: "hoi-an-ninh-binh", origin: "hoi-an", destination: "ninh-binh", mode: "bus", month: "Summer 2024" },
  { id: "ninh-binh-hanoi", origin: "ninh-binh", destination: "hanoi", mode: "bus", month: "Summer 2024" },
  { id: "hanoi-dc", origin: "hanoi", destination: "washington-dc", mode: "plane", month: "Summer 2024" },
];

export const JOURNEYS: Journey[] = [
  {
    id: "south-america-new-year",
    title: "South America New Year",
    startMonth: "Dec 2024",
    endMonth: "Jan 2025",
    countries: ["Argentina", "Chile", "Uruguay"],
    segments: ["dc-buenos-aires", "buenos-aires-santiago", "buenos-aires-montevideo"],
  },
  {
    id: "peru-2025",
    title: "Peru and Machu Picchu",
    startMonth: "May 2025",
    endMonth: "May 2025",
    countries: ["Peru"],
    segments: ["louisville-lima", "lima-cusco", "cusco-arequipa"],
  },
  {
    id: "europe-summer-2023",
    title: "Europe Summer 2023",
    startMonth: "Summer 2023",
    endMonth: "Summer 2023",
    countries: ["Spain", "France", "Italy", "Slovenia", "Croatia"],
    segments: [
      "dc-barcelona",
      "barcelona-marseille",
      "marseille-nice",
      "nice-bolzano",
      "bolzano-venice",
      "venice-ljubljana",
      "ljubljana-lake-bled",
      "ljubljana-zagreb",
      "zagreb-dc",
    ],
  },
  {
    id: "southeast-asia-2024",
    title: "Southeast Asia Summer 2024",
    startMonth: "Summer 2024",
    endMonth: "Summer 2024",
    countries: ["Thailand", "Cambodia", "Vietnam"],
    segments: [
      "dc-bangkok",
      "bangkok-siem-reap",
      "siem-reap-phnom-penh",
      "phnom-penh-ho-chi-minh-city",
      "ho-chi-minh-city-hoi-an",
      "hoi-an-ninh-binh",
      "ninh-binh-hanoi",
      "hanoi-dc",
    ],
  },
];

export const LOCATION_BY_ID = Object.fromEntries(LOCATIONS.map((location) => [location.id, location]));
