// lib/flights.ts

export const TRIPS = [
    { origin: "IAD", destination: "BCN" }, // DC to Barcelona
    { origin: "IAD", destination: "EDI" }, // DC to Edinburgh

    // South America
    // December 2024/January 2025 New Years
    { origin: "IAD", destination: "EZE" }, // DC to Buenos Aires
    { origin: "EZE", destination: "SCL" }, // Buenos Aires to Santiago
    { origin: "EZE", destination: "MVD" }, // Buenos Aires to Montevideo 
    { origin: "SCL", destination: "IAD" }, // Santiago to DC

    // May 2025 Machu Picchu!
    { origin: "SDF", destination: "LIM" }, // Louisville to Lima
    { origin: "LIM", destination: "CUZ" }, // Lima to Cusco
    { origin: "CUZ", destination: "AQP" }, // Cusco to Arequipa
    { origin: "AQP", destination: "LIM" }, // Arequipa to Lima

    // Puerto Ricoooo
    { origin: "IND", destination: "SJU" }, // Indianapolis to San Juan

    // Add your real trips here!
    // Example:
    // { origin: "BCN", destination: "SCL" },
    // { origin: "HAN", destination: "SGN" },
];
