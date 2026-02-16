export type CitySlug =
    | "Washington-DC"
    | "Chicago"
    | "Philadelphia"
    | "Seattle"
    | "Nashville"
    | "Louisville"
    | "San-Juan"
    | "Indianapolis"
    | "Tampa"
    | "Buenos-Aires"
    | "Santiago"
    | "Lima"
    | "Montevideo"
    | "Arequipa"
    | "Cusco"
    | "London"
    | "Barcelona"
    | "Edinburgh"
    | "Paris"
    | "Zagreb"
    | "Venice"
    | "Bolzano"
    | "Ljubljana"
    | "Nice"
    | "Marseille"
    | "Madrid"
    | "Budapest"
    | "Hanoi"
    | "Bangkok"
    | "Ho-Chi-Minh-City"
    | "Siem-Reap"
    | "Phnom-Penh"
    | "Da-Nang";

export const AIRPORT_TO_CITY: Record<string, CitySlug> = {
    // North America
    IAD: "Washington-DC",
    ORD: "Chicago",
    PHL: "Philadelphia",
    SEA: "Seattle",
    BNA: "Nashville",
    SDF: "Louisville",
    SJU: "San-Juan",
    IND: "Indianapolis",
    TPA: "Tampa",

    // South America
    EZE: "Buenos-Aires",
    SCL: "Santiago",
    LIM: "Lima",
    MVD: "Montevideo",
    AQP: "Arequipa",
    CUZ: "Cusco",

    // Europe
    LHR: "London",
    BCN: "Barcelona",
    EDI: "Edinburgh",
    CDG: "Paris",
    ZAG: "Zagreb",
    VCE: "Venice",
    BZO: "Bolzano",
    LJU: "Ljubljana",
    NCE: "Nice",
    MRS: "Marseille",
    MAD: "Madrid",
    BUD: "Budapest",

    // SE Asia
    HAN: "Hanoi",
    BKK: "Bangkok",
    SGN: "Ho-Chi-Minh-City",
    REP: "Siem-Reap",
    PNH: "Phnom-Penh",
    DAD: "Da-Nang",
};

export type Photo = {
    src: string;        // must start with /photos/...
    caption?: string;
    date?: string;      // optional
};

// ✅ Put your images in /public/photos/<CitySlug>/
// Then reference them here as "/photos/<CitySlug>/<filename>"

export const PHOTO_INDEX: Record<CitySlug, Photo[]> = {
    "Washington-DC": [
        // { src: "/photos/Washington-DC/iad-1.jpg", caption: "Dulles -> somewhere" },
    ],
    Chicago: [],
    Philadelphia: [],
    Seattle: [],
    Nashville: [],
    Louisville: [],
    "San-Juan": [],
    Indianapolis: [],
    Tampa: [],
    "Buenos-Aires": [],
    Santiago: [],
    Lima: [],
    Montevideo: [],
    Arequipa: [],
    Cusco: [],
    London: [],
    Barcelona: [],
    Edinburgh: [],
    Paris: [],
    Zagreb: [],
    Venice: [],
    Bolzano: [],
    Ljubljana: [],
    Nice: [],
    Marseille: [],
    Madrid: [
        { src: "/photos/Madrid/atletico-game.jpg", caption: "Atletico Madrid v Bodo Glimpt" },
    ],
    Budapest: [],
    Hanoi: [],
    Bangkok: [],
    "Ho-Chi-Minh-City": [],
    "Siem-Reap": [],
    "Phnom-Penh": [],
    "Da-Nang": [],
};

export function getCityForAirport(airportCode: string): CitySlug | null {
    return AIRPORT_TO_CITY[airportCode] ?? null;
}

export function getPhotosForAirport(airportCode: string): Photo[] {
    const city = getCityForAirport(airportCode);
    if (!city) return [];
    return PHOTO_INDEX[city] ?? [];
}
