export const AIRPORTS: Record<string, { coords: [number, number]; name: string }> =
{
    // NORTH AMERICA ---------------------------
    IAD: { coords: [-77.4565, 38.9531], name: "Washington Dulles International Airport" },
    ORD: { coords: [-87.9048, 41.9742], name: "Chicago O'Hare International Airport" },
    PHL: { coords: [-75.2411, 39.8729], name: "Philadelphia International Airport" },
    SEA: { coords: [-122.3088, 47.4502], name: "Seattle-Tacoma International Airport" },
    BNA: { coords: [-86.6782, 36.1263], name: "Nashville International Airport" },
    SDF: { coords: [-85.7360, 38.1744], name: "Louisville Muhammad Ali International Airport" },
    SJU: { coords: [-66.0018, 18.4394], name: "Luis Muñoz Marín International Airport" },
    IND: { coords: [-86.2944, 39.7173], name: "Indianapolis International Airport" },
    // KLAF: { coords: [-86.937, 40.412], name: "Purdue University Airport" },

    // SOUTH AMERICA ---------------------------
    EZE: { coords: [-58.5358, -34.8222], name: "Buenos Aires Ministro Pistarini" },
    SCL: { coords: [-70.7858, -33.3930], name: "Santiago International Airport" },
    LIM: { coords: [-77.1143, -12.0219], name: "Lima Jorge Chávez International Airport" },
    MVD: { coords: [-56.0263, -34.8311], name: "Montevideo Carrasco International Airport" },
    AQP: { coords: [-71.3440, -16.3411], name: "Arequipa Rodríguez Ballón International Airport" },
    CUZ: { coords: [-71.9410, -13.5357], name: "Cusco Alejandro Velasco Astete International Airport" },

    // EUROPE ---------------------------------
    LHR: { coords: [-0.4543, 51.4700], name: "London Heathrow Airport" },
    BCN: { coords: [2.0785, 41.2974], name: "Barcelona-El Prat Airport" },
    EDI: { coords: [-3.3615, 55.9508], name: "Edinburgh Airport" },
    CDG: { coords: [2.5670, 49.0097], name: "Paris Charles de Gaulle Airport" },
    ZAG: { coords: [16.0615, 45.7429], name: "Zagreb Airport" },
    VCE: { coords: [12.3519, 45.5053], name: "Venice Marco Polo Airport" },
    BZO: { coords: [11.3264, 46.4603], name: "Bolzano Airport" },
    LJU: { coords: [14.4576, 46.2237], name: "Ljubljana Jože Pučnik Airport" },
    NCE: { coords: [7.2159, 43.6584], name: "Nice Côte d'Azur Airport" },
    ADX: { coords: [-2.8684, 56.3729], name: "RAF Leuchars / St Andrews" },
    MRS: { coords: [5.2214, 43.4393], name: "Marseille Provence Airport" },

    // SOUTHEAST ASIA -------------------------
    HAN: { coords: [105.8042, 21.2212], name: "Hanoi Noi Bai International Airport" },
    BKK: { coords: [100.7501, 13.6900], name: "Bangkok Suvarnabhumi Airport" },
    SGN: { coords: [106.6620, 10.8185], name: "Ho Chi Minh City Tan Son Nhat Airport" },
    REP: { coords: [103.8130, 13.4120], name: "Siem Reap Angkor International Airport" },
    PNH: { coords: [104.8440, 11.5466], name: "Phnom Penh International Airport" },
    DAD: { coords: [108.1990, 16.0439], name: "Da Nang International Airport" },
};