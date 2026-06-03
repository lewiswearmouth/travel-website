export type TravelPhoto = {
  src: string;
  caption: string;
  date?: string;
};

export type Location = {
  id: string;
  name: string;
  country: string;
  region: string;
  coords: [number, number];
  coverPhoto?: string;
  coverCaption?: string;
  photos: TravelPhoto[];
};

export type TransportMode = "plane" | "train" | "road" | "boat";

export type RouteSegment = {
  id: string;
  origin: string;
  destination: string;
  mode: TransportMode;
  month?: string;
};

export const MODE_STYLES: Record<TransportMode, { label: string; color: string }> = {
  plane: { label: "Plane", color: "#6EA8FE" },
  train: { label: "Train", color: "#4DD4AC" },
  road: { label: "Road", color: "#F59E6B" },
  boat: { label: "Boat", color: "#ba4ddc" },
};

export const LOCATIONS: Location[] = [
  {
    id: "washington-dc",
    name: "Washington, DC",
    country: "United States",
    region: "North America",
    coords: [-77.0369, 38.9072],
    photos: [],
    coverPhoto: "/photos/united-states/IMG_0575.jpg"
  },
  {
    id: "louisville",
    name: "Louisville",
    country: "United States",
    region: "North America",
    coords: [-85.7585, 38.2527],
    photos: [],
    coverPhoto: "/photos/united-states/IMG_3201.jpg"
  },
  {
    id: "chicago",
    name: "Chicago",
    country: "United States",
    region: "North America",
    coords: [-87.6298, 41.8781],
    photos: [],
    coverPhoto: "/photos/united-states/IMG_5651.jpg"
  },
  {
    id: "ann-arbor",
    name: "Ann Arbor",
    country: "United States",
    region: "North America",
    coords: [-83.743, 42.2808],
    photos: [],
    coverPhoto: "/photos/united-states/72083291276__5CCED1D6-43AD-4D60-8102-4772A4EB8CAC.jpg"
  },
  {
    id: "indiana-dunes",
    name: "Indiana Dunes",
    country: "United States",
    region: "North America",
    coords: [-87.0965, 41.6533],
    photos: [],
    coverPhoto: "/photos/united-states/dji_fly_20231103_133450_994_1699036570414_timed.jpg"
  },
  {
    id: "west-lafayette",
    name: "West Lafayette",
    country: "United States",
    region: "North America",
    coords: [-86.9081, 40.4259],
    photos: [],
    coverPhoto: "/photos/united-states/IMG_1261.jpg"
  },
  {
    id: "seattle",
    name: "Seattle",
    country: "United States",
    region: "North America",
    coords: [-122.3321, 47.6062],
    photos: [],
    coverPhoto: "/photos/united-states/IMG_3039.jpg"
  },
  {
    id: "san-francisco",
    name: "San Francisco",
    country: "United States",
    region: "North America",
    coords: [-122.4194, 37.7749],
    photos: [],
    coverPhoto: "/photos/united-states/IMG_0330.jpg"
  },
  {
    id: "yosemite",
    name: "Yosemite",
    country: "United States",
    region: "North America",
    coords: [-119.5383, 37.8651],
    photos: [],
    coverPhoto: "/photos/united-states/IMG_1051.jpg"
  },
  {
    id: "maui",
    name: "Maui",
    country: "United States",
    region: "North America",
    coords: [-156.3319, 20.7984],
    photos: [],
    coverPhoto: "/photos/united-states/RemoteMediaFile_6553650_0_2021_06_27_13_20_40.jpg"
  },
  {
    id: "oahu",
    name: "Oahu",
    country: "United States",
    region: "North America",
    coords: [-157.8583, 21.3099],
    photos: [],
  },
  {
    id: "philadelphia",
    name: "Philadelphia",
    country: "United States",
    region: "North America",
    coords: [-75.1652, 39.9526],
    photos: [],
    coverPhoto: "/photos/united-states/RemoteMediaFile_6553934_0_2021_11_27_06_51_00.jpg"
  },
  {
    id: "nashville",
    name: "Nashville",
    country: "United States",
    region: "North America",
    coords: [-86.7816, 36.1627],
    photos: [],
    coverPhoto: "/photos/united-states/IMG_8437.jpg"
  },
  {
    id: "san-juan",
    name: "San Juan",
    country: "United States",
    region: "North America",
    coords: [-66.1057, 18.4655],
    photos: [],
    coverPhoto: "/photos/united-states/IMG_0921.jpg"
  },
  {
    id: "boston",
    name: "Boston",
    country: "United States",
    region: "North America",
    coords: [-71.0589, 42.3601],
    photos: [],
    coverPhoto: "/photos/united-states/IMG_5601.jpg"
  },
  {
    id: "castine",
    name: "Castine",
    country: "United States",
    region: "North America",
    coords: [-68.7998, 44.3879],
    photos: [],
    coverPhoto: "/photos/united-states/IMG_5333.jpg"
  },
  {
    id: "corolla",
    name: "Corolla",
    country: "United States",
    region: "North America",
    coords: [-75.8308, 36.3807],
    photos: [],
    coverPhoto: "/photos/united-states/IMG_5440.png"
  },
  {
    id: "hanover-nh",
    name: "Hanover, NH",
    country: "United States",
    region: "North America",
    coords: [-72.2896, 43.7022],
    photos: [],
    coverPhoto: "/photos/united-states/IMG_5102.jpg"
  },
  {
    id: "deep-creek",
    name: "Deep Creek",
    country: "United States",
    region: "North America",
    coords: [-79.3817, 39.4926],
    photos: [],
    coverPhoto: "/photos/united-states/dji_fly_20240731_200814_102_1722470922598_photo_optimized.jpg"
  },
  {
    id: "north-conway",
    name: "North Conway",
    country: "United States",
    region: "North America",
    coords: [-71.1284, 44.0537],
    photos: [],
    coverPhoto: "/photos/united-states/IMG_1914.jpg"
  },
  {
    id: "white-mountains",
    name: "White Mountains",
    country: "United States",
    region: "North America",
    coords: [-71.3176, 44.2584],
    photos: [],
    coverPhoto: "/photos/united-states/IMG_3116.jpg"
  },
  {
    id: "new-paltz",
    name: "New Paltz",
    country: "United States",
    region: "North America",
    coords: [-74.0868, 41.7476],
    photos: [],
    coverPhoto: "/photos/united-states/dji_fly_20230404_133726_603_1680630112172_photo_optimized.jpg"
  },
  {
    id: "blacksburg",
    name: "Blacksburg",
    country: "United States",
    region: "North America",
    coords: [-80.4139, 37.2296],
    photos: [],
    coverPhoto: "/photos/united-states/RemoteMediaFile_6553986_0_2022_01_31_07_04_00.jpg"
  },
  {
    id: "madrid",
    name: "Madrid",
    country: "Spain",
    region: "Europe",
    coords: [-3.7038, 40.4168],
    photos: [],
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    region: "Europe",
    coords: [2.1734, 41.3851],
    photos: [],
    coverPhoto: "/photos/spain/IMG_5603.jpg"
  },
  {
    id: "bilbao",
    name: "Bilbao",
    country: "Spain",
    region: "Europe",
    coords: [-2.935, 43.263],
    photos: [],
  },
  {
    id: "salamanca",
    name: "Salamanca",
    country: "Spain",
    region: "Europe",
    coords: [-5.6635, 40.9701],
    photos: [],
  },
  {
    id: "segovia",
    name: "Segovia",
    country: "Spain",
    region: "Europe",
    coords: [-4.1088, 40.9429],
    photos: [],
  },
  {
    id: "toledo",
    name: "Toledo",
    country: "Spain",
    region: "Europe",
    coords: [-4.0273, 39.8628],
    photos: [],
  },
  {
    id: "marseille",
    name: "Marseille",
    country: "France",
    region: "Europe",
    coords: [5.3698, 43.2965],
    photos: [],
    coverPhoto: "/photos/france/dji_fly_20230707_141654_622_1688735290892_photo_optimized.jpg"
  },
  {
    id: "antibes",
    name: "Antibes",
    country: "France",
    region: "Europe",
    coords: [7.1251, 43.5804],
    photos: [],
    coverPhoto: "/photos/france/IMG_0688.jpg"
  },
  {
    id: "bolzano",
    name: "Bolzano",
    country: "Italy",
    region: "Europe",
    coords: [11.3548, 46.4983],
    photos: [],
    coverPhoto: "/photos/italy/IMG_5949.jpg"
  },
  {
    id: "dolomites",
    name: "Dolomites",
    country: "Italy",
    region: "Europe",
    coords: [11.85, 46.4102],
    photos: [],
    coverPhoto: "/photos/italy/IMG_0992.jpg"
  },
  {
    id: "venice",
    name: "Venice",
    country: "Italy",
    region: "Europe",
    coords: [12.3155, 45.4408],
    photos: [],
    coverPhoto: "/photos/italy/IMG_6150.jpg"
  },
  {
    id: "ljubljana",
    name: "Ljubljana",
    country: "Slovenia",
    region: "Europe",
    coords: [14.5058, 46.0569],
    photos: [],
    coverPhoto: "/photos/slovenia/dji_fly_20230719_151946_825_1689773464655_photo_optimized.jpg"
  },
  {
    id: "lake-bled",
    name: "Lake Bled",
    country: "Slovenia",
    region: "Europe",
    coords: [14.0946, 46.3632],
    photos: [],
    coverPhoto: "/photos/slovenia/dji_fly_20230717_120054_790_1689588812989_photo_optimized.jpg"
  },
  {
    id: "zagreb",
    name: "Zagreb",
    country: "Croatia",
    region: "Europe",
    coords: [15.9819, 45.815],
    photos: [],
    coverPhoto: "/photos/croatia/dji_fly_20230720_184358_846_1689871650053_photo_optimized.jpg"
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    region: "Europe",
    coords: [-0.1276, 51.5072],
    photos: [],
    coverPhoto: "/photos/united-kingdom/RemoteMediaFile_6554027_0_2022_04_13_10_45_08.jpg"
  },
  {
    id: "cambridge",
    name: "Cambridge",
    country: "United Kingdom",
    region: "Europe",
    coords: [0.1218, 52.2053],
    photos: [],
    coverPhoto: "/photos/united-kingdom/RemoteMediaFile_6554060_0_2022_04_15_14_10_02.jpg"
  },
  {
    id: "manchester",
    name: "Manchester",
    country: "United Kingdom",
    region: "Europe",
    coords: [-2.2426, 53.4808],
    photos: [],
    coverPhoto: "/photos/united-kingdom/IMG_1720.jpg"
  },
  {
    id: "edinburgh",
    name: "Edinburgh",
    country: "United Kingdom",
    region: "Europe",
    coords: [-3.1883, 55.9533],
    photos: [],
    coverPhoto: "/photos/united-kingdom/RemoteMediaFile_6554146_0_2022_07_10_21_51_56.jpg"
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    region: "Europe",
    coords: [2.3522, 48.8566],
    photos: [],
    coverPhoto: "/photos/france/RemoteMediaFile_6554096_0_2022_07_03_21_52_04.jpg"
  },
  {
    id: "monaco",
    name: "Monaco",
    country: "Monaco",
    region: "Europe",
    coords: [7.4246, 43.7384],
    photos: [],
    coverPhoto: "/photos/monaco/IMG_0911.jpg"
  },
  {
    id: "versailles",
    name: "Versailles",
    country: "France",
    region: "Europe",
    coords: [2.1301, 48.8014],
    photos: [],
    coverPhoto: "/photos/france/IMG_4160.jpg"
  },
  {
    id: "budapest",
    name: "Budapest",
    country: "Hungary",
    region: "Europe",
    coords: [19.0402, 47.4979],
    photos: [],
  },
  {
    id: "zurich",
    name: "Zurich",
    country: "Switzerland",
    region: "Europe",
    coords: [8.5417, 47.3769],
    photos: [],
  },
  {
    id: "st-anton",
    name: "St. Anton am Arlberg",
    country: "Austria",
    region: "Europe",
    coords: [10.2647, 47.1296],
    photos: [],
  },
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    region: "Europe",
    coords: [-9.1393, 38.7223],
    photos: [],
  },
  {
    id: "sintra",
    name: "Sintra",
    country: "Portugal",
    region: "Europe",
    coords: [-9.3817, 38.8029],
    photos: [],
  },
  {
    id: "tirana",
    name: "Tirana",
    country: "Albania",
    region: "Europe",
    coords: [19.8187, 41.3275],
    photos: [],
    coverPhoto: "/photos/albania/IMG_3469.jpg"
  },
  {
    id: "berat",
    name: "Berat",
    country: "Albania",
    region: "Europe",
    coords: [19.9522, 40.7058],
    photos: [],
    coverPhoto: "/photos/albania/IMG_6754.jpg"
  },
  {
    id: "dublin",
    name: "Dublin",
    country: "Ireland",
    region: "Europe",
    coords: [-6.2603, 53.3498],
    photos: [],
  },
  {
    id: "dingle",
    name: "Dingle",
    country: "Ireland",
    region: "Europe",
    coords: [-10.2717, 52.1409],
    photos: [],
  },
  {
    id: "split",
    name: "Split",
    country: "Croatia",
    region: "Europe",
    coords: [16.4402, 43.5081],
    photos: [],
  },
  {
    id: "mostar",
    name: "Mostar",
    country: "Bosnia and Herzegovina",
    region: "Europe",
    coords: [17.8078, 43.3438],
    photos: [],
  },
  {
    id: "dubrovnik",
    name: "Dubrovnik",
    country: "Croatia",
    region: "Europe",
    coords: [18.0944, 42.6507],
    photos: [],
  },
  {
    id: "kotor",
    name: "Kotor",
    country: "Montenegro",
    region: "Europe",
    coords: [18.7712, 42.4247],
    photos: [],
  },
  {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    region: "North Africa",
    coords: [-7.9811, 31.6295],
    photos: [],
  },
  {
    id: "porto",
    name: "Porto",
    country: "Portugal",
    region: "Europe",
    coords: [-8.6291, 41.1579],
    photos: [],
  },
  {
    id: "aveiro",
    name: "Aveiro",
    country: "Portugal",
    region: "Europe",
    coords: [-8.6538, 40.6405],
    photos: [],
  },
  {
    id: "valencia",
    name: "Valencia",
    country: "Spain",
    region: "Europe",
    coords: [-0.3763, 39.4699],
    photos: [],
  },
  {
    id: "munich",
    name: "Munich",
    country: "Germany",
    region: "Europe",
    coords: [11.582, 48.1351],
    photos: [],
  },
  {
    id: "nuremberg",
    name: "Nuremberg",
    country: "Germany",
    region: "Europe",
    coords: [11.0767, 49.4521],
    photos: [],
  },
  {
    id: "galway",
    name: "Galway",
    country: "Ireland",
    region: "Europe",
    coords: [-9.0568, 53.2707],
    photos: [],
  },
  {
    id: "buenos-aires",
    name: "Buenos Aires",
    country: "Argentina",
    region: "South America",
    coords: [-58.3816, -34.6037],
    photos: [],
    coverPhoto: "/photos/argentina/IMG_1652.jpg"
  },
  {
    id: "santiago",
    name: "Santiago",
    country: "Chile",
    region: "South America",
    coords: [-70.6693, -33.4489],
    photos: [],
    coverPhoto: "/photos/chile/IMG_1628.jpg"
  },
  {
    id: "valparaiso",
    name: "Valparaiso",
    country: "Chile",
    region: "South America",
    coords: [-71.6127, -33.0472],
    photos: [],
    coverPhoto: "/photos/chile/IMG_1605.HEIC"
  },
  {
    id: "olmue",
    name: "Olmue",
    country: "Chile",
    region: "South America",
    coords: [-71.1867, -32.9958],
    photos: [],
    coverPhoto: "/photos/chile/IMG_1723.JPG"
  },
  {
    id: "montevideo",
    name: "Montevideo",
    country: "Uruguay",
    region: "South America",
    coords: [-56.1645, -34.9011],
    photos: [],
    coverPhoto: "/photos/uruguay/IMG_1694(1).JPG"
  },
  {
    id: "colonia-del-sacramento",
    name: "Colonia del Sacramento",
    country: "Uruguay",
    region: "South America",
    coords: [-57.8439, -34.4714],
    photos: [],
    coverPhoto: "/photos/uruguay/IMG_1675.JPG"
  },
  {
    id: "lima",
    name: "Lima",
    country: "Peru",
    region: "South America",
    coords: [-77.0428, -12.0464],
    photos: [],
    coverPhoto: "/photos/peru/IMG_3752.jpg"
  },
  {
    id: "huacachina",
    name: "Huacachina",
    country: "Peru",
    region: "South America",
    coords: [-75.7639, -14.0875],
    photos: [],
    coverPhoto: "/photos/peru/IMG_3717.jpg",
  },
  {
    id: "cusco",
    name: "Cusco",
    country: "Peru",
    region: "South America",
    coords: [-71.9675, -13.5319],
    photos: [],
    coverPhoto: "/photos/peru/IMG_3390.jpg",
  },
  {
    id: "arequipa",
    name: "Arequipa",
    country: "Peru",
    region: "South America",
    coords: [-71.5375, -16.409],
    photos: [],
    coverPhoto: "/photos/peru/IMG_3673.jpg"
  },
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    region: "Southeast Asia",
    coords: [100.5018, 13.7563],
    photos: [],
    coverPhoto: "/photos/thailand/IMG_0014.jpg"
  },
  {
    id: "siem-reap",
    name: "Siem Reap",
    country: "Cambodia",
    region: "Southeast Asia",
    coords: [103.8564, 13.3633],
    photos: [],
    coverPhoto: "/photos/cambodia/IMG_0580.jpg"
  },
  {
    id: "phnom-penh",
    name: "Phnom Penh",
    country: "Cambodia",
    region: "Southeast Asia",
    coords: [104.9282, 11.5564],
    photos: [],
    coverPhoto: "/photos/cambodia/IMG_0783.jpg"
  },
  {
    id: "ho-chi-minh-city",
    name: "Ho Chi Minh City",
    country: "Vietnam",
    region: "Southeast Asia",
    coords: [106.6297, 10.8231],
    photos: [],
    coverPhoto: "/photos/vietnam/IMG_0866.jpg"
  },
  {
    id: "ninh-binh",
    name: "Ninh Binh",
    country: "Vietnam",
    region: "Southeast Asia",
    coords: [105.9745, 20.2506],
    photos: [],
    coverPhoto: "/photos/vietnam/IMG_9016.jpg"
  },
  {
    id: "hoi-an",
    name: "Hoi An",
    country: "Vietnam",
    region: "Southeast Asia",
    coords: [108.338, 15.8801],
    photos: [],
    coverPhoto: "/photos/vietnam/IMG_8992.jpg"
  },
  {
    id: "hanoi",
    name: "Hanoi",
    country: "Vietnam",
    region: "Southeast Asia",
    coords: [105.8342, 21.0278],
    photos: [],
    coverPhoto: "/photos/vietnam/IMG_1122.jpg"
  },
  {
    id: "ha-long-bay",
    name: "Ha Long Bay",
    country: "Vietnam",
    region: "Southeast Asia",
    coords: [107.0448, 20.9101],
    photos: [],
    coverPhoto: "/photos/vietnam/IMG_9165.jpg"
  },
];

