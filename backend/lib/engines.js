export const ENGINES = [
    {
        name: "Trent XWB-84", // XWB = Extra Wide Body Airbus A350-900 long haul
        aircraftBurnKgPerKm: 6.03,
        minKm: 5000,
        maxKm: 8500,
        passengers: 440
    },
    {
        name: "RB211-535E4", // Boeing 757
        aircraftBurnKgPerKm: 4.6,
        minKm: 3000,
        maxKm: 5500,
        passengers: 200
    },
    {
        name: "Pearl 15", // Bombardier Global 5500/6500
        aircraftBurnKgPerKm: 1.6,
        minKm: 2000,
        maxKm: 5500,
        passengers: 16
    },
    {
        name: "AE 3007", // Embraer Legacy 600/650 business jet
        aircraftBurnKgPerKm: 1.3,
        minKm: 300,
        maxKm: 3000,
        passengers: 13
    },
];

/* Sources
Burn rates calculated based on approximate co2 emissions (kg/hour), divided by # of engines

Engine Burn Rate:
Trent XWB-84: https://www.rolls-royce.com/products-and-services/civil-aerospace/widebody/trent-xwb.aspx#section-overview
RB211-535E4:https://www.boeing.com/content/dam/boeing/boeingdotcom/company/about_bca/startup/pdf/historical/757_passenger.pdf
Pearl 15: https://www.rolls-royce.com/products-and-services/civil-aerospace/business-aviation/pearl-15.aspx#/
AE 3007: https://www.rolls-royce.com/products-and-services/civil-aerospace/business-aviation/ae-3007.aspx#/

Seating:
Trent XWB-84: https://aircraft.airbus.com/en/aircraft/a350/a350-900
RB211-535E4: https://www.boeing.com/content/dam/boeing/boeingdotcom/company/about_bca/startup/pdf/historical/757_passenger.pdf
Pearl 15: https://bombardier.com/en/aircraft/global-5500#bba-pdp-section-1
AE 3007: https://etonaviation.com/blog/embraer-legacy-600-650/ 
*/