export const ROUTE_SEGMENTS: RouteSegment[] = [
  { id: "dc-buenos-aires", origin: "washington-dc", destination: "buenos-aires", mode: "plane", month: "Dec 2024" },
  { id: "buenos-aires-santiago", origin: "buenos-aires", destination: "santiago", mode: "plane", month: "Jan 2025" },
  { id: "santiago-valparaiso", origin: "santiago", destination: "valparaiso", mode: "road", month: "Jan 2025" },
  { id: "valparaiso-olmue", origin: "valparaiso", destination: "olmue", mode: "road", month: "Jan 2025" },
  { id: "buenos-aires-montevideo", origin: "buenos-aires", destination: "montevideo", mode: "boat", month: "Jan 2025" },
  { id: "montevideo-colonia-del-sacramento", origin: "montevideo", destination: "colonia-del-sacramento", mode: "road", month: "Jan 2025" },
  { id: "santiago-dc", origin: "santiago", destination: "washington-dc", mode: "plane", month: "Jan 2025" },
  { id: "louisville-lima", origin: "louisville", destination: "lima", mode: "plane", month: "May 2025" },
  { id: "lima-cusco", origin: "lima", destination: "cusco", mode: "plane", month: "May 2025" },
  { id: "cusco-arequipa", origin: "cusco", destination: "arequipa", mode: "plane", month: "May 2025" },
  { id: "lima-huacachina", origin: "lima", destination: "huacachina", mode: "road", month: "May 2025" },
  { id: "arequipa-lima", origin: "arequipa", destination: "lima", mode: "plane", month: "May 2025" },
  { id: "dc-madrid", origin: "washington-dc", destination: "madrid", mode: "plane", month: "Study abroad" },
  { id: "madrid-budapest", origin: "madrid", destination: "budapest", mode: "plane", month: "Study abroad" },
  { id: "madrid-edinburgh", origin: "madrid", destination: "edinburgh", mode: "plane", month: "Study abroad" },
  { id: "madrid-zurich", origin: "madrid", destination: "zurich", mode: "plane", month: "Study abroad" },
  { id: "zurich-st-anton", origin: "zurich", destination: "st-anton", mode: "train", month: "Study abroad" },
  { id: "madrid-lisbon", origin: "madrid", destination: "lisbon", mode: "plane", month: "Study abroad" },
  { id: "lisbon-sintra", origin: "lisbon", destination: "sintra", mode: "train", month: "Study abroad" },
  { id: "madrid-tirana", origin: "madrid", destination: "tirana", mode: "plane", month: "Study abroad" },
  { id: "tirana-berat", origin: "tirana", destination: "berat", mode: "road", month: "Study abroad" },
  { id: "madrid-dublin", origin: "madrid", destination: "dublin", mode: "plane", month: "Study abroad" },
  { id: "dublin-dingle", origin: "dublin", destination: "dingle", mode: "road", month: "Study abroad" },
  { id: "madrid-split", origin: "madrid", destination: "split", mode: "plane", month: "Study abroad" },
  { id: "split-mostar", origin: "split", destination: "mostar", mode: "road", month: "Study abroad" },
  { id: "mostar-dubrovnik", origin: "mostar", destination: "dubrovnik", mode: "road", month: "Study abroad" },
  { id: "dubrovnik-kotor", origin: "dubrovnik", destination: "kotor", mode: "road", month: "Study abroad" },
  { id: "kotor-madrid", origin: "kotor", destination: "madrid", mode: "plane", month: "Study abroad" },
  { id: "madrid-marrakech", origin: "madrid", destination: "marrakech", mode: "plane", month: "Study abroad" },
  { id: "madrid-porto", origin: "madrid", destination: "porto", mode: "plane", month: "Study abroad" },
  { id: "porto-aveiro", origin: "porto", destination: "aveiro", mode: "train", month: "Study abroad" },
  { id: "madrid-valencia", origin: "madrid", destination: "valencia", mode: "train", month: "Study abroad" },
  { id: "madrid-bilbao", origin: "madrid", destination: "bilbao", mode: "plane", month: "Study abroad" },
  { id: "madrid-salamanca", origin: "madrid", destination: "salamanca", mode: "train", month: "Study abroad" },
  { id: "madrid-segovia", origin: "madrid", destination: "segovia", mode: "train", month: "Study abroad" },
  { id: "madrid-toledo", origin: "madrid", destination: "toledo", mode: "road", month: "Study abroad" },
  { id: "dc-barcelona", origin: "washington-dc", destination: "barcelona", mode: "plane", month: "Summer 2023" },
  { id: "barcelona-marseille", origin: "barcelona", destination: "marseille", mode: "train", month: "Summer 2023" },
  { id: "marseille-antibes", origin: "marseille", destination: "antibes", mode: "train", month: "Summer 2023" },
  { id: "antibes-monaco", origin: "antibes", destination: "monaco", mode: "train", month: "Summer 2023" },
  { id: "antibes-bolzano", origin: "antibes", destination: "bolzano", mode: "train", month: "Summer 2023" },
  { id: "bolzano-dolomites", origin: "bolzano", destination: "dolomites", mode: "road", month: "Summer 2023" },
  { id: "bolzano-venice", origin: "bolzano", destination: "venice", mode: "train", month: "Summer 2023" },
  { id: "venice-ljubljana", origin: "venice", destination: "ljubljana", mode: "train", month: "Summer 2023" },
  { id: "ljubljana-lake-bled", origin: "ljubljana", destination: "lake-bled", mode: "train", month: "Summer 2023" },
  { id: "ljubljana-zagreb", origin: "ljubljana", destination: "zagreb", mode: "train", month: "Summer 2023" },
  { id: "zagreb-dc", origin: "zagreb", destination: "washington-dc", mode: "plane", month: "Summer 2023" },
  { id: "dc-london", origin: "washington-dc", destination: "london", mode: "plane" },
  { id: "london-edinburgh", origin: "london", destination: "edinburgh", mode: "train" },
  { id: "london-cambridge", origin: "london", destination: "cambridge", mode: "road" },
  { id: "cambridge-manchester", origin: "cambridge", destination: "manchester", mode: "road" },
  { id: "manchester-london", origin: "manchester", destination: "london", mode: "road" },
  { id: "dc-paris", origin: "washington-dc", destination: "paris", mode: "plane" },
  { id: "paris-versailles", origin: "paris", destination: "versailles", mode: "train" },
  { id: "dc-bangkok", origin: "washington-dc", destination: "bangkok", mode: "plane", month: "Summer 2024" },
  { id: "bangkok-siem-reap", origin: "bangkok", destination: "siem-reap", mode: "plane", month: "Summer 2024" },
  { id: "siem-reap-phnom-penh", origin: "siem-reap", destination: "phnom-penh", mode: "road", month: "Summer 2024" },
  { id: "phnom-penh-ho-chi-minh-city", origin: "phnom-penh", destination: "ho-chi-minh-city", mode: "plane", month: "Summer 2024" },
  { id: "ho-chi-minh-city-hoi-an", origin: "ho-chi-minh-city", destination: "hoi-an", mode: "plane", month: "Summer 2024" },
  { id: "hoi-an-ninh-binh", origin: "hoi-an", destination: "ninh-binh", mode: "road", month: "Summer 2024" },
  { id: "ninh-binh-hanoi", origin: "ninh-binh", destination: "hanoi", mode: "road", month: "Summer 2024" },
  { id: "hanoi-ha-long-bay", origin: "hanoi", destination: "ha-long-bay", mode: "road", month: "Summer 2024" },
  { id: "hanoi-bangkok", origin: "hanoi", destination: "bangkok", mode: "plane", month: "Summer 2024" },
  { id: "dc-chicago", origin: "washington-dc", destination: "chicago", mode: "plane" },
  { id: "dc-west-lafayette", origin: "washington-dc", destination: "west-lafayette", mode: "plane" },
  { id: "west-lafayette-chicago", origin: "west-lafayette", destination: "chicago", mode: "road" },
  { id: "chicago-louisville", origin: "chicago", destination: "louisville", mode: "road" },
  { id: "louisville-west-lafayette", origin: "louisville", destination: "west-lafayette", mode: "road" },
  { id: "chicago-ann-arbor", origin: "chicago", destination: "ann-arbor", mode: "train" },
  { id: "west-lafayette-ann-arbor", origin: "west-lafayette", destination: "ann-arbor", mode: "road" },
  { id: "west-lafayette-indiana-dunes", origin: "west-lafayette", destination: "indiana-dunes", mode: "road" },
  { id: "indiana-dunes-chicago", origin: "indiana-dunes", destination: "chicago", mode: "road" },
  { id: "indiana-dunes-ann-arbor", origin: "indiana-dunes", destination: "ann-arbor", mode: "road" },
  { id: "dc-boston", origin: "washington-dc", destination: "boston", mode: "road" },
  { id: "dc-castine", origin: "washington-dc", destination: "castine", mode: "road" },
  { id: "dc-corolla", origin: "washington-dc", destination: "corolla", mode: "road" },
  { id: "dc-hanover-nh", origin: "washington-dc", destination: "hanover-nh", mode: "road" },
  { id: "dc-deep-creek", origin: "washington-dc", destination: "deep-creek", mode: "road" },
  { id: "dc-north-conway", origin: "washington-dc", destination: "north-conway", mode: "road" },
  { id: "dc-white-mountains", origin: "washington-dc", destination: "white-mountains", mode: "road" },
  { id: "dc-new-paltz", origin: "washington-dc", destination: "new-paltz", mode: "road" },
  { id: "dc-blacksburg", origin: "washington-dc", destination: "blacksburg", mode: "road" },
  { id: "dc-seattle", origin: "washington-dc", destination: "seattle", mode: "plane" },
  { id: "dc-san-francisco", origin: "washington-dc", destination: "san-francisco", mode: "plane" },
  { id: "san-francisco-yosemite", origin: "san-francisco", destination: "yosemite", mode: "road" },
  { id: "dc-maui", origin: "washington-dc", destination: "maui", mode: "plane" },
  { id: "maui-oahu", origin: "maui", destination: "oahu", mode: "plane" },
  { id: "dc-philadelphia", origin: "washington-dc", destination: "philadelphia", mode: "plane" },
  { id: "west-lafayette-nashville", origin: "west-lafayette", destination: "nashville", mode: "plane" },
  { id: "dc-louisville", origin: "washington-dc", destination: "louisville", mode: "plane" },
  { id: "west-lafayette-san-juan", origin: "west-lafayette", destination: "san-juan", mode: "plane" },
  { id: "louisville-seattle", origin: "louisville", destination: "seattle", mode: "plane" },
  { id: "madrid-munich", origin: "madrid", destination: "munich", mode: "plane" },
  { id: "munich-nuremberg", origin: "munich", destination: "nuremberg", mode: "train" },
  { id: "dingle-galway", origin: "dingle", destination: "galway", mode: "road" },
  { id: "galway-dublin", origin: "galway", destination: "dublin", mode: "road" },
];

export const LOCATION_BY_ID = Object.fromEntries(LOCATIONS.map((location) => [location.id, location]));
